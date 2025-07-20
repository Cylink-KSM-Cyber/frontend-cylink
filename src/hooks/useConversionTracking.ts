/**
 * PostHog Conversion Tracking Hook
 *
 * This module provides a centralized and flexible way to track conversion goals
 * across the application using PostHog analytics. It follows SOLID principles
 * by providing a single responsibility interface for conversion tracking,
 * making it easy to maintain and extend conversion tracking functionality.
 *
 * @module src/hooks/useConversionTracking
 */

import { useCallback } from "react";
import posthogClient, { PostHogEventProperties } from "@/utils/posthogClient";

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
 * Conversion Tracking Hook Return Type
 * @description Return type for the useConversionTracking hook
 */
export interface UseConversionTrackingReturn {
  /** Track URL creation conversion */
  trackUrlCreation: (properties: {
    url_id: number;
    url_title: string;
    has_custom_code: boolean;
    custom_code_length: number;
    expiry_date: string;
    original_url_length: number;
    creation_method: "manual" | "qr_code_flow" | "api" | "bulk_import";
    success: boolean;
  }) => void;
  /** Track URL edit conversion */
  trackUrlEdit: (properties: {
    url_id: number;
    url_title: string;
    has_custom_code: boolean;
    custom_code_length: number;
    expiry_date: string;
    original_url_length: number;
    edit_method: "manual" | "bulk_edit" | "api";
    fields_modified: string[];
    success: boolean;
  }) => void;
  /** Track URL click conversion */
  trackUrlClick: (properties: {
    url_id?: number;
    short_code: string;
    referrer?: string;
    user_agent?: string;
    location?: string;
    device_type?: "mobile" | "desktop" | "tablet" | "other";
  }) => void;
  /** Track QR code generation conversion */
  trackQrCodeGeneration: (properties: {
    url_id: number;
    customization_options: {
      foreground_color?: string;
      background_color?: string;
      size?: number;
      format?: "png" | "svg" | "jpeg";
    };
    downloaded: boolean;
    shared: boolean;
  }) => void;
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

/**
 * Custom hook for PostHog conversion tracking
 * @description Provides centralized conversion tracking functionality with type safety
 * @returns Object with conversion tracking methods
 */
export const useConversionTracking = (): UseConversionTrackingReturn => {
  /**
   * Get base conversion properties
   * @returns Base properties for conversion events
   */
  const getBaseProperties = useCallback((): PostHogEventProperties => {
    return {
      timestamp: new Date().toISOString(),
      source:
        typeof window !== "undefined" ? window.location.pathname : "server",
      user_agent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      screen_resolution:
        typeof screen !== "undefined"
          ? `${screen.width}x${screen.height}`
          : undefined,
    };
  }, []);

  /**
   * Track URL creation conversion
   * @param properties - URL creation specific properties
   */
  const trackUrlCreation = useCallback(
    (properties: {
      url_id: number;
      url_title: string;
      has_custom_code: boolean;
      custom_code_length: number;
      expiry_date: string;
      original_url_length: number;
      creation_method: "manual" | "qr_code_flow" | "api" | "bulk_import";
      success: boolean;
    }) => {
      const eventProperties: PostHogEventProperties = {
        ...getBaseProperties(),
        ...properties,
      };

      posthogClient.captureEvent("url_created", eventProperties);
    },
    [getBaseProperties]
  );

  /**
   * Track URL edit conversion
   * @param properties - URL edit specific properties
   */
  const trackUrlEdit = useCallback(
    (properties: {
      url_id: number;
      url_title: string;
      has_custom_code: boolean;
      custom_code_length: number;
      expiry_date: string;
      original_url_length: number;
      edit_method: "manual" | "bulk_edit" | "api";
      fields_modified: string[];
      success: boolean;
    }) => {
      const eventProperties: PostHogEventProperties = {
        ...getBaseProperties(),
        ...properties,
        fields_modified: properties.fields_modified.join(","), // Convert array to string for PostHog
      };

      posthogClient.captureEvent("url_edited", eventProperties);
    },
    [getBaseProperties]
  );

  /**
   * Track URL click conversion
   * @param properties - URL click specific properties
   */
  const trackUrlClick = useCallback(
    (properties: {
      url_id?: number;
      short_code: string;
      referrer?: string;
      user_agent?: string;
      location?: string;
      device_type?: "mobile" | "desktop" | "tablet" | "other";
    }) => {
      const eventProperties: PostHogEventProperties = {
        ...getBaseProperties(),
        ...properties,
      };

      posthogClient.captureEvent("url_clicked", eventProperties);
    },
    [getBaseProperties]
  );

  /**
   * Track QR code generation conversion
   * @param properties - QR code generation specific properties
   */
  const trackQrCodeGeneration = useCallback(
    (properties: {
      url_id: number;
      customization_options: {
        foreground_color?: string;
        background_color?: string;
        size?: number;
        format?: "png" | "svg" | "jpeg";
      };
      downloaded: boolean;
      shared: boolean;
    }) => {
      const eventProperties: PostHogEventProperties = {
        ...getBaseProperties(),
        url_id: properties.url_id,
        customization_options: JSON.stringify(properties.customization_options),
        downloaded: properties.downloaded,
        shared: properties.shared,
      };

      posthogClient.captureEvent("qr_code_generated", eventProperties);
    },
    [getBaseProperties]
  );

  /**
   * Track generic conversion goal
   * @param goalType - Type of conversion goal
   * @param properties - Additional properties for the conversion
   */
  const trackConversion = useCallback(
    (goalType: ConversionGoalType, properties: PostHogEventProperties = {}) => {
      const eventProperties = {
        ...getBaseProperties(),
        ...properties,
      };

      posthogClient.captureEvent(goalType, eventProperties);
    },
    [getBaseProperties]
  );

  /**
   * Track feature usage
   * @param featureName - Name of the feature being used
   * @param properties - Additional properties for the feature usage
   */
  const trackFeatureUsage = useCallback(
    (featureName: string, properties: PostHogEventProperties = {}) => {
      const eventProperties = {
        ...getBaseProperties(),
        feature_name: featureName,
        ...properties,
      };

      posthogClient.captureEvent("feature_used", eventProperties);
    },
    [getBaseProperties]
  );

  /**
   * Track error occurrence
   * @param errorType - Type of error that occurred
   * @param errorMessage - Error message
   * @param properties - Additional properties for the error
   */
  const trackError = useCallback(
    (
      errorType: string,
      errorMessage: string,
      properties: PostHogEventProperties = {}
    ) => {
      const eventProperties = {
        ...getBaseProperties(),
        error_type: errorType,
        error_message: errorMessage,
        ...properties,
      };

      posthogClient.captureEvent("error_occurred", eventProperties);
    },
    [getBaseProperties]
  );

  return {
    trackUrlCreation,
    trackUrlEdit,
    trackUrlClick,
    trackQrCodeGeneration,
    trackConversion,
    trackFeatureUsage,
    trackError,
  };
};

export default useConversionTracking;
