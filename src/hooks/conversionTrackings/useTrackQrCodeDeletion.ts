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
import {
  validateCommonQrEventProps,
  sanitizeCommonQrEventProps,
} from "@/utils/qrcodeEventCommons";

export const useTrackQrCodeDeletion = () => {
  const trackQrCodeDeletion = useCallback(
    (properties: QrCodeDeletionProperties) => {
      const commonValidation = validateCommonQrEventProps(properties);
      if (!commonValidation.ok) {
        console.warn(commonValidation.error);
        return false;
      }

      const sanitizedProperties = {
        ...sanitizeCommonQrEventProps(properties),
        deletion_reason: properties.deletion_reason?.substring(0, 200),
      };

      const eventProperties: PostHogEventProperties = {
        ...getBaseEventProperties(),
        ...sanitizedProperties,
      };

      posthogClient.captureEvent("qr_code_deleted", eventProperties);
      return true;
    },
    []
  );

  return { trackQrCodeDeletion };
};
