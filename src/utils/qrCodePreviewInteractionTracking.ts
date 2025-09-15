/**
 * QR Code Preview Interaction Tracking Utility
 *
 * Provides utility functions for tracking QR code preview interaction events in PostHog analytics.
 * This utility can be used in service layers where React hooks are not available.
 *
 * @module src/utils/qrCodePreviewInteractionTracking
 */
import posthogClient from "@/utils/posthogClient";
import { buildQrCodePreviewInteractionEvent } from "@/utils/qrCodePreviewInteractionEvent";
import { QrCodePreviewInteractionProperties } from "@/interfaces/conversionTrackings/QrCodePreviewInteractionProperties";

/**
 * Track QR code preview interaction event
 * @param properties - QR code preview interaction tracking properties
 */
export const trackQrCodePreviewInteraction = (
  properties: QrCodePreviewInteractionProperties
): boolean => {
  if (!properties.qr_code_id || properties.qr_code_id <= 0) {
    console.warn(
      "Invalid qr_code_id provided to trackQrCodePreviewInteraction"
    );
    return false;
  }
  if (!properties.url_id || properties.url_id <= 0) {
    console.warn("Invalid url_id provided to trackQrCodePreviewInteraction");
    return false;
  }
  if (
    !properties.qr_code_title ||
    properties.qr_code_title.trim().length === 0
  ) {
    console.warn(
      "Invalid qr_code_title provided to trackQrCodePreviewInteraction"
    );
    return false;
  }
  if (!properties.short_url || properties.short_url.trim().length === 0) {
    console.warn("Invalid short_url provided to trackQrCodePreviewInteraction");
    return false;
  }
  if (
    !properties.customization_options ||
    typeof properties.customization_options !== "object"
  ) {
    console.warn(
      "Invalid customization_options provided to trackQrCodePreviewInteraction"
    );
    return false;
  }
  if (
    ![
      "open_preview",
      "close_preview",
      "view_details",
      "interact_with_preview",
    ].includes(properties.interaction_type)
  ) {
    console.warn(
      "Invalid interaction_type provided to trackQrCodePreviewInteraction"
    );
    return false;
  }
  if (
    ![
      "list_view",
      "grid_view",
      "edit_modal",
      "creation_flow",
      "direct_link",
    ].includes(properties.preview_source)
  ) {
    console.warn(
      "Invalid preview_source provided to trackQrCodePreviewInteraction"
    );
    return false;
  }

  const built = buildQrCodePreviewInteractionEvent(properties);
  posthogClient.captureEvent("qr_code_preview_interaction", built.event);
  return true;
};
