/**
 * Interstitial Redirect Hook
 * 
 * Manages countdown timer, auto-redirect, manual redirect fallback,
 * and browser history manipulation for the interstitial page experience.
 * 
 * @module src/hooks/useInterstitialRedirect
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { InterstitialState, RedirectMethod } from "@/interfaces/interstitial";
import logger from "@/utils/logger";

interface UseInterstitialRedirectOptions {
  /**
   * Short code from URL
   */
  shortCode: string;

  /**
   * Original URL to redirect to
   */
  originalUrl: string | null;

  /**
   * Countdown duration in seconds
   */
  countdownDuration?: number;

  /**
   * Callback when redirect occurs
   * @param method - Type of redirect (auto/manual/failed)
   * @param timeLeft - Time remaining when redirect occurred
   */
  onRedirect?: (method: RedirectMethod, timeLeft: number) => void;

  /**
   * Callback when countdown completes
   */
  onCountdownComplete?: () => void;

  /**
   * Callback when user bounces (leaves during countdown)
   * @param timeLeft - Time remaining when bounce occurred
   */
  onBounce?: (timeLeft: number) => void;
}

interface UseInterstitialRedirectReturn {
  /**
   * Current state of the interstitial
   */
  state: Pick<InterstitialState, "timeLeft" | "isRedirecting" | "redirectFailed">;

  /**
   * Trigger manual redirect
   */
  handleManualRedirect: () => void;

  /**
   * Time spent on page so far
   */
  timeSpent: number;
}

/**
 * Custom hook for managing interstitial redirect logic
 */
export function useInterstitialRedirect({
  shortCode,
  originalUrl,
  countdownDuration = 10,
  onRedirect,
  onCountdownComplete,
  onBounce,
}: UseInterstitialRedirectOptions): UseInterstitialRedirectReturn {
  const [timeLeft, setTimeLeft] = useState(countdownDuration);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectFailed, setRedirectFailed] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  const redirectAttemptedRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());
  const timeSpentIntervalRef = useRef<NodeJS.Timeout>();

  /**
   * Perform the redirect to original URL
   */
  const performRedirect = useCallback(
    (method: RedirectMethod) => {
      logger.info(`[REDIRECT] performRedirect called with method: ${method}`);
      
      // Prevent multiple redirect attempts
      if (redirectAttemptedRef.current) {
        logger.warn(`[REDIRECT] Redirect already attempted, skipping`);
        return;
      }

      if (!originalUrl) {
        logger.error(`[REDIRECT] No original URL provided, cannot redirect`);
        return;
      }

      redirectAttemptedRef.current = true;
      setIsRedirecting(true);

      logger.info(`[REDIRECT] Performing ${method} redirect for ${shortCode} to ${originalUrl}`);

      try {
        // Call redirect callback
        if (onRedirect) {
          logger.debug(`[REDIRECT] Calling onRedirect callback`);
          onRedirect(method, timeLeft);
        }

        // Use replace to avoid adding to history
        logger.info(`[REDIRECT] Executing window.location.replace(${originalUrl})`);
        window.location.replace(originalUrl);
      } catch (error) {
        logger.error("[REDIRECT] Redirect failed", error);
        setRedirectFailed(true);
        setIsRedirecting(false);
        redirectAttemptedRef.current = false;

        // Call redirect callback with failed method
        if (onRedirect) {
          onRedirect("failed", timeLeft);
        }
      }
    },
    [originalUrl, shortCode, onRedirect, timeLeft]
  );

  /**
   * Handle manual redirect button click
   */
  const handleManualRedirect = useCallback(() => {
    logger.info(`Manual redirect triggered for ${shortCode}`);
    performRedirect("manual");
  }, [performRedirect, shortCode]);

  /**
   * Manipulate browser history on mount
   * Replace current state so back button goes to referrer
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Get referrer before manipulation
      const referrer = document.referrer;

      // Replace history state so back button doesn't loop to interstitial
      if (referrer && referrer !== window.location.href) {
        logger.debug(`Setting up history manipulation, referrer: ${referrer}`);
        
        // Use history.replaceState to modify current entry
        window.history.replaceState(
          { interstitial: true, shortCode },
          "",
          window.location.href
        );

        // Add popstate listener to detect back button
        const handlePopState = () => {
          logger.info("Back button detected during interstitial");
          if (onBounce) {
            onBounce(timeLeft);
          }
          // Navigate to referrer
          if (referrer) {
            window.location.href = referrer;
          }
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
          window.removeEventListener("popstate", handlePopState);
        };
      }
    } catch (error) {
      logger.warn("History manipulation failed", error);
    }
  }, [shortCode, onBounce]);

  /**
   * Track time spent on page
   */
  useEffect(() => {
    timeSpentIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTimeSpent(elapsed);
    }, 1000);

    return () => {
      if (timeSpentIntervalRef.current) {
        clearInterval(timeSpentIntervalRef.current);
      }
    };
  }, []);

  /**
   * Handle countdown
   */
  useEffect(() => {
    logger.debug(`[COUNTDOWN] useEffect triggered - timeLeft: ${timeLeft}, originalUrl: ${!!originalUrl}, isRedirecting: ${isRedirecting}`);
    
    // Don't start countdown if no URL or already redirecting
    if (!originalUrl) {
      logger.warn(`[COUNTDOWN] No original URL, cannot start countdown`);
      return;
    }

    if (isRedirecting) {
      logger.debug(`[COUNTDOWN] Already redirecting, skipping countdown`);
      return;
    }

    if (timeLeft <= 0) {
      logger.debug(`[COUNTDOWN] Time is already 0, skipping countdown`);
      return;
    }

    logger.debug(`[COUNTDOWN] Starting countdown timer for ${timeLeft} seconds`);

    const timerId = setTimeout(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        logger.debug(`[COUNTDOWN] Tick: ${prev} -> ${newTime}`);

        // Countdown complete - trigger auto redirect
        if (newTime <= 0) {
          logger.info("[COUNTDOWN] Countdown completed! Triggering auto redirect");
          
          if (onCountdownComplete) {
            logger.debug("[COUNTDOWN] Calling onCountdownComplete callback");
            onCountdownComplete();
          }
          
          logger.info("[COUNTDOWN] Calling performRedirect('auto')");
          performRedirect("auto");
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => {
      logger.debug(`[COUNTDOWN] Cleaning up timer for timeLeft: ${timeLeft}`);
      clearTimeout(timerId);
    };
  }, [timeLeft, originalUrl, isRedirecting, onCountdownComplete, performRedirect]);

  /**
   * Detect page unload (bounce/close tab)
   */
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!redirectAttemptedRef.current && onBounce) {
        logger.info("User bouncing from interstitial page");
        onBounce(timeLeft);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [onBounce, timeLeft]);

  return {
    state: {
      timeLeft,
      isRedirecting,
      redirectFailed,
    },
    handleManualRedirect,
    timeSpent,
  };
}

export default useInterstitialRedirect;

