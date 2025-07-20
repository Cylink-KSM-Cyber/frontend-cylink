/**
 * Device detection utility
 * @description Provides device type detection based on user agent analysis
 * @author CyLink Frontend Team
 */

/**
 * Determines the device type based on user agent string
 * @description Analyzes navigator.userAgent to classify device as mobile, tablet, desktop, or other
 * @returns Device type classification
 * @example
 * getDeviceType() // returns 'mobile' | 'desktop' | 'tablet' | 'other'
 */
export function getDeviceType(): "mobile" | "desktop" | "tablet" | "other" {
  if (typeof window === "undefined") return "other";

  const userAgent = navigator.userAgent.toLowerCase();

  // Check for mobile devices first (includes phones and some tablets)
  if (
    /mobile|android|iphone|ipad|phone|blackberry|opera mini|windows phone/.test(
      userAgent
    )
  ) {
    // Further distinguish between tablets and phones
    if (/tablet|ipad|android(?=.*\b(mobile|phone)\b)/.test(userAgent)) {
      return "tablet";
    }
    return "mobile";
  }

  // Check for tablets specifically
  if (/tablet|ipad|android(?=.*\btablet\b)/.test(userAgent)) {
    return "tablet";
  }

  // Default to desktop for other cases
  return "desktop";
}

/**
 * Get detailed device information
 * @description Returns comprehensive device information for analytics
 * @returns Device information object
 */
export function getDeviceInfo(): {
  type: "mobile" | "desktop" | "tablet" | "other";
  userAgent: string;
  screenResolution: string;
  viewportSize: string;
  platform: string;
  language: string;
} {
  if (typeof window === "undefined") {
    return {
      type: "other",
      userAgent: "server-side",
      screenResolution: "unknown",
      viewportSize: "unknown",
      platform: "unknown",
      language: "unknown",
    };
  }

  return {
    type: getDeviceType(),
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    platform: navigator.platform,
    language: navigator.language,
  };
}

/**
 * Check if device supports touch interactions
 * @description Determines if the device has touch capabilities
 * @returns True if device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;

  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    ("msMaxTouchPoints" in navigator &&
      (navigator as Navigator & { msMaxTouchPoints: number }).msMaxTouchPoints >
        0)
  );
}

/**
 * Get device capabilities summary
 * @description Returns a summary of device capabilities for analytics
 * @returns Device capabilities object
 */
export function getDeviceCapabilities(): {
  type: "mobile" | "desktop" | "tablet" | "other";
  touch: boolean;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
} {
  if (typeof window === "undefined") {
    return {
      type: "other",
      touch: false,
      screenWidth: 0,
      screenHeight: 0,
      pixelRatio: 1,
    };
  }

  return {
    type: getDeviceType(),
    touch: isTouchDevice(),
    screenWidth: screen.width,
    screenHeight: screen.height,
    pixelRatio: window.devicePixelRatio || 1,
  };
}
