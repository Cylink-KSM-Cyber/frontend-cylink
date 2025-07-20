/**
 * URL Edit Conversion Tracking
 *
 * Provides a hook for tracking URL edit conversion events in PostHog analytics.
 * Encapsulates logic for capturing URL edits with relevant metadata.
 *
 * @module src/hooks/conversionTrackings/useTrackUrlEdit
 */
import { useCallback } from "react";
import posthogClient, { PostHogEventProperties } from "@/utils/posthogClient";
import { UrlEditProperties } from "@/interfaces/conversionTracking";

export const useTrackUrlEdit = () => {
  const trackUrlEdit = useCallback((properties: UrlEditProperties) => {
    if (!properties.url_id || properties.url_id <= 0) {
      console.warn("Invalid url_id provided to trackUrlEdit");
      return;
    }
    if (!properties.url_title || properties.url_title.trim().length === 0) {
      console.warn("Invalid url_title provided to trackUrlEdit");
      return;
    }
    if (!Array.isArray(properties.fields_modified)) {
      console.warn("Invalid fields_modified provided to trackUrlEdit");
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
      fields_modified: properties.fields_modified.join(","),
    };
    posthogClient.captureEvent("url_edited", eventProperties);
  }, []);
  return { trackUrlEdit };
};
