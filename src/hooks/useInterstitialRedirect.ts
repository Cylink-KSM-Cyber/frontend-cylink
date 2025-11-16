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
      // Prevent multiple redirect attempts
      if (redirectAttemptedRef.current) {
        return;
      }

      if (!originalUrl) {
        logger.error("No original URL provided, cannot redirect");
        return;
      }

      redirectAttemptedRef.current = true;
      setIsRedirecting(true);

      try {
        // Call redirect callback
        if (onRedirect) {
          onRedirect(method, timeLeft);
        }

        // Use replace to avoid adding to history
        window.location.replace(originalUrl);
      } catch (error) {
        logger.error("Redirect failed", error);
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
    performRedirect("manual");
  }, [performRedirect]);

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
        // Use history.replaceState to modify current entry
        window.history.replaceState(
          { interstitial: true, shortCode },
          "",
          window.location.href
        );

        // Add popstate listener to detect back button
        const handlePopState = () => {
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
      logger.error("History manipulation failed", error);
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
    // Don't start countdown if no URL or already redirecting
    if (!originalUrl || isRedirecting || timeLeft <= 0) {
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;

        // Countdown complete - trigger auto redirect
        if (newTime <= 0) {
          if (onCountdownComplete) {
            onCountdownComplete();
          }
          
          performRedirect("auto");
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [timeLeft, originalUrl, isRedirecting, onCountdownComplete, performRedirect]);

  /**
   * Detect page unload (bounce/close tab)
   */
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!redirectAttemptedRef.current && onBounce) {
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

