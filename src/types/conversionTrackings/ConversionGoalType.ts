/**
 * Conversion Goal Type
 *
 * Defines the available conversion goal types for tracking conversion-related events across the application. Provides type safety and consistency for conversion tracking implementation.
 *
 * @module src/types/conversionTrackings/ConversionGoalType
 */

export type ConversionGoalType =
  | "url_created"
  | "url_edited"
  | "url_deleted"
  | "url_clicked"
  | "qr_code_generated"
  | "user_registered"
  | "user_logged_in"
  | "user_logged_out"
  | "feature_used"
  | "settings_updated"
  | "search_performed"
  | "error_occurred";

/**
 * Type guard to check if a value is a valid ConversionGoalType
 * @param value - Value to check
 * @returns True if value is a valid ConversionGoalType
 */
export const isConversionGoalType = (
  value: unknown
): value is ConversionGoalType => {
  const validTypes: ConversionGoalType[] = [
    "url_created",
    "url_edited",
    "url_deleted",
    "url_clicked",
    "qr_code_generated",
    "user_registered",
    "user_logged_in",
    "user_logged_out",
    "feature_used",
    "settings_updated",
    "search_performed",
    "error_occurred",
  ];
  return (
    typeof value === "string" &&
    validTypes.includes(value as ConversionGoalType)
  );
};
