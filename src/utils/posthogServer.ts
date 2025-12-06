/**
 * Server-Side PostHog Client
 *
 * Provides PostHog functionality for server-side contexts like middleware
 * and API routes. Uses posthog-node for server-side feature flag evaluation.
 *
 * @module src/utils/posthogServer
 */

import { PostHog } from "posthog-node";

// Initialize PostHog Node client
const posthogServer = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
});

/**
 * Check if a feature flag is enabled for a given user
 * @param flagKey - The feature flag key to check
 * @param distinctId - The user's distinct ID (user ID or anonymous ID)
 * @returns Promise<boolean> indicating if the flag is enabled
 */
export async function isFeatureEnabledServer(
  flagKey: string,
  distinctId: string
): Promise<boolean> {
  try {
    const flagValue = await posthogServer.isFeatureEnabled(flagKey, distinctId);
    return flagValue === true;
  } catch (error) {
    console.error(
      `[PostHog Server] Error checking feature flag ${flagKey}:`,
      error
    );
    // Default to false on error (fail closed)
    return false;
  }
}

/**
 * Get feature flag value with payload
 * @param flagKey - The feature flag key to check
 * @param distinctId - The user's distinct ID
 * @returns Promise with flag value
 */
export async function getFeatureFlagServer(
  flagKey: string,
  distinctId: string
): Promise<string | boolean | undefined> {
  try {
    return await posthogServer.getFeatureFlag(flagKey, distinctId);
  } catch (error) {
    console.error(
      `[PostHog Server] Error getting feature flag ${flagKey}:`,
      error
    );
    return undefined;
  }
}

/**
 * Get feature flag payload
 * @param flagKey - The feature flag key to check
 * @param distinctId - The user's distinct ID
 * @returns Promise with payload object
 */
export async function getFeatureFlagPayloadServer(
  flagKey: string,
  distinctId: string
): Promise<Record<string, unknown> | undefined> {
  try {
    const payload = await posthogServer.getFeatureFlagPayload(
      flagKey,
      distinctId
    );
    return payload as Record<string, unknown> | undefined;
  } catch (error) {
    console.error(
      `[PostHog Server] Error getting feature flag payload ${flagKey}:`,
      error
    );
    return undefined;
  }
}

/**
 * Shutdown the PostHog client (call this when server is shutting down)
 */
export async function shutdownPostHogServer(): Promise<void> {
  await posthogServer.shutdown();
}

export default posthogServer;
