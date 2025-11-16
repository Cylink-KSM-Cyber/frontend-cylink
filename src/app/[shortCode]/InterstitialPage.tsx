/**
 * Interstitial Page Component
 *
 * Main orchestrator for the interstitial redirect experience.
 * Displays countdown, cyber security facts, and handles redirect logic
 * with comprehensive analytics tracking.
 *
 * @module src/app/[shortCode]/InterstitialPage
 */

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  InterstitialPageProps,
  CyberSecurityFact,
  RedirectMethod,
} from "@/interfaces/interstitial";
import { useConversionTracking } from "@/hooks/useConversionTracking";
import { useInterstitialRedirect } from "@/hooks/useInterstitialRedirect";
import { getRandomFact } from "@/utils/cyberSecurityFacts";
import { getDeviceType } from "@/utils/deviceDetection";
import Logo from "@/components/atoms/Logo";
import Button from "@/components/atoms/Button";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import CountdownTimer from "@/components/atoms/CountdownTimer";
import AnimatedStatusText from "@/components/molecules/AnimatedStatusText";
import CyberSecurityFactCard from "@/components/molecules/CyberSecurityFactCard";
import logger from "@/utils/logger";

const COUNTDOWN_DURATION = 10; // seconds

const STATUS_MESSAGES = [
  "Scanning link security",
  "Loading best content for you",
  "Verifying destination",
  "Preparing your redirect",
  "Almost there",
];

