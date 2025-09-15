/**
 * QR Code Sharing Conversion Tracking
 *
 * Provides a hook for tracking QR code sharing conversion events in PostHog analytics.
 * Encapsulates logic for capturing QR code sharing with relevant metadata and sanitization.
 *
 * @module src/hooks/conversionTrackings/useTrackQrCodeSharing
 */
import { useCallback } from "react";
import posthogClient, { PostHogEventProperties } from "@/utils/posthogClient";
import { QrCodeSharingProperties } from "@/interfaces/conversionTrackings/QrCodeSharingProperties";
import { getBaseEventProperties } from "@/utils/conversionTrackingEventUtils";
import {
  validateCommonQrEventProps,
  sanitizeCommonQrEventProps,
} from "@/utils/qrcodeEventCommons";

export const useTrackQrCodeSharing = () => {
  const trackQrCodeSharing = useCallback(
    (properties: QrCodeSharingProperties) => {
      const commonValidation = validateCommonQrEventProps(properties);
      if (!commonValidation.ok) {
        console.warn(commonValidation.error);
        return false;
      }
      if (
        !["web_share_api", "clipboard", "direct_link"].includes(
          properties.sharing_method
        )
      ) {
        console.warn("Invalid sharing_method provided to trackQrCodeSharing");
        return;
      }
      if (
        !["mobile", "desktop", "tablet"].includes(properties.sharing_platform)
      ) {
        console.warn("Invalid sharing_platform provided to trackQrCodeSharing");
        return;
      }

      const sanitizedProperties = {
        ...sanitizeCommonQrEventProps(properties),
        error_message: properties.error_message?.substring(0, 200),
      };

      const eventProperties: PostHogEventProperties = {
        ...getBaseEventProperties(),
        ...sanitizedProperties,
      };

      posthogClient.captureEvent("qr_code_shared", eventProperties);
      return true;
    },
    []
  );

  return { trackQrCodeSharing };
};
