import posthog from "posthog-js";

// This is a client-side only file
const isClient = typeof window !== "undefined";

// Initialize PostHog if we're on the client side and it hasn't been initialized yet
if (isClient && !posthog.__loaded) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  });
}

/**
 * Type for user properties that can be sent to PostHog
 */
export type PostHogUserProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

/**
 * Type for event properties that can be sent to PostHog
 */
export type PostHogEventProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

/**
 * Identify a user in PostHog
 * @param userId - User ID to identify
 * @param userProperties - Additional user properties
 */
export const identifyUser = (
  userId: string,
  userProperties?: PostHogUserProperties
) => {
  if (isClient) {
    posthog.identify(userId, userProperties);
  }
};

/**
 * Capture a custom event in PostHog
 * @param eventName - Name of the event to capture
 * @param properties - Additional event properties
 */
export const captureEvent = (
  eventName: string,
  properties?: PostHogEventProperties
) => {
  if (isClient) {
    posthog.capture(eventName, properties);
  }
};

/**
 * Reset the current user in PostHog (for logout)
 */
export const resetUser = () => {
  if (isClient) {
    posthog.reset();
  }
};

/**
 * Check if a feature flag is enabled for the current user
 * @param flagKey - The feature flag key to check
 * @returns boolean indicating if the flag is enabled
 */
export const isFeatureEnabled = (flagKey: string): boolean => {
  if (!isClient) {
    return false;
  }

  const flagValue = posthog.isFeatureEnabled(flagKey);
  return flagValue === true;
};

/**
 * Get feature flag value with payload (if any)
 * @param flagKey - The feature flag key to check
 * @returns The flag value (boolean, string, or object) or undefined
 */
export const getFeatureFlag = (
  flagKey: string
): string | boolean | undefined => {
  if (!isClient) {
    return undefined;
  }

  return posthog.getFeatureFlag(flagKey);
};

/**
 * Get feature flag payload
 * @param flagKey - The feature flag key to check
 * @returns The payload object or undefined
 */
export const getFeatureFlagPayload = (
  flagKey: string
): Record<string, unknown> | undefined => {
  if (!isClient) {
    return undefined;
  }

  return posthog.getFeatureFlagPayload(flagKey) as
    | Record<string, unknown>
    | undefined;
};

// Export the raw posthog instance for React hooks usage
export { posthog };

// Create a named object before exporting as default
const posthogClient = {
  identifyUser,
  captureEvent,
  resetUser,
  isFeatureEnabled,
  getFeatureFlag,
  getFeatureFlagPayload,
};

export default posthogClient;