const InterstitialPage: React.FC<InterstitialPageProps> = ({ shortCode }) => {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [fact, setFact] = useState<CyberSecurityFact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showManualButton, setShowManualButton] = useState(false);
  const [pageLoadTime, setPageLoadTime] = useState<number>(0);

  // Ref to prevent multiple API calls
  const isInitializedRef = useRef(false);

  const {
    trackInterstitialViewed,
    trackInterstitialCountdownCompleted,
    trackInterstitialManualRedirect,
    trackInterstitialAutoRedirect,
    trackInterstitialBounced,
    trackUrlClick,
  } = useConversionTracking();

  /**
   * Fetch original URL from API using service layer
   */
  const fetchOriginalUrl = useCallback(async (): Promise<{
    original_url: string;
    url_id?: number;
  } | null> => {
    try {
      const startTime = Date.now();

      // Use getPublic from service layer to ensure correct baseURL
      const { getPublic } = await import("@/services/api");

      const data = await getPublic<{
        status: number;
        message: string;
        data?: {
          original_url: string;
          id?: number;
        };
        original_url?: string;
        id?: number;
      }>(`/api/v1/public/urls/${shortCode}`);

      const loadTime = Date.now() - startTime;
      setPageLoadTime(loadTime);

      logger.urlShortener.debug(`Fetch completed in ${loadTime}ms`);

      // Handle different response formats
      if (data?.data?.original_url) {
        return { original_url: data.data.original_url, url_id: data.data.id };
      }
      if (data?.original_url) {
        return { original_url: data.original_url, url_id: data.id };
      }

      return null;
    } catch (error) {
      logger.urlShortener.error("Error fetching original URL", error);
      return null;
    }
  }, [shortCode]);

  /**
   * Load fact and URL on mount
   * Uses ref to prevent multiple calls
   */
  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current) {
      logger.debug("Initialization already in progress or completed, skipping");
      return;
    }

    isInitializedRef.current = true;

    const initialize = async () => {
      setIsLoading(true);
      logger.info(`Initializing interstitial page for: ${shortCode}`);

      try {
        // Load fact and URL in parallel
        const [factResult, urlResult] = await Promise.all([
          getRandomFact(),
          fetchOriginalUrl(),
        ]);

        setFact(factResult);

        if (urlResult && urlResult.original_url) {
          setOriginalUrl(urlResult.original_url);

          // Track URL click
          if (urlResult.url_id) {
            trackUrlClick({
              url_id: urlResult.url_id,
              short_code: shortCode,
              referrer: document.referrer || undefined,
            });
          }

          // Track interstitial viewed
          trackInterstitialViewed({
            short_code: shortCode,
            fact_id: factResult.id,
            fact_category: factResult.category,
            time_spent: 0,
            device_type: getDeviceType(),
            referrer: document.referrer || undefined,
            url_fetch_success: true,
            page_load_time: pageLoadTime,
            url_id: urlResult.url_id,
          });

          logger.info(
            `Successfully initialized: ${shortCode} -> ${urlResult.original_url}`
          );
        } else {
          setError("Short URL not found or has expired.");

          // Track viewed with error
          trackInterstitialViewed({
            short_code: shortCode,
            fact_id: factResult.id,
            fact_category: factResult.category,
            time_spent: 0,
            device_type: getDeviceType(),
            referrer: document.referrer || undefined,
            url_fetch_success: false,
            page_load_time: pageLoadTime,
          });

          logger.warn(`URL not found: ${shortCode}`);
        }
      } catch (err) {
        logger.error("Failed to initialize interstitial page", err);
        setError("Failed to load redirect information.");

        // Load fallback fact
        try {
          const fallbackFact = await getRandomFact();
          setFact(fallbackFact);
        } catch (factError) {
          logger.error("Failed to load fallback fact", factError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
    // Only run once on mount - shortCode should not change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handle countdown completion
   */
  const handleCountdownComplete = useCallback(() => {
    logger.info("[INTERSTITIAL] handleCountdownComplete called");

    if (!fact) {
      logger.warn(
        "[INTERSTITIAL] No fact available in handleCountdownComplete"
      );
      return;
    }

    logger.info("[INTERSTITIAL] Countdown completed for interstitial page");
    setShowManualButton(true);

    trackInterstitialCountdownCompleted({
      short_code: shortCode,
      fact_id: fact.id,
      fact_category: fact.category,
      time_spent: COUNTDOWN_DURATION,
      device_type: getDeviceType(),
      referrer: document.referrer || undefined,
      completed_without_bounce: true,
      actual_countdown_duration: COUNTDOWN_DURATION,
    });
  }, [shortCode, fact, trackInterstitialCountdownCompleted]);

  /**
   * Handle auto redirect
   */
  const handleAutoRedirect = useCallback(() => {
    logger.info("[INTERSTITIAL] handleAutoRedirect called");

    if (!fact) {
      logger.warn("[INTERSTITIAL] No fact available in handleAutoRedirect");
      return;
    }

    logger.info("[INTERSTITIAL] Auto redirect triggered - tracking analytics");

    trackInterstitialAutoRedirect({
      short_code: shortCode,
      fact_id: fact.id,
      fact_category: fact.category,
      time_spent: COUNTDOWN_DURATION,
      device_type: getDeviceType(),
      referrer: document.referrer || undefined,
      redirect_method: "auto",
      redirect_success: true,
    });

    logger.info("[INTERSTITIAL] Analytics tracked for auto redirect");
  }, [shortCode, fact, trackInterstitialAutoRedirect]);

  /**
   * Handle manual redirect
   */
  const handleManualRedirect = useCallback(
    (timeRemaining: number) => {
      logger.info(
        `[INTERSTITIAL] handleManualRedirect called with timeRemaining: ${timeRemaining}`
      );

      if (!fact) {
        logger.warn("[INTERSTITIAL] No fact available in handleManualRedirect");
        return;
      }

      logger.info(
        "[INTERSTITIAL] Manual redirect triggered - tracking analytics"
      );

      trackInterstitialManualRedirect({
        short_code: shortCode,
        fact_id: fact.id,
        fact_category: fact.category,
        time_spent: COUNTDOWN_DURATION - timeRemaining,
        device_type: getDeviceType(),
        referrer: document.referrer || undefined,
        redirect_method: "manual",
        time_remaining: timeRemaining,
      });

      logger.info("[INTERSTITIAL] Analytics tracked for manual redirect");
    },
    [shortCode, fact, trackInterstitialManualRedirect]
  );

  /**
   * Handle redirect callback
   * Memoized to prevent re-creating on every render
   */
  const handleRedirect = useCallback(
    (method: RedirectMethod, timeLeft: number) => {
      logger.info(
        `[INTERSTITIAL] onRedirect callback triggered with method: ${method}, timeLeft: ${timeLeft}`
      );

      if (method === "auto") {
        handleAutoRedirect();
      } else if (method === "manual") {
        handleManualRedirect(timeLeft);
      } else if (method === "failed") {
        logger.error("[INTERSTITIAL] Redirect failed");
      }
    },
    [handleAutoRedirect, handleManualRedirect]
  );

  /**
   * Handle bounce callback
   * Memoized to prevent re-creating on every render
   */
  const handleBounce = useCallback(
    (timeLeft: number) => {
      logger.info("[INTERSTITIAL] onBounce callback triggered");

      if (!fact) {
        logger.warn("[INTERSTITIAL] No fact available in onBounce");
        return;
      }

      logger.info("[INTERSTITIAL] User bouncing from interstitial page");

      trackInterstitialBounced({
        short_code: shortCode,
        fact_id: fact.id,
        fact_category: fact.category,
        time_spent: timeLeft ? COUNTDOWN_DURATION - timeLeft : 0,
        device_type: getDeviceType(),
        referrer: document.referrer || undefined,
        time_remaining: timeLeft,
        countdown_started: true,
      });
    },
    [shortCode, fact, trackInterstitialBounced]
  );

  /**
   * Use interstitial redirect hook
   */
  const { state, handleManualRedirect: triggerManualRedirect } =
    useInterstitialRedirect({
      shortCode,
      originalUrl,
      countdownDuration: COUNTDOWN_DURATION,
      onRedirect: handleRedirect,
      onCountdownComplete: handleCountdownComplete,
      onBounce: handleBounce,
    });

  /**
   * Show loading state
   */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <Logo size="lg" withLink={false} className="mb-8" />
        <LoadingSpinner size="large" />
        <p className="mt-4 text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  /**
   * Show error state
   */
  if (error || !originalUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <Logo size="lg" withLink={true} className="mb-8" />
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Redirect Error
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {error || "Short URL not found or has expired."}
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => (window.location.href = "/")}
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  /**
   * Show redirecting state
   */
  if (state.isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <Logo size="lg" withLink={false} className="mb-8" />
        <LoadingSpinner size="large" />
        <p className="mt-4 text-lg text-gray-600">Redirecting...</p>
      </div>
    );
  }

  /**
   * Main interstitial content
   */
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with Logo */}
      <header className="w-full py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Logo size="md" withLink={false} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl space-y-12">
          {/* Countdown Timer */}
          <CountdownTimer
            initialTime={COUNTDOWN_DURATION}
            onComplete={handleCountdownComplete}
            className="mb-8"
          />

          {/* Animated Status Text */}
          <AnimatedStatusText messages={STATUS_MESSAGES} interval={2500} />

          {/* Cyber Security Fact Card */}
          {fact && <CyberSecurityFactCard fact={fact} className="mt-8" />}

          {/* Manual Redirect Button (appears after countdown) */}
          {showManualButton && !state.isRedirecting && (
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                Automatic redirect not working?
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={triggerManualRedirect}
                fullWidth={false}
                className="min-w-[200px]"
              >
                Continue to Destination
              </Button>
            </div>
          )}

          {/* Redirect Failed State */}
          {state.redirectFailed && (
            <div className="text-center mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600 font-medium">
                Automatic redirect failed. Please click the button above to
                continue.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 text-center text-sm text-gray-500">
        <p>
          Secured by <span className="font-bold text-black">CyLink</span>
        </p>
        <p className="mt-2">
          Short URL: <span className="font-mono">{shortCode}</span>
        </p>
      </footer>
    </div>
  );
};

export default InterstitialPage;
