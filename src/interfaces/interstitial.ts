/**
 * Interstitial Page Interfaces
 * 
 * Defines type safety for the interstitial redirect page feature,
 * including cyber security facts, countdown state, and redirect behavior.
 * 
 * @module src/interfaces/interstitial
 */

/**
 * Cyber Security Fact
 * Represents a single educational fact displayed on the interstitial page
 */
export interface CyberSecurityFact {
  /**
   * Unique identifier for the fact
   */
  id: number;

  /**
   * The cyber security fact text content
   */
  fact: string;

  /**
   * Category of the fact (e.g., "social_engineering", "authentication")
   */
  category: string;
}

/**
 * Interstitial State
 * Manages the countdown and redirect state
 */
export interface InterstitialState {
  /**
   * Remaining time in seconds
   */
  timeLeft: number;

  /**
   * Whether the redirect is in progress
   */
  isRedirecting: boolean;

  /**
   * Whether the automatic redirect failed
   */
  redirectFailed: boolean;

  /**
   * The original URL to redirect to
   */
  originalUrl: string | null;

  /**
   * Whether the URL is still being fetched
   */
  isLoading: boolean;

  /**
   * Error message if URL fetch failed
   */
  error: string | null;

  /**
   * The cyber security fact to display
   */
  fact: CyberSecurityFact | null;
}

/**
 * Redirect Method
 * Indicates how the user was redirected
 */
export type RedirectMethod = "auto" | "manual" | "failed";

/**
 * Interstitial Analytics Properties
 * Properties tracked for analytics purposes
 */
export interface InterstitialAnalytics {
  /**
   * The short code being accessed
   */
  short_code: string;

  /**
   * ID of the fact that was displayed
   */
  fact_id: number;

  /**
   * Time spent on the interstitial page (in seconds)
   */
  time_spent: number;

  /**
   * How the redirect was triggered
   */
  redirect_method: RedirectMethod;

  /**
   * Whether the countdown was completed
   */
  countdown_completed: boolean;

  /**
   * Device type of the user
   */
  device_type?: string;

  /**
   * Referrer URL
   */
  referrer?: string;

  /**
   * Timestamp of the event
   */
  timestamp: string;
}

/**
 * Interstitial Page Props
 * Props for the InterstitialPage component
 */
export interface InterstitialPageProps {
  /**
   * The short code from the URL
   */
  shortCode: string;
}

/**
 * Countdown Timer Props
 * Props for the CountdownTimer component
 */
export interface CountdownTimerProps {
  /**
   * Initial time in seconds
   */
  initialTime: number;

  /**
   * Callback when countdown completes
   */
  onComplete: () => void;

  /**
   * Optional CSS classes
   */
  className?: string;
}

/**
 * Animated Status Text Props
 * Props for the AnimatedStatusText component
 */
export interface AnimatedStatusTextProps {
  /**
   * Array of status messages to cycle through
   */
  messages: string[];

  /**
   * Interval between message changes (in milliseconds)
   */
  interval?: number;

  /**
   * Optional CSS classes
   */
  className?: string;
}

/**
 * Cyber Security Fact Card Props
 * Props for the CyberSecurityFactCard component
 */
export interface CyberSecurityFactCardProps {
  /**
   * The fact to display
   */
  fact: CyberSecurityFact;

  /**
   * Optional CSS classes
   */
  className?: string;
}

