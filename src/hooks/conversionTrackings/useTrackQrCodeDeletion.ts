/**
 * QR Code Deletion Conversion Tracking
 *
 * Provides a hook for tracking QR code deletion conversion events in PostHog analytics.
 * Encapsulates logic for capturing QR code deletions with relevant metadata and sanitization.
 *
 * @module src/hooks/conversionTrackings/useTrackQrCodeDeletion
 */
import { useCallback } from "react";
import posthogClient, { PostHogEventProperties } from "@/utils/posthogClient";
import { QrCodeDeletionProperties } from "@/interfaces/conversionTrackings/QrCodeDeletionProperties";
import { getBaseEventProperties } from "@/utils/conversionTrackingEventUtils";

export const useTrackQrCodeDeletion = () => {
  const trackQrCodeDeletion = useCallback(
    (properties: QrCodeDeletionProperties) => {
      if (!properties.qr_code_id || properties.qr_code_id <= 0) {
        console.warn("Invalid qr_code_id provided to trackQrCodeDeletion");
        return;
      }
      if (!properties.url_id || properties.url_id <= 0) {
        console.warn("Invalid url_id provided to trackQrCodeDeletion");
        return;
      }
      if (
        !properties.qr_code_title ||
        properties.qr_code_title.trim().length === 0
      ) {
        console.warn("Invalid qr_code_title provided to trackQrCodeDeletion");
        return;
      }
      if (!properties.short_url || properties.short_url.trim().length === 0) {
        console.warn("Invalid short_url provided to trackQrCodeDeletion");
        return;
      }
      if (
        !properties.customization_options ||
        typeof properties.customization_options !== "object"
      ) {
        console.warn(
          "Invalid customization_options provided to trackQrCodeDeletion"
        );
        return;
      }

      const sanitizedProperties = {
        ...properties,
        qr_code_title: properties.qr_code_title?.substring(0, 100),
        short_url: properties.short_url?.substring(0, 200),
        deletion_reason: properties.deletion_reason?.substring(0, 200),
        customization_options: JSON.stringify(properties.customization_options),
      };

      const eventProperties: PostHogEventProperties = {
        ...getBaseEventProperties(),
        ...sanitizedProperties,
      };

      posthogClient.captureEvent("qr_code_deleted", eventProperties);
    },
    []
  );

  return { trackQrCodeDeletion };
};
