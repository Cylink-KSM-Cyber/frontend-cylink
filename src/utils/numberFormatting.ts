/**
 * Safe number formatting utilities
 * @description Utilities for formatting numbers with null/undefined safety
 */

/**
 * Safely formats a number to a fixed decimal place
 * @param value - The number to format (can be null/undefined)
 * @param decimals - Number of decimal places (default: 2)
 * @param fallback - Fallback value if input is invalid (default: "0")
 * @returns Formatted string
 */
export const safeToFixed = (
  value: number | null | undefined,
  decimals: number = 2,
  fallback: string = "0"
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return fallback;
  }
  return value.toFixed(decimals);
};

/**
 * Safely formats a percentage with proper sign handling
 * @param value - The percentage value (can be null/undefined)
 * @param decimals - Number of decimal places (default: 2)
 * @param fallback - Fallback value if input is invalid (default: "—")
 * @returns Formatted percentage string with sign
 */
export const safeFormatPercentage = (
  value: number | null | undefined,
  decimals: number = 2,
  fallback: string = "—"
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return fallback;
  }

  const formattedValue = value.toFixed(decimals);
  return value > 0 ? `+${formattedValue}%` : `${formattedValue}%`;
};

/**
 * Safely formats a number for display with locale support
 * @param value - The number to format (can be null/undefined)
 * @param options - Intl.NumberFormatOptions
 * @param fallback - Fallback value if input is invalid (default: "0")
 * @returns Formatted string
 */
export const safeFormatNumber = (
  value: number | null | undefined,
  options?: Intl.NumberFormatOptions,
  fallback: string = "0"
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return fallback;
  }

  try {
    return value.toLocaleString(undefined, options);
  } catch (error) {
    console.warn("Error formatting number:", error);
    return fallback;
  }
};

/**
 * Safely gets a numeric value with fallback
 * @param value - The value to check
 * @param fallback - Fallback value (default: 0)
 * @returns Safe numeric value
 */
export const safeNumber = (
  value: number | null | undefined,
  fallback: number = 0
): number => {
  if (value === null || value === undefined || isNaN(value)) {
    return fallback;
  }
  return value;
};
