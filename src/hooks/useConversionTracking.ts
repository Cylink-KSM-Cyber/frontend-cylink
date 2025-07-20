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
import { ConversionGoalType } from "@/types/conversionTracking";
import {
  UseConversionTrackingReturn,
  UrlCreationProperties,
  UrlEditProperties,
  UrlDeletionProperties,
  UrlClickProperties,
  QrCodeGenerationProperties,
} from "@/interfaces/conversionTracking";

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
   * Track URL creation conversion goal in PostHog
   * @description Captures URL creation events for analytics and conversion tracking.
   * Tracks successful URL creations with relevant metadata including creation method
   * and URL characteristics.
   *
   * @param properties - URL creation specific properties
   * @param properties.url_id - Unique identifier of the created URL
   * @param properties.url_title - Title or name of the created URL
   * @param properties.has_custom_code - Whether a custom short code was used
   * @param properties.custom_code_length - Length of the custom code (0 if not used)
   * @param properties.expiry_date - Expiry date of the URL
   * @param properties.original_url_length - Length of the original URL
   * @param properties.creation_method - Method used for creation (manual/qr_code_flow/api/bulk_import)
   * @param properties.success - Whether the creation was successful
   *
   * @example
   * ```typescript
   * trackUrlCreation({
   *   url_id: 123,
   *   url_title: "My URL",
   *   has_custom_code: true,
   *   custom_code_length: 6,
   *   expiry_date: "2024-12-31",
   *   original_url_length: 150,
   *   creation_method: "manual",
   *   success: true
   * });
   * ```
   */
  const trackUrlCreation = useCallback(
    (properties: UrlCreationProperties) => {
      // Validate critical properties
      if (!properties.url_id || properties.url_id <= 0) {
        console.warn("Invalid url_id provided to trackUrlCreation");
        return;
      }

      if (!properties.url_title || properties.url_title.trim().length === 0) {
        console.warn("Invalid url_title provided to trackUrlCreation");
        return;
      }

      const eventProperties: PostHogEventProperties = {
        ...getBaseProperties(),
        ...properties,
      };

      posthogClient.captureEvent("url_created", eventProperties);
    },
    [getBaseProperties]
  );

  /**
   * Track URL edit conversion goal in PostHog
   * @description Captures URL edit events for analytics and conversion tracking.
   * Tracks successful URL modifications with details about which fields were changed
   * and the edit method used.
   *
   * @param properties - URL edit specific properties
   * @param properties.url_id - Unique identifier of the edited URL
   * @param properties.url_title - Title or name of the edited URL
   * @param properties.has_custom_code - Whether a custom short code was used
   * @param properties.custom_code_length - Length of the custom code (0 if not used)
   * @param properties.expiry_date - Expiry date of the URL
   * @param properties.original_url_length - Length of the original URL
   * @param properties.edit_method - Method used for editing (manual/bulk_edit/api)
   * @param properties.fields_modified - Array of field names that were modified
   * @param properties.success - Whether the edit was successful
   *
   * @example
   * ```typescript
   * trackUrlEdit({
   *   url_id: 123,
   *   url_title: "Updated URL",
   *   has_custom_code: false,
   *   custom_code_length: 0,
   *   expiry_date: "2024-12-31",
   *   original_url_length: 150,
   *   edit_method: "manual",
   *   fields_modified: ["title", "expiry_date"],
   *   success: true
   * });
   * ```
   */
  const trackUrlEdit = useCallback(
    (properties: UrlEditProperties) => {
      // Validate critical properties
      if (!properties.url_id || properties.url_id <= 0) {
        console.warn("Invalid url_id provided to trackUrlEdit");
        return;
      }

      if (!properties.url_title || properties.url_title.trim().length === 0) {
        console.warn("Invalid url_title provided to trackUrlEdit");
        return;
      }

      if (!Array.isArray(properties.fields_modified)) {
        console.warn("Invalid fields_modified provided to trackUrlEdit");
        return;
      }

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
   * Track URL deletion conversion goal in PostHog
   * @description Captures URL deletion events for analytics and conversion tracking.
   * Tracks both successful and failed deletions with relevant metadata.
   * Includes data sanitization to prevent sensitive information exposure.
   *
   * @param properties - URL deletion specific properties
   * @param properties.url_id - Unique identifier of the deleted URL
   * @param properties.url_title - Title or name of the deleted URL (max 100 chars)
   * @param properties.short_code - Short code of the deleted URL (max 50 chars)
   * @param properties.original_url_length - Length of the original URL
   * @param properties.total_clicks - Total clicks before deletion
   * @param properties.deletion_method - Method used for deletion (manual/bulk/api/expired)
   * @param properties.deletion_reason - Optional reason for deletion (max 200 chars, for failed deletions)
   * @param properties.success - Whether the deletion was successful
   *
   * @example
   * ```typescript
   * trackUrlDeletion({
   *   url_id: 123,
   *   url_title: "My URL",
   *   short_code: "abc123",
   *   original_url_length: 150,
   *   total_clicks: 42,
   *   deletion_method: "manual",
   *   success: true
   * });
   * ```
   */
  const trackUrlDeletion = useCallback(
    (properties: UrlDeletionProperties) => {
      // Validate critical properties
      if (!properties.url_id || properties.url_id <= 0) {
        console.warn("Invalid url_id provided to trackUrlDeletion");
        return;
      }

      if (!properties.url_title || properties.url_title.trim().length === 0) {
        console.warn("Invalid url_title provided to trackUrlDeletion");
        return;
      }

      if (!properties.short_code || properties.short_code.trim().length === 0) {
        console.warn("Invalid short_code provided to trackUrlDeletion");
        return;
      }

      // Sanitize sensitive data to prevent information exposure
      const sanitizedProperties = {
        ...properties,
        url_title: properties.url_title?.substring(0, 100), // Limit length
        short_code: properties.short_code?.substring(0, 50), // Limit length
        deletion_reason: properties.deletion_reason?.substring(0, 200), // Limit length
      };

      const eventProperties: PostHogEventProperties = {
        ...getBaseProperties(),
        ...sanitizedProperties,
      };

      posthogClient.captureEvent("url_deleted", eventProperties);
    },
    [getBaseProperties]
  );

  /**
   * Track URL click conversion goal in PostHog
   * @description Captures URL click events for analytics and conversion tracking.
   * Tracks user interactions with shortened URLs including device and location data
   * when available.
   *
   * @param properties - URL click specific properties
   * @param properties.url_id - Optional unique identifier of the clicked URL
   * @param properties.short_code - Short code of the clicked URL
   * @param properties.referrer - Optional referrer URL that led to the click
   * @param properties.user_agent - Optional user agent string
   * @param properties.location - Optional geographic location of the click
   * @param properties.device_type - Optional device type (mobile/desktop/tablet/other)
   *
   * @example
   * ```typescript
   * trackUrlClick({
   *   url_id: 123,
   *   short_code: "abc123",
   *   referrer: "https://google.com",
   *   device_type: "mobile",
   *   location: "US"
   * });
   * ```
   */
  const trackUrlClick = useCallback(
    (properties: UrlClickProperties) => {
      // Validate critical properties
      if (!properties.short_code || properties.short_code.trim().length === 0) {
        console.warn("Invalid short_code provided to trackUrlClick");
        return;
      }

      const eventProperties: PostHogEventProperties = {
        ...getBaseProperties(),
        ...properties,
      };

      posthogClient.captureEvent("url_clicked", eventProperties);
    },
    [getBaseProperties]
  );

  /**
   * Track QR code generation conversion goal in PostHog
   * @description Captures QR code generation events for analytics and conversion tracking.
   * Tracks successful QR code creations with customization options and usage data.
   *
   * @param properties - QR code generation specific properties
   * @param properties.url_id - Unique identifier of the URL associated with the QR code
   * @param properties.customization_options - QR code customization settings
   * @param properties.customization_options.foreground_color - Optional foreground color
   * @param properties.customization_options.background_color - Optional background color
   * @param properties.customization_options.size - Optional QR code size
   * @param properties.customization_options.format - Optional output format (png/svg/jpeg)
   * @param properties.downloaded - Whether the QR code was downloaded
   * @param properties.shared - Whether the QR code was shared
   *
   * @example
   * ```typescript
   * trackQrCodeGeneration({
   *   url_id: 123,
   *   customization_options: {
   *     foreground_color: "#000000",
   *     background_color: "#FFFFFF",
   *     size: 300,
   *     format: "png"
   *   },
   *   downloaded: true,
   *   shared: false
   * });
   * ```
   */
  const trackQrCodeGeneration = useCallback(
    (properties: QrCodeGenerationProperties) => {
      // Validate critical properties
      if (!properties.url_id || properties.url_id <= 0) {
        console.warn("Invalid url_id provided to trackQrCodeGeneration");
        return;
      }

      if (
        !properties.customization_options ||
        typeof properties.customization_options !== "object"
      ) {
        console.warn(
          "Invalid customization_options provided to trackQrCodeGeneration"
        );
        return;
      }

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
      // Validate goalType
      if (!goalType || typeof goalType !== "string") {
        console.warn("Invalid goalType provided to trackConversion");
        return;
      }

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
      // Validate featureName
      if (
        !featureName ||
        typeof featureName !== "string" ||
        featureName.trim().length === 0
      ) {
        console.warn("Invalid featureName provided to trackFeatureUsage");
        return;
      }

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
      // Validate error parameters
      if (
        !errorType ||
        typeof errorType !== "string" ||
        errorType.trim().length === 0
      ) {
        console.warn("Invalid errorType provided to trackError");
        return;
      }

      if (
        !errorMessage ||
        typeof errorMessage !== "string" ||
        errorMessage.trim().length === 0
      ) {
        console.warn("Invalid errorMessage provided to trackError");
        return;
      }

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
    trackUrlDeletion,
    trackUrlClick,
    trackQrCodeGeneration,
    trackConversion,
    trackFeatureUsage,
    trackError,
  };
};

export default useConversionTracking;
