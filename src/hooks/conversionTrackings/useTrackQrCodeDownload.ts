/**
 * QR Code Download Conversion Tracking
 *
 * Provides a hook for tracking QR code download conversion events in PostHog analytics.
 * Encapsulates logic for capturing QR code downloads with relevant metadata and sanitization.
 *
 * @module src/hooks/conversionTrackings/useTrackQrCodeDownload
 */
import { useCallback } from "react";
import posthogClient from "@/utils/posthogClient";
import { QrCodeDownloadProperties } from "@/interfaces/conversionTrackings/QrCodeDownloadProperties";
import { buildQrCodeDownloadEvent } from "@/utils/qrCodeDownloadEvent";

export const useTrackQrCodeDownload = () => {
  const trackQrCodeDownload = useCallback(
    (properties: QrCodeDownloadProperties) => {
      const result = buildQrCodeDownloadEvent(properties);
      if (!result.ok) {
        console.warn(result.error);
        return false;
      }
      posthogClient.captureEvent("qr_code_downloaded", result.event);
      return true;
    },
    []
  );

  return { trackQrCodeDownload };
};
