/**
 * URL Limits Configuration
 * @description Centralized configuration for URL-related limits and validation
 * @author CyLink Frontend Team
 */

/**
 * URL Custom Code Limits
 * @description Configuration constants for custom code character limits
 */
export const URL_CUSTOM_CODE_LIMITS = {
  /** Maximum number of characters allowed in custom code */
  MAX_LENGTH: 30,
  /** Minimum number of characters required (optional field, so 0) */
  MIN_LENGTH: 0,
  /** Warning threshold - when to show warning styling (80% of max) */
  WARNING_THRESHOLD: 24, // 80% of 30
  /** Critical threshold - when to show danger styling (90% of max) */
  CRITICAL_THRESHOLD: 27, // 90% of 30
} as const;

/**
 * URL Validation Patterns
 * @description Regular expressions for URL validation
 */
export const URL_VALIDATION_PATTERNS = {
  /** Primary pattern for custom code validation - letters, numbers, and hyphens only */
  CUSTOM_CODE_REGEX: /^[a-zA-Z0-9-]+$/,
  /** Pattern for URL validation (basic) */
  URL_REGEX: /^https?:\/\/.+/,
} as const;

/**
 * URL Error Messages
 * @description Standardized error messages for URL validation
 */
export const URL_ERROR_MESSAGES = {
  /** Error message for exceeding character limit */
  CUSTOM_CODE_TOO_LONG: "Custom code must be 30 characters or less",
  /** Error message for invalid characters */
  CUSTOM_CODE_INVALID_CHARS:
    "Custom code can only contain letters, numbers, and hyphens",
  /** Error message for empty required field */
  CUSTOM_CODE_REQUIRED: "Custom code is required",
  /** Error message for URL format */
  INVALID_URL: "Please enter a valid URL",
  /** Error message for title length */
  TITLE_TOO_LONG: "Title must be less than 100 characters",
  /** Error message for empty title */
  TITLE_REQUIRED: "Title is required",
} as const;

/**
 * URL Display Configuration
 * @description Configuration for how URLs are displayed in UI
 */
export const URL_DISPLAY_CONFIG = {
  /** Default domain for short URLs */
  SHORT_URL_DOMAIN: "cylink.co",
  /** Placeholder text for custom code input */
  CUSTOM_CODE_PLACEHOLDER: "custom-url",
  /** Help text for custom code input */
  CUSTOM_CODE_HELP_TEXT:
    "Use letters, numbers, and hyphens for your custom URL",
  /** Character counter label */
  CHARACTER_COUNTER_LABEL: "characters",
  /** Accessibility description for custom code field */
  CUSTOM_CODE_A11Y_DESCRIPTION: "custom code",
} as const;

/**
 * URL Form Configuration
 * @description Configuration for form behavior
 */
export const URL_FORM_CONFIG = {
  /** Debounce delay for real-time validation (milliseconds) */
  VALIDATION_DEBOUNCE_DELAY: 300,
  /** Debounce delay for character counter updates (milliseconds) */
  COUNTER_DEBOUNCE_DELAY: 100,
  /** Auto-focus delay after modal opens (milliseconds) */
  AUTO_FOCUS_DELAY: 150,
  /** Toast notification duration (milliseconds) */
  TOAST_DURATION: 3000,
} as const;

/**
 * Helper function to get custom code validation config
 * @returns Complete validation configuration object
 */
export const getCustomCodeValidationConfig = () => ({
  maxLength: URL_CUSTOM_CODE_LIMITS.MAX_LENGTH,
  minLength: URL_CUSTOM_CODE_LIMITS.MIN_LENGTH,
  pattern: URL_VALIDATION_PATTERNS.CUSTOM_CODE_REGEX,
  warningThreshold: URL_CUSTOM_CODE_LIMITS.WARNING_THRESHOLD,
  criticalThreshold: URL_CUSTOM_CODE_LIMITS.CRITICAL_THRESHOLD,
  errorMessage: URL_ERROR_MESSAGES.CUSTOM_CODE_TOO_LONG,
  invalidCharsMessage: URL_ERROR_MESSAGES.CUSTOM_CODE_INVALID_CHARS,
  placeholder: URL_DISPLAY_CONFIG.CUSTOM_CODE_PLACEHOLDER,
  helpText: URL_DISPLAY_CONFIG.CUSTOM_CODE_HELP_TEXT,
  a11yDescription: URL_DISPLAY_CONFIG.CUSTOM_CODE_A11Y_DESCRIPTION,
});

/**
 * Helper function to validate custom code format
 * @param value - The custom code value to validate
 * @returns Validation result with isValid flag and error message
 */
export const validateCustomCodeFormat = (
  value: string
): { isValid: boolean; error?: string } => {
  if (!value) {
    return { isValid: true }; // Optional field
  }

  if (value.length > URL_CUSTOM_CODE_LIMITS.MAX_LENGTH) {
    return {
      isValid: false,
      error: URL_ERROR_MESSAGES.CUSTOM_CODE_TOO_LONG,
    };
  }

  if (!URL_VALIDATION_PATTERNS.CUSTOM_CODE_REGEX.test(value)) {
    return {
      isValid: false,
      error: URL_ERROR_MESSAGES.CUSTOM_CODE_INVALID_CHARS,
    };
  }

  return { isValid: true };
};

/**
 * Helper function to get character count status
 * @param currentLength - Current character count
 * @returns Status object with styling information
 */
export const getCharacterCountStatus = (currentLength: number) => {
  const { MAX_LENGTH, WARNING_THRESHOLD, CRITICAL_THRESHOLD } =
    URL_CUSTOM_CODE_LIMITS;

  if (currentLength >= MAX_LENGTH) {
    return {
      status: "critical" as const,
      color: "text-red-600",
      weight: "font-semibold",
      animate: true,
    };
  }

  if (currentLength >= CRITICAL_THRESHOLD) {
    return {
      status: "danger" as const,
      color: "text-red-500",
      weight: "font-medium",
      animate: false,
    };
  }

  if (currentLength >= WARNING_THRESHOLD) {
    return {
      status: "warning" as const,
      color: "text-yellow-600",
      weight: "font-medium",
      animate: false,
    };
  }

  return {
    status: "normal" as const,
    color: "text-gray-500",
    weight: "font-normal",
    animate: false,
  };
};
