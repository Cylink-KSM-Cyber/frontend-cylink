/**
 * Character Counter Utilities
 * @description Utility functions for managing character counting logic in input fields
 * @author CyLink Frontend Team
 */

import type { CharacterStatus } from "@/interfaces/characterCounter";

/**
 * Character count display configuration
 * @interface CharacterCountConfig
 */
export interface CharacterCountConfig {
  /** Current character count */
  current: number;
  /** Maximum character limit */
  max: number;
  /** Warning threshold (default: 80% of max) */
  warningThreshold?: number;
}

/**
 * Character count style configuration
 * @interface CharacterCountStyle
 */
export interface CharacterCountStyle {
  /** Text color class */
  textColor: string;
  /** Background color class (if needed) */
  backgroundColor?: string;
  /** Font weight class */
  fontWeight: string;
  /** Additional CSS classes */
  additionalClasses?: string;
}

/**
 * Generate character count display string
 * @param current - Current character count
 * @param max - Maximum character limit
 * @returns Formatted character count string (e.g., "1/30")
 *
 * @example
 * ```typescript
 * getCharacterCountDisplay(5, 30) // Returns "5/30"
 * getCharacterCountDisplay(0, 30) // Returns "0/30"
 * ```
 */
export const getCharacterCountDisplay = (
  current: number,
  max: number
): string => {
  // Ensure current count doesn't exceed max (for display purposes)
  const displayCurrent = Math.min(current, max);
  return `${displayCurrent}/${max}`;
};

/**
 * Get character count style classes based on current count and limit
 * @param current - Current character count
 * @param max - Maximum character limit
 * @param warningThreshold - Warning threshold (default: 80% of max)
 * @returns Style configuration object
 *
 * @example
 * ```typescript
 * getCharacterCountStyle(5, 30) // Returns normal style
 * getCharacterCountStyle(25, 30) // Returns warning style
 * getCharacterCountStyle(30, 30) // Returns danger style
 * ```
 */
export const getCharacterCountStyle = (
  current: number,
  max: number,
  warningThreshold?: number
): CharacterCountStyle => {
  const threshold = warningThreshold ?? Math.floor(max * 0.8);
  const status = getCharacterCountStatus(current, max, threshold);

  // Map status to style
  switch (status) {
    case "critical":
    case "danger":
      return {
        textColor: "text-red-600",
        fontWeight: "font-semibold",
        additionalClasses: "animate-pulse",
      };
    case "warning":
      return {
        textColor: "text-yellow-600",
        fontWeight: "font-medium",
        additionalClasses: "",
      };
    case "normal":
    default:
      return {
        textColor: "text-gray-500",
        fontWeight: "font-normal",
        additionalClasses: "",
      };
  }
};

/**
 * Get character count status based on current count and limit
 * @param current - Current character count
 * @param max - Maximum character limit
 * @param warningThreshold - Warning threshold
 * @returns Character status
 */
export const getCharacterCountStatus = (
  current: number,
  max: number,
  warningThreshold?: number
): CharacterStatus => {
  const threshold = warningThreshold ?? Math.floor(max * 0.8);

  if (current >= max) return "critical";
  if (current >= Math.floor(max * 0.9)) return "danger";
  if (current >= threshold) return "warning";
  return "normal";
};

/**
 * Check if character limit has been reached
 * @param current - Current character count
 * @param max - Maximum character limit
 * @returns True if limit is reached, false otherwise
 *
 * @example
 * ```typescript
 * isCharacterLimitReached(30, 30) // Returns true
 * isCharacterLimitReached(25, 30) // Returns false
 * ```
 */
export const isCharacterLimitReached = (
  current: number,
  max: number
): boolean => {
  return current >= max;
};

/**
 * Check if character count is approaching the limit
 * @param current - Current character count
 * @param max - Maximum character limit
 * @param warningThreshold - Warning threshold (default: 80% of max)
 * @returns True if approaching limit, false otherwise
 *
 * @example
 * ```typescript
 * isCharacterCountWarning(25, 30) // Returns true (above 80%)
 * isCharacterCountWarning(20, 30) // Returns false (below 80%)
 * ```
 */
export const isCharacterCountWarning = (
  current: number,
  max: number,
  warningThreshold?: number
): boolean => {
  const threshold = warningThreshold ?? Math.floor(max * 0.8);
  return current >= threshold && current < max;
};

/**
 * Get accessibility attributes for character counter
 * @param current - Current character count
 * @param max - Maximum character limit
 * @param fieldName - Name of the input field (for screen readers)
 * @returns Object with ARIA attributes
 *
 * @example
 * ```typescript
 * getCharacterCountA11yAttributes(5, 30, "custom code")
 * // Returns: { "aria-label": "5 of 30 characters used for custom code", ... }
 * ```
 */
export const getCharacterCountA11yAttributes = (
  current: number,
  max: number,
  fieldName: string
) => {
  const remaining = max - current;
  const isAtLimit = isCharacterLimitReached(current, max);
  const isWarning = isCharacterCountWarning(current, max);

  let ariaLabel = `${current} of ${max} characters used for ${fieldName}`;

  if (isAtLimit) {
    ariaLabel += ". Character limit reached";
  } else if (isWarning) {
    ariaLabel += `. ${remaining} characters remaining`;
  }

  return {
    "aria-label": ariaLabel,
    "aria-live": (isWarning || isAtLimit ? "polite" : "off") as
      | "polite"
      | "off"
      | "assertive",
    role: "status" as const,
  };
};

/**
 * Validate and sanitize character count input
 * @param value - Input value to validate
 * @param max - Maximum character limit
 * @returns Sanitized value that respects the character limit
 *
 * @example
 * ```typescript
 * validateCharacterCount("hello-world", 30) // Returns "hello-world"
 * validateCharacterCount("very-long-string-that-exceeds-thirty-chars", 30) // Returns truncated string
 * ```
 */
export const validateCharacterCount = (value: string, max: number): string => {
  if (!value) return "";

  // Truncate if exceeds maximum
  if (value.length > max) {
    return value.substring(0, max);
  }

  return value;
};

/**
 * Constants for character counting
 */
export const CHARACTER_COUNT_CONSTANTS = {
  /** Default warning threshold (80% of max) */
  DEFAULT_WARNING_THRESHOLD: 0.8,
  /** Animation duration for style changes */
  ANIMATION_DURATION: 200,
  /** Debounce delay for real-time updates */
  DEBOUNCE_DELAY: 100,
} as const;
