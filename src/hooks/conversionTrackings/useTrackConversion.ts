/**
 * Generic Conversion Tracking
 *
 * Provides a hook for tracking generic conversion goals in PostHog analytics.
 * Encapsulates logic for capturing custom conversion events with additional properties.
 *
 * @module src/hooks/conversionTrackings/useTrackConversion
 */
import { useCallback } from "react";
import posthogClient, { PostHogEventProperties } from "@/utils/posthogClient";
import { ConversionGoalType } from "@/types/conversionTracking";
import { getBaseEventProperties } from "@/utils/conversionTrackingEventUtils";

export const useTrackConversion = () => {
  const trackConversion = useCallback(
    (goalType: ConversionGoalType, properties: PostHogEventProperties = {}) => {
      if (!goalType || typeof goalType !== "string") {
        console.warn("Invalid goalType provided to trackConversion");
        return;
      }
      const eventProperties = {
        ...getBaseEventProperties(),
        ...properties,
      };
      posthogClient.captureEvent(goalType, eventProperties);
    },
    []
  );
  return { trackConversion };
};
