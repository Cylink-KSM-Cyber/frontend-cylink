/**
 * QR Code Preview Interaction Tracking Utility
 *
 * Provides utility functions for tracking QR code preview interaction events in PostHog analytics.
 * This utility can be used in service layers where React hooks are not available.
 *
 * @module src/utils/qrCodePreviewInteractionTracking
 */
import posthogClient, { PostHogEventProperties } from "@/utils/posthogClient";
import { getBaseEventProperties } from "@/utils/conversionTrackingEventUtils";
import { QrCodePreviewInteractionProperties } from "@/interfaces/conversionTrackings/QrCodePreviewInteractionProperties";

/**
 * Track QR code preview interaction event
 * @param properties - QR code preview interaction tracking properties
 */
export const trackQrCodePreviewInteraction = (
  properties: QrCodePreviewInteractionProperties
): void => {
  if (!properties.qr_code_id || properties.qr_code_id <= 0) {
    console.warn(
      "Invalid qr_code_id provided to trackQrCodePreviewInteraction"
    );
    return;
  }
  if (!properties.url_id || properties.url_id <= 0) {
    console.warn("Invalid url_id provided to trackQrCodePreviewInteraction");
    return;
  }
  if (
    !properties.qr_code_title ||
    properties.qr_code_title.trim().length === 0
  ) {
    console.warn(
      "Invalid qr_code_title provided to trackQrCodePreviewInteraction"
    );
    return;
  }
  if (!properties.short_url || properties.short_url.trim().length === 0) {
    console.warn("Invalid short_url provided to trackQrCodePreviewInteraction");
    return;
  }
  if (
    !properties.customization_options ||
    typeof properties.customization_options !== "object"
  ) {
    console.warn(
      "Invalid customization_options provided to trackQrCodePreviewInteraction"
    );
    return;
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
    return;
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

  posthogClient.captureEvent("qr_code_preview_interaction", eventProperties);
};
