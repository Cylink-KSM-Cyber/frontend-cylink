/**
 * QR Code Download Conversion Tracking
 *
 * Provides a hook for tracking QR code download conversion events in PostHog analytics.
 * Encapsulates logic for capturing QR code downloads with relevant metadata and sanitization.
 *
 * @module src/hooks/conversionTrackings/useTrackQrCodeDownload
 */
import { useCallback } from "react";
import posthogClient, { PostHogEventProperties } from "@/utils/posthogClient";
import { QrCodeDownloadProperties } from "@/interfaces/conversionTrackings/QrCodeDownloadProperties";
import { getBaseEventProperties } from "@/utils/conversionTrackingEventUtils";

export const useTrackQrCodeDownload = () => {
  const trackQrCodeDownload = useCallback(
    (properties: QrCodeDownloadProperties) => {
      if (!properties.qr_code_id || properties.qr_code_id <= 0) {
        console.warn("Invalid qr_code_id provided to trackQrCodeDownload");
        return;
      }
      if (!properties.url_id || properties.url_id <= 0) {
        console.warn("Invalid url_id provided to trackQrCodeDownload");
        return;
      }
      if (
        !properties.qr_code_title ||
        properties.qr_code_title.trim().length === 0
      ) {
        console.warn("Invalid qr_code_title provided to trackQrCodeDownload");
        return;
      }
      if (!properties.short_url || properties.short_url.trim().length === 0) {
        console.warn("Invalid short_url provided to trackQrCodeDownload");
        return;
      }
      if (
        !properties.customization_options ||
        typeof properties.customization_options !== "object"
      ) {
        console.warn(
          "Invalid customization_options provided to trackQrCodeDownload"
        );
        return;
      }
      if (!["png", "svg"].includes(properties.download_format)) {
        console.warn("Invalid download_format provided to trackQrCodeDownload");
        return;
      }

      const sanitizedProperties = {
        ...properties,
        qr_code_title: properties.qr_code_title?.substring(0, 100),
        short_url: properties.short_url?.substring(0, 200),
        customization_options: JSON.stringify(properties.customization_options),
      };

      const eventProperties: PostHogEventProperties = {
        ...getBaseEventProperties(),
        ...sanitizedProperties,
      };

      posthogClient.captureEvent("qr_code_downloaded", eventProperties);
    },
    []
  );

  return { trackQrCodeDownload };
};
