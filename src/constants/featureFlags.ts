/**
 * Feature Flag Constants
 * 
 * Centralized location for all feature flag keys used in the application.
 * This ensures consistency across server-side and client-side code.
 * 
 * @module src/constants/featureFlags
 */

/**
 * Feature flag for the interstitial micro-learning experience
 * 
 * When enabled: Shows 10-second interstitial page with cyber security facts
 * When disabled: Redirects directly to original URL (legacy behavior)
 */
export const FEATURE_FLAG_INTERSTITIAL = "interstitial-micro-learning";

/**
 * Default configuration for interstitial feature
 */
export const INTERSTITIAL_CONFIG = {
  COUNTDOWN_DURATION: 10, // seconds
  MIN_TIME_BEFORE_MANUAL_BUTTON: 10, // seconds
  ENABLE_ANALYTICS: true,
  SHOW_MANUAL_BUTTON: true,
} as const;

