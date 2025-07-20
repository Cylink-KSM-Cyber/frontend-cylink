/**
 * Conversion Tracking Types
 *
 * This module defines the core types used for conversion tracking functionality
 * across the application. It provides type safety for conversion goal types
 * and ensures consistency in tracking implementation.
 *
 * @module src/types/conversionTracking
 */

/**
 * Conversion Goal Types
 *
 * Defines the available conversion goal types for tracking
 * across the application. This union type ensures type safety
 * for all conversion tracking events.
 *
 * @description Defines the available conversion goal types for tracking
 */
export type ConversionGoalType =
  | "url_created"
  | "url_edited"
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
 * URL Creation Method Types
 *
 * Defines the methods by which URLs can be created in the system.
 * This ensures consistency in tracking how URLs are generated.
 *
 * @description Defines the methods by which URLs can be created
 */
export type UrlCreationMethod =
  | "manual"
  | "qr_code_flow"
  | "api"
  | "bulk_import";

/**
 * URL Edit Method Types
 *
 * Defines the methods by which URLs can be edited in the system.
 * This ensures consistency in tracking how URLs are modified.
 *
 * @description Defines the methods by which URLs can be edited
 */
export type UrlEditMethod = "manual" | "bulk_edit" | "api";

/**
 * Device Type Types
 *
 * Defines the types of devices that can be tracked for analytics.
 * This helps categorize user interactions by device type.
 *
 * @description Defines the types of devices that can be tracked
 */
export type DeviceType = "mobile" | "desktop" | "tablet" | "other";

/**
 * QR Code Format Types
 *
 * Defines the available formats for QR code generation.
 * This ensures type safety when specifying output formats.
 *
 * @description Defines the available formats for QR code generation
 */
export type QrCodeFormat = "png" | "svg" | "jpeg";

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

/**
 * Type guard to check if a value is a valid UrlCreationMethod
 * @param value - Value to check
 * @returns True if value is a valid UrlCreationMethod
 */
export const isUrlCreationMethod = (
  value: unknown
): value is UrlCreationMethod => {
  const validMethods: UrlCreationMethod[] = [
    "manual",
    "qr_code_flow",
    "api",
    "bulk_import",
  ];
  return (
    typeof value === "string" &&
    validMethods.includes(value as UrlCreationMethod)
  );
};

/**
 * Type guard to check if a value is a valid UrlEditMethod
 * @param value - Value to check
 * @returns True if value is a valid UrlEditMethod
 */
export const isUrlEditMethod = (value: unknown): value is UrlEditMethod => {
  const validMethods: UrlEditMethod[] = ["manual", "bulk_edit", "api"];
  return (
    typeof value === "string" && validMethods.includes(value as UrlEditMethod)
  );
};

/**
 * Type guard to check if a value is a valid DeviceType
 * @param value - Value to check
 * @returns True if value is a valid DeviceType
 */
export const isDeviceType = (value: unknown): value is DeviceType => {
  const validTypes: DeviceType[] = ["mobile", "desktop", "tablet", "other"];
  return typeof value === "string" && validTypes.includes(value as DeviceType);
};

/**
 * Type guard to check if a value is a valid QrCodeFormat
 * @param value - Value to check
 * @returns True if value is a valid QrCodeFormat
 */
export const isQrCodeFormat = (value: unknown): value is QrCodeFormat => {
  const validFormats: QrCodeFormat[] = ["png", "svg", "jpeg"];
  return (
    typeof value === "string" && validFormats.includes(value as QrCodeFormat)
  );
};
