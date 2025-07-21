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

export const useTrackQrCodeSharing = () => {
  const trackQrCodeSharing = useCallback(
    (properties: QrCodeSharingProperties) => {
      if (!properties.qr_code_id || properties.qr_code_id <= 0) {
        console.warn("Invalid qr_code_id provided to trackQrCodeSharing");
        return;
      }
      if (!properties.url_id || properties.url_id <= 0) {
        console.warn("Invalid url_id provided to trackQrCodeSharing");
        return;
      }
      if (
        !properties.qr_code_title ||
        properties.qr_code_title.trim().length === 0
      ) {
        console.warn("Invalid qr_code_title provided to trackQrCodeSharing");
        return;
      }
      if (!properties.short_url || properties.short_url.trim().length === 0) {
        console.warn("Invalid short_url provided to trackQrCodeSharing");
        return;
      }
      if (
        !properties.customization_options ||
        typeof properties.customization_options !== "object"
      ) {
        console.warn(
          "Invalid customization_options provided to trackQrCodeSharing"
        );
        return;
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
        ...properties,
        qr_code_title: properties.qr_code_title?.substring(0, 100),
        short_url: properties.short_url?.substring(0, 200),
        customization_options: JSON.stringify(properties.customization_options),
        error_message: properties.error_message?.substring(0, 200),
      };

      const eventProperties: PostHogEventProperties = {
        ...getBaseEventProperties(),
        ...sanitizedProperties,
      };

      posthogClient.captureEvent("qr_code_shared", eventProperties);
    },
    []
  );

  return { trackQrCodeSharing };
};
