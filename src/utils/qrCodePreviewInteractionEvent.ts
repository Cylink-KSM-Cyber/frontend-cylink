/**
 * QR Code Preview Interaction Event Builder
 *
 * Centralizes sanitization for QR code preview interaction analytics
 * and produces PostHog event properties ready to be sent.
 *
 * @module src/utils/qrCodePreviewInteractionEvent
 */

import type { PostHogEventProperties } from "@/utils/posthogClient";
import { getBaseEventProperties } from "@/utils/conversionTrackingEventUtils";
import type { QrCodePreviewInteractionProperties } from "@/interfaces/conversionTrackings/QrCodePreviewInteractionProperties";

/**
 * Build PostHog event properties for a QR code preview interaction
 * Assumes caller has already validated input properties.
 */
export const buildQrCodePreviewInteractionEvent = (
  properties: QrCodePreviewInteractionProperties
): { ok: true; event: PostHogEventProperties } => {
  const sanitizedProperties = {
    ...properties,
    qr_code_title: properties.qr_code_title?.substring(0, 100),
    short_url: properties.short_url?.substring(0, 200),
    customization_options: JSON.stringify(properties.customization_options),
    error_message: properties.error_message?.substring(0, 200),
  };

  const event: PostHogEventProperties = {
    ...getBaseEventProperties(),
    ...sanitizedProperties,
  };

  return { ok: true, event };
};

export default buildQrCodePreviewInteractionEvent;
