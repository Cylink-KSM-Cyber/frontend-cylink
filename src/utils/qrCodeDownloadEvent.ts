/**
 * QR Code Download Event Builder
 *
 * Centralizes validation and sanitization for QR code download analytics
 * and produces PostHog event properties ready to be sent.
 *
 * @module src/utils/qrCodeDownloadEvent
 */

import type { PostHogEventProperties } from "@/utils/posthogClient";
import { getBaseEventProperties } from "@/utils/conversionTrackingEventUtils";
import type { QrCodeDownloadProperties } from "@/interfaces/conversionTrackings/QrCodeDownloadProperties";

/**
 * Validate, sanitize, and build event properties for a QR code download.
 * @param properties Raw QR code download properties
 * @returns Result with ok flag and built event or error message
 */
export const buildQrCodeDownloadEvent = (
  properties: QrCodeDownloadProperties
):
  | { ok: true; event: PostHogEventProperties }
  | { ok: false; error: string } => {
  if (!properties.qr_code_id || properties.qr_code_id <= 0) {
    return {
      ok: false,
      error: "Invalid qr_code_id provided to trackQrCodeDownload",
    };
  }
  if (!properties.url_id || properties.url_id <= 0) {
    return {
      ok: false,
      error: "Invalid url_id provided to trackQrCodeDownload",
    };
  }
  if (
    !properties.qr_code_title ||
    properties.qr_code_title.trim().length === 0
  ) {
    return {
      ok: false,
      error: "Invalid qr_code_title provided to trackQrCodeDownload",
    };
  }
  if (!properties.short_url || properties.short_url.trim().length === 0) {
    return {
      ok: false,
      error: "Invalid short_url provided to trackQrCodeDownload",
    };
  }
  if (
    !properties.customization_options ||
    typeof properties.customization_options !== "object"
  ) {
    return {
      ok: false,
      error: "Invalid customization_options provided to trackQrCodeDownload",
    };
  }
  if (!["png", "svg"].includes(properties.download_format)) {
    return {
      ok: false,
      error: "Invalid download_format provided to trackQrCodeDownload",
    };
  }

  const sanitized = {
    ...properties,
    qr_code_title: properties.qr_code_title?.substring(0, 100),
    short_url: properties.short_url?.substring(0, 200),
    customization_options: JSON.stringify(properties.customization_options),
  };

  const event: PostHogEventProperties = {
    ...getBaseEventProperties(),
    ...sanitized,
  };

  return { ok: true, event };
};

export default buildQrCodeDownloadEvent;
