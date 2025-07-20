/**
 * Feature Usage Tracking
 *
 * Provides a hook for tracking feature usage events in PostHog analytics.
 * Encapsulates logic for capturing feature usage with additional properties.
 *
 * @module src/hooks/conversionTrackings/useTrackFeatureUsage
 */
import { useCallback } from "react";
import posthogClient, { PostHogEventProperties } from "@/utils/posthogClient";

export const useTrackFeatureUsage = () => {
  const trackFeatureUsage = useCallback(
    (featureName: string, properties: PostHogEventProperties = {}) => {
      if (
        !featureName ||
        typeof featureName !== "string" ||
        featureName.trim().length === 0
      ) {
        console.warn("Invalid featureName provided to trackFeatureUsage");
        return;
      }
      const eventProperties = {
        timestamp: new Date().toISOString(),
        source:
          typeof window !== "undefined" ? window.location.pathname : "server",
        user_agent:
          typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        screen_resolution:
          typeof screen !== "undefined"
            ? `${screen.width}x${screen.height}`
            : undefined,
        feature_name: featureName,
        ...properties,
      };
      posthogClient.captureEvent("feature_used", eventProperties);
    },
    []
  );
  return { trackFeatureUsage };
};
