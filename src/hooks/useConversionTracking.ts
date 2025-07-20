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
   * Track URL creation conversion
   * @param properties - URL creation specific properties
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
   * Track URL edit conversion
   * @param properties - URL edit specific properties
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
   * Track URL click conversion
   * @param properties - URL click specific properties
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
   * Track QR code generation conversion
   * @param properties - QR code generation specific properties
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
    trackUrlClick,
    trackQrCodeGeneration,
    trackConversion,
    trackFeatureUsage,
    trackError,
  };
};

export default useConversionTracking;
