/**
 * Interstitial View Properties
 * 
 * Defines properties for tracking interstitial page views and interactions
 * in PostHog analytics. This enables detailed analysis of user behavior
 * during the redirect countdown experience.
 * 
 * @module src/interfaces/conversionTrackings/InterstitialViewProperties
 */

/**
 * Base properties for all interstitial tracking events
 */
export interface InterstitialBaseProperties {
  /**
   * The short code being accessed
   */
  short_code: string;

  /**
   * ID of the cyber security fact displayed
   */
  fact_id: number;

  /**
   * Category of the fact displayed
   */
  fact_category?: string;

  /**
   * Time spent on the interstitial page (in seconds)
   */
  time_spent: number;

  /**
   * Device type of the user
   */
  device_type?: string;

  /**
   * Referrer URL
   */
  referrer?: string;

  /**
   * URL ID if available
   */
  url_id?: number;
}

/**
 * Properties for interstitial page view event
 * Triggered when the interstitial page loads
 */
export interface InterstitialViewedProperties extends InterstitialBaseProperties {
  /**
   * Whether the original URL was successfully fetched
   */
  url_fetch_success: boolean;

  /**
   * Loading time for the page (in milliseconds)
   */
  page_load_time?: number;
}

/**
 * Properties for countdown completion event
 * Triggered when the full 10-second countdown completes
 */
export interface InterstitialCountdownCompletedProperties extends InterstitialBaseProperties {
  /**
   * Whether the countdown completed without interruption
   */
  completed_without_bounce: boolean;

  /**
   * Final countdown duration (should be ~10 seconds)
   */
  actual_countdown_duration: number;
}

/**
 * Properties for manual redirect event
 * Triggered when user clicks the manual redirect button
 */
export interface InterstitialManualRedirectProperties extends InterstitialBaseProperties {
  /**
   * Time remaining on countdown when button was clicked
   */
  time_remaining: number;

  /**
   * Indicates user chose manual over waiting
   */
  redirect_method: "manual";
}

/**
 * Properties for auto redirect event
 * Triggered when automatic redirect occurs after countdown
 */
export interface InterstitialAutoRedirectProperties extends InterstitialBaseProperties {
  /**
   * Indicates automatic redirect after countdown
   */
  redirect_method: "auto";

  /**
   * Whether redirect succeeded
   */
  redirect_success: boolean;
}

/**
 * Properties for bounce event
 * Triggered when user leaves during countdown (back button, close tab)
 */
export interface InterstitialBouncedProperties extends InterstitialBaseProperties {
  /**
   * Time remaining when user bounced
   */
  time_remaining: number;

  /**
   * Bounce method (back button, close tab, etc.)
   */
  bounce_method?: string;

  /**
   * Whether countdown had started
   */
  countdown_started: boolean;
}

/**
 * Properties for redirect failure event
 * Triggered when automatic redirect fails
 */
export interface InterstitialRedirectFailedProperties extends InterstitialBaseProperties {
  /**
   * Error message or reason for failure
   */
  error_message?: string;

  /**
   * Indicates redirect failed
   */
  redirect_method: "failed";
}

/**
 * Union type for all interstitial tracking properties
 */
export type InterstitialTrackingProperties =
  | InterstitialViewedProperties
  | InterstitialCountdownCompletedProperties
  | InterstitialManualRedirectProperties
  | InterstitialAutoRedirectProperties
  | InterstitialBouncedProperties
  | InterstitialRedirectFailedProperties;

