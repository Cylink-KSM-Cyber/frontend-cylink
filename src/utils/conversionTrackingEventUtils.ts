/**
 * Conversion Tracking Event Utilities
 *
 * Provides shared utility functions for conversion tracking hooks, such as generating
 * base event properties for PostHog analytics events.
 *
 * @module src/utils/conversionTrackingEventUtils
 */
import { PostHogEventProperties } from "@/utils/posthogClient";

/**
 * Get base event properties for PostHog analytics events.
 * Includes timestamp, source, user agent, and screen resolution.
 *
 * @returns {PostHogEventProperties} Base event properties
 */
export function getBaseEventProperties(): PostHogEventProperties {
  return {
    timestamp: new Date().toISOString(),
    source: typeof window !== "undefined" ? window.location.pathname : "server",
    user_agent:
      typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    screen_resolution:
      typeof screen !== "undefined"
        ? `${screen.width}x${screen.height}`
        : undefined,
  };
}
