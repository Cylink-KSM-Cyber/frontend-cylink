/**
 * QR Code Bulk Operation Event Builder
 *
 * Centralizes sanitization for QR code bulk operation analytics
 * and produces PostHog event properties ready to be sent.
 *
 * @module src/utils/qrCodeBulkOperationEvent
 */

import type { PostHogEventProperties } from "@/utils/posthogClient";
import { getBaseEventProperties } from "@/utils/conversionTrackingEventUtils";
import type { QrCodeBulkOperationProperties } from "@/interfaces/conversionTrackings/QrCodeBulkOperationProperties";

/**
 * Build PostHog event properties for a bulk operation
 * Assumes caller has already validated input properties.
 */
export const buildQrCodeBulkOperationEvent = (
  properties: QrCodeBulkOperationProperties
): { ok: true; event: PostHogEventProperties } => {
  const sanitizedProperties = {
    ...properties,
    qr_code_ids: JSON.stringify(properties.qr_code_ids),
    url_ids: JSON.stringify(properties.url_ids),
    qr_code_titles: JSON.stringify(
      properties.qr_code_titles.map((title) => title?.substring(0, 100))
    ),
    short_urls: JSON.stringify(
      properties.short_urls.map((url) => url?.substring(0, 200))
    ),
    customization_options: JSON.stringify(
      properties.customization_options.map((options) => JSON.stringify(options))
    ),
    deletion_reason: properties.deletion_reason?.substring(0, 200),
    error_message: properties.error_message?.substring(0, 200),
  };

  const event: PostHogEventProperties = {
    ...getBaseEventProperties(),
    ...sanitizedProperties,
  };

  return { ok: true, event };
};

export default buildQrCodeBulkOperationEvent;
