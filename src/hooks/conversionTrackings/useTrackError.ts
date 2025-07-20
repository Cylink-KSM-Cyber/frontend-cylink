/**
 * Error Tracking
 *
 * Provides a hook for tracking error events in PostHog analytics.
 * Encapsulates logic for capturing error occurrences with additional properties.
 *
 * @module src/hooks/conversionTrackings/useTrackError
 */
import { useCallback } from "react";
import posthogClient, { PostHogEventProperties } from "@/utils/posthogClient";
import { getBaseEventProperties } from "@/utils/conversionTrackingEventUtils";

export const useTrackError = () => {
  const trackError = useCallback(
    (
      errorType: string,
      errorMessage: string,
      properties: PostHogEventProperties = {}
    ) => {
      if (
        !errorType ||
        typeof errorType !== "string" ||
        errorType.trim().length === 0
      ) {
        console.warn("Invalid errorType provided to trackError");
        return;
      }
      if (
        !errorMessage ||
        typeof errorMessage !== "string" ||
        errorMessage.trim().length === 0
      ) {
        console.warn("Invalid errorMessage provided to trackError");
        return;
      }
      const eventProperties = {
        ...getBaseEventProperties(),
        error_type: errorType,
        error_message: errorMessage,
        ...properties,
      };
      posthogClient.captureEvent("error_occurred", eventProperties);
    },
    []
  );
  return { trackError };
};
