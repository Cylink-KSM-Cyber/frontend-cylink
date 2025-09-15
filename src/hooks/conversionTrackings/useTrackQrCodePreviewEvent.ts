/**
 * QR Code Preview Event Tracker
 * @description Provides a helper to build and track QR code preview interactions with consistent defaults.
 * @module src/hooks/conversionTrackings/useTrackQrCodePreviewEvent
 */

import type { QrCode } from "@/interfaces/url";
import { useTrackQrCodePreviewInteraction } from "./useTrackQrCodePreviewInteraction";

/**
 * useTrackQrCodePreviewEvent
 * @description Hook that exposes a function to track QR code preview open/close events.
 * It centralizes age calculation, default values, and payload structure.
 */
export const useTrackQrCodePreviewEvent = () => {
  const { trackQrCodePreviewInteraction } = useTrackQrCodePreviewInteraction();

  /**
   * Track a QR code preview interaction
   * @param params.qrCode The QR code domain object
   * @param params.interactionType Either "open_preview" or "close_preview"
   * @param params.previewSource UI source: "list_view" | "direct_link" | "grid_view" | "edit_modal" | "creation_flow"
   * @param params.previewDurationSeconds Optional duration in seconds (for close events)
   */
  const trackQrCodePreviewEvent = (params: {
    qrCode: QrCode;
    interactionType: "open_preview" | "close_preview";
    previewSource:
      | "list_view"
      | "direct_link"
      | "grid_view"
      | "edit_modal"
      | "creation_flow";
    previewDurationSeconds?: number;
  }) => {
    const { qrCode, interactionType, previewSource, previewDurationSeconds } =
      params;

    const qrCodeAgeDays = Math.floor(
      (Date.now() - new Date(qrCode.createdAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    trackQrCodePreviewInteraction({
      qr_code_id: qrCode.id,
      url_id: qrCode.urlId,
      qr_code_title: qrCode.title || `QR Code ${qrCode.id}`,
      short_url: qrCode.shortUrl || "",
      customization_options: {
        foreground_color: qrCode.customization?.foregroundColor || "#000000",
        background_color: qrCode.customization?.backgroundColor || "#FFFFFF",
        size: qrCode.customization?.size || 300,
      },
      interaction_type: interactionType,
      preview_source: previewSource,
      ...(previewDurationSeconds
        ? { preview_duration_seconds: previewDurationSeconds }
        : {}),
      includes_logo: qrCode.customization?.includeLogo || false,
      total_scans: qrCode.scans || 0,
      qr_code_age_days: qrCodeAgeDays,
      success: true,
    });
  };

  return { trackQrCodePreviewEvent };
};

export default useTrackQrCodePreviewEvent;
