/**
 * URL Click Conversion Tracking
 *
 * Provides a hook for tracking URL click conversion events in PostHog analytics.
 * Encapsulates logic for capturing URL clicks with relevant metadata.
 *
 * @module src/hooks/conversionTrackings/useTrackUrlClick
 */
import { useCallback } from "react";
import posthogClient, { PostHogEventProperties } from "@/utils/posthogClient";
import { UrlClickProperties } from "@/interfaces/conversionTracking";

export const useTrackUrlClick = () => {
  const trackUrlClick = useCallback((properties: UrlClickProperties) => {
    if (!properties.short_code || properties.short_code.trim().length === 0) {
      console.warn("Invalid short_code provided to trackUrlClick");
      return;
    }
    const eventProperties: PostHogEventProperties = {
      timestamp: new Date().toISOString(),
      source:
        typeof window !== "undefined" ? window.location.pathname : "server",
      user_agent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      screen_resolution:
        typeof screen !== "undefined"
          ? `${screen.width}x${screen.height}`
          : undefined,
      ...properties,
    };
    posthogClient.captureEvent("url_clicked", eventProperties);
  }, []);
  return { trackUrlClick };
};
