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
 * @description Defines the methods by which URLs can be created
 */
export type UrlCreationMethod =
  | "manual"
  | "qr_code_flow"
  | "api"
  | "bulk_import";

/**
 * URL Edit Method Types
 * @description Defines the methods by which URLs can be edited
 */
export type UrlEditMethod = "manual" | "bulk_edit" | "api";

/**
 * Device Type Types
 * @description Defines the types of devices that can be tracked
 */
export type DeviceType = "mobile" | "desktop" | "tablet" | "other";

/**
 * QR Code Format Types
 * @description Defines the available formats for QR code generation
 */
export type QrCodeFormat = "png" | "svg" | "jpeg";
