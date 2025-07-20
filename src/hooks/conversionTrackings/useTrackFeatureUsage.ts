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
import { getBaseEventProperties } from "@/utils/conversionTrackingEventUtils";

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
        ...getBaseEventProperties(),
        feature_name: featureName,
        ...properties,
      };
      posthogClient.captureEvent("feature_used", eventProperties);
    },
    []
  );
  return { trackFeatureUsage };
};
