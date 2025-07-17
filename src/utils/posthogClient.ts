import posthog from 'posthog-js';

// This is a client-side only file
const isClient = typeof window !== 'undefined';

// Initialize PostHog if we're on the client side and it hasn't been initialized yet
if (isClient && !posthog.__loaded) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: '/ingest',
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development',
  });
}

/**
 * Identify a user in PostHog
 * @param userId - User ID to identify
 * @param userProperties - Additional user properties
 */
export const identifyUser = (userId: string, userProperties?: Record<string, any>) => {
  if (isClient) {
    posthog.identify(userId, userProperties);
  }
};

/**
 * Capture a custom event in PostHog
 * @param eventName - Name of the event to capture
 * @param properties - Additional event properties
 */
export const captureEvent = (eventName: string, properties?: Record<string, any>) => {
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

export default {
  identifyUser,
  captureEvent,
  resetUser,
};