/**
 * URL Creation Conversion Tracking
 *
 * Provides a hook for tracking URL creation conversion events in PostHog analytics.
 * Encapsulates logic for capturing URL creation with relevant metadata.
 *
 * @module src/hooks/conversionTrackings/useTrackUrlCreation
 */
import { useCallback } from "react";
import posthogClient, { PostHogEventProperties } from "@/utils/posthogClient";
import { UrlCreationProperties } from "@/interfaces/conversionTracking";

export const useTrackUrlCreation = () => {
  const trackUrlCreation = useCallback((properties: UrlCreationProperties) => {
    if (!properties.url_id || properties.url_id <= 0) {
      console.warn("Invalid url_id provided to trackUrlCreation");
      return;
    }
    if (!properties.url_title || properties.url_title.trim().length === 0) {
      console.warn("Invalid url_title provided to trackUrlCreation");
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
    posthogClient.captureEvent("url_created", eventProperties);
  }, []);
  return { trackUrlCreation };
};
