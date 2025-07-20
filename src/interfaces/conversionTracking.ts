/**
 * Conversion Tracking Interfaces
 *
 * This module defines the interfaces used for conversion tracking functionality
 * across the application. It provides structured contracts for tracking methods
 * and ensures type safety in conversion tracking implementation.
 *
 * @module src/interfaces/conversionTracking
 */

import { PostHogEventProperties } from "@/utils/posthogClient";
import {
  ConversionGoalType,
  UrlCreationMethod,
  UrlEditMethod,
  DeviceType,
  QrCodeFormat,
} from "@/types/conversionTracking";

/**
 * URL Creation Tracking Properties
 * @description Properties required for tracking URL creation events
 */
export interface UrlCreationProperties {
  url_id: number;
  url_title: string;
  has_custom_code: boolean;
  custom_code_length: number;
  expiry_date: string;
  original_url_length: number;
  creation_method: UrlCreationMethod;
  success: boolean;
}

/**
 * URL Edit Tracking Properties
 * @description Properties required for tracking URL edit events
 */
export interface UrlEditProperties {
  url_id: number;
  url_title: string;
  has_custom_code: boolean;
  custom_code_length: number;
  expiry_date: string;
  original_url_length: number;
  edit_method: UrlEditMethod;
  fields_modified: string[];
  success: boolean;
}

/**
 * URL Click Tracking Properties
 * @description Properties required for tracking URL click events
 */
export interface UrlClickProperties {
  url_id?: number;
  short_code: string;
  referrer?: string;
  user_agent?: string;
  location?: string;
  device_type?: DeviceType;
}

/**
 * QR Code Customization Options
 * @description Options for customizing QR code appearance
 */
export interface QrCodeCustomizationOptions {
  foreground_color?: string;
  background_color?: string;
  size?: number;
  format?: QrCodeFormat;
}

/**
 * QR Code Generation Tracking Properties
 * @description Properties required for tracking QR code generation events
 */
export interface QrCodeGenerationProperties {
  url_id: number;
  customization_options: QrCodeCustomizationOptions;
  downloaded: boolean;
  shared: boolean;
}

/**
 * Conversion Tracking Hook Return Type
 * @description Return type for the useConversionTracking hook
 */
export interface UseConversionTrackingReturn {
  /** Track URL creation conversion */
  trackUrlCreation: (properties: UrlCreationProperties) => void;
  /** Track URL edit conversion */
  trackUrlEdit: (properties: UrlEditProperties) => void;
  /** Track URL click conversion */
  trackUrlClick: (properties: UrlClickProperties) => void;
  /** Track QR code generation conversion */
  trackQrCodeGeneration: (properties: QrCodeGenerationProperties) => void;
  /** Track generic conversion goal */
  trackConversion: (
    goalType: ConversionGoalType,
    properties?: PostHogEventProperties
  ) => void;
  /** Track feature usage */
  trackFeatureUsage: (
    featureName: string,
    properties?: PostHogEventProperties
  ) => void;
  /** Track error occurrence */
  trackError: (
    errorType: string,
    errorMessage: string,
    properties?: PostHogEventProperties
  ) => void;
}
