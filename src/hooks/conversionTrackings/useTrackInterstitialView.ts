/**
 * Interstitial View Tracking
 * 
 * Provides hooks for tracking detailed analytics on the interstitial page,
 * including views, countdown completion, manual redirects, and bounces.
 * 
 * @module src/hooks/conversionTrackings/useTrackInterstitialView
 */

import { useCallback } from "react";
import posthogClient, { PostHogEventProperties } from "@/utils/posthogClient";
import {
  InterstitialViewedProperties,
  InterstitialCountdownCompletedProperties,
  InterstitialManualRedirectProperties,
  InterstitialAutoRedirectProperties,
  InterstitialBouncedProperties,
  InterstitialRedirectFailedProperties,
} from "@/interfaces/conversionTrackings/InterstitialViewProperties";
import { getBaseEventProperties } from "@/utils/conversionTrackingEventUtils";
import logger from "@/utils/logger";

/**
 * Hook for tracking interstitial page view
 */
export const useTrackInterstitialView = () => {
  /**
   * Track when interstitial page is viewed
   */
  const trackInterstitialViewed = useCallback(
    (properties: InterstitialViewedProperties) => {
      try {
        if (!properties.short_code || properties.short_code.trim().length === 0) {
          logger.warn("Invalid short_code provided to trackInterstitialViewed");
          return;
        }

        const eventProperties: PostHogEventProperties = {
          ...getBaseEventProperties(),
          ...properties,
          event_type: "interstitial_viewed",
        };

        posthogClient.captureEvent("interstitial_viewed", eventProperties);
        logger.debug(`Interstitial viewed tracked: ${properties.short_code}`);
      } catch (error) {
        logger.error("Failed to track interstitial viewed", error);
      }
    },
    []
  );

  /**
   * Track when countdown completes
   */
  const trackInterstitialCountdownCompleted = useCallback(
    (properties: InterstitialCountdownCompletedProperties) => {
      try {
        if (!properties.short_code || properties.short_code.trim().length === 0) {
          logger.warn("Invalid short_code provided to trackInterstitialCountdownCompleted");
          return;
        }

        const eventProperties: PostHogEventProperties = {
          ...getBaseEventProperties(),
          ...properties,
          event_type: "countdown_completed",
        };

        posthogClient.captureEvent("interstitial_countdown_completed", eventProperties);
        logger.debug(`Countdown completed tracked: ${properties.short_code}`);
      } catch (error) {
        logger.error("Failed to track countdown completed", error);
      }
    },
    []
  );

  /**
   * Track when user manually clicks redirect button
   */
  const trackInterstitialManualRedirect = useCallback(
    (properties: InterstitialManualRedirectProperties) => {
      try {
        if (!properties.short_code || properties.short_code.trim().length === 0) {
          logger.warn("Invalid short_code provided to trackInterstitialManualRedirect");
          return;
        }

        const eventProperties: PostHogEventProperties = {
          ...getBaseEventProperties(),
          ...properties,
          event_type: "manual_redirect",
        };

        posthogClient.captureEvent("interstitial_manual_redirect", eventProperties);
        logger.debug(`Manual redirect tracked: ${properties.short_code}`);
      } catch (error) {
        logger.error("Failed to track manual redirect", error);
      }
    },
    []
  );

  /**
   * Track when auto redirect occurs after countdown
   */
  const trackInterstitialAutoRedirect = useCallback(
    (properties: InterstitialAutoRedirectProperties) => {
      try {
        if (!properties.short_code || properties.short_code.trim().length === 0) {
          logger.warn("Invalid short_code provided to trackInterstitialAutoRedirect");
          return;
        }

        const eventProperties: PostHogEventProperties = {
          ...getBaseEventProperties(),
          ...properties,
          event_type: "auto_redirect",
        };

        posthogClient.captureEvent("interstitial_auto_redirect", eventProperties);
        logger.debug(`Auto redirect tracked: ${properties.short_code}`);
      } catch (error) {
        logger.error("Failed to track auto redirect", error);
      }
    },
    []
  );

  /**
   * Track when user bounces (leaves during countdown)
   */
  const trackInterstitialBounced = useCallback(
    (properties: InterstitialBouncedProperties) => {
      try {
        if (!properties.short_code || properties.short_code.trim().length === 0) {
          logger.warn("Invalid short_code provided to trackInterstitialBounced");
          return;
        }

        const eventProperties: PostHogEventProperties = {
          ...getBaseEventProperties(),
          ...properties,
          event_type: "bounced",
        };

        posthogClient.captureEvent("interstitial_bounced", eventProperties);
        logger.debug(`Bounce tracked: ${properties.short_code}`);
      } catch (error) {
        logger.error("Failed to track bounce", error);
      }
    },
    []
  );

  /**
   * Track when redirect fails
   */
  const trackInterstitialRedirectFailed = useCallback(
    (properties: InterstitialRedirectFailedProperties) => {
      try {
        if (!properties.short_code || properties.short_code.trim().length === 0) {
          logger.warn("Invalid short_code provided to trackInterstitialRedirectFailed");
          return;
        }

        const eventProperties: PostHogEventProperties = {
          ...getBaseEventProperties(),
          ...properties,
          event_type: "redirect_failed",
        };

        posthogClient.captureEvent("interstitial_redirect_failed", eventProperties);
        logger.error(`Redirect failed tracked: ${properties.short_code}`);
      } catch (error) {
        logger.error("Failed to track redirect failure", error);
      }
    },
    []
  );

  return {
    trackInterstitialViewed,
    trackInterstitialCountdownCompleted,
    trackInterstitialManualRedirect,
    trackInterstitialAutoRedirect,
    trackInterstitialBounced,
    trackInterstitialRedirectFailed,
  };
};

export default useTrackInterstitialView;

