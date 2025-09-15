/**
 * QR Code Download Tracking Utility
 *
 * Provides utility functions for tracking QR code download events in PostHog analytics.
 * This utility can be used in service layers where React hooks are not available.
 *
 * @module src/utils/qrCodeDownloadTracking
 */
import posthogClient from "@/utils/posthogClient";
import { QrCodeDownloadProperties } from "@/interfaces/conversionTrackings/QrCodeDownloadProperties";
import { buildQrCodeDownloadEvent } from "@/utils/qrCodeDownloadEvent";

/**
 * Track QR code download event
 * @param properties - QR code download tracking properties
 */
export const trackQrCodeDownload = (
  properties: QrCodeDownloadProperties
): boolean => {
  const result = buildQrCodeDownloadEvent(properties);
  if (!result.ok) {
    console.warn(result.error);
    return false;
  }
  posthogClient.captureEvent("qr_code_downloaded", result.event);
  return true;
};
