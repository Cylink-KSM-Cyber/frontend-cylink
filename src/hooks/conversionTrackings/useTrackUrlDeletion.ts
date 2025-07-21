/**
 * URL Deletion Conversion Tracking
 *
 * Provides a hook for tracking URL deletion conversion events in PostHog analytics.
 * Encapsulates logic for capturing URL deletions with relevant metadata and sanitization.
 *
 * @module src/hooks/conversionTrackings/useTrackUrlDeletion
 */
import { useCallback } from "react";
import posthogClient, { PostHogEventProperties } from "@/utils/posthogClient";
import { UrlDeletionProperties } from "@/interfaces/conversionTrackings/UrlDeletionProperties";
import { getBaseEventProperties } from "@/utils/conversionTrackingEventUtils";

export const useTrackUrlDeletion = () => {
  const trackUrlDeletion = useCallback((properties: UrlDeletionProperties) => {
    if (!properties.url_id || properties.url_id <= 0) {
      console.warn("Invalid url_id provided to trackUrlDeletion");
      return;
    }
    if (!properties.url_title || properties.url_title.trim().length === 0) {
      console.warn("Invalid url_title provided to trackUrlDeletion");
      return;
    }
    if (!properties.short_code || properties.short_code.trim().length === 0) {
      console.warn("Invalid short_code provided to trackUrlDeletion");
      return;
    }
    const sanitizedProperties = {
      ...properties,
      url_title: properties.url_title?.substring(0, 100),
      short_code: properties.short_code?.substring(0, 50),
      deletion_reason: properties.deletion_reason?.substring(0, 200),
    };
    const eventProperties: PostHogEventProperties = {
      ...getBaseEventProperties(),
      ...sanitizedProperties,
    };
    posthogClient.captureEvent("url_deleted", eventProperties);
  }, []);
  return { trackUrlDeletion };
};
