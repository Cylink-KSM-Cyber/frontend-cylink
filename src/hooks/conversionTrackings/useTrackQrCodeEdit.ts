/**
 * QR Code Edit Conversion Tracking
 *
 * Provides a hook for tracking QR code edit conversion events in PostHog analytics.
 * Encapsulates logic for capturing QR code editing with relevant metadata including
 * before and after customization options and modified fields.
 *
 * @module src/hooks/conversionTrackings/useTrackQrCodeEdit
 */
import { useCallback } from "react";
import posthogClient, { PostHogEventProperties } from "@/utils/posthogClient";
import { QrCodeEditProperties } from "@/interfaces/conversionTrackings/QrCodeEditProperties";
import { getBaseEventProperties } from "@/utils/conversionTrackingEventUtils";

export const useTrackQrCodeEdit = () => {
  const trackQrCodeEdit = useCallback((properties: QrCodeEditProperties) => {
    if (!properties.qr_code_id || properties.qr_code_id <= 0) {
      console.warn("Invalid qr_code_id provided to trackQrCodeEdit");
      return;
    }
    if (!properties.url_id || properties.url_id <= 0) {
      console.warn("Invalid url_id provided to trackQrCodeEdit");
      return;
    }
    if (
      !properties.previous_customization ||
      typeof properties.previous_customization !== "object"
    ) {
      console.warn(
        "Invalid previous_customization provided to trackQrCodeEdit"
      );
      return;
    }
    if (
      !properties.new_customization ||
      typeof properties.new_customization !== "object"
    ) {
      console.warn("Invalid new_customization provided to trackQrCodeEdit");
      return;
    }
    if (
      !properties.fields_modified ||
      !Array.isArray(properties.fields_modified)
    ) {
      console.warn("Invalid fields_modified provided to trackQrCodeEdit");
      return;
    }

    const eventProperties: PostHogEventProperties = {
      ...getBaseEventProperties(),
      qr_code_id: properties.qr_code_id,
      url_id: properties.url_id,
      previous_customization: JSON.stringify(properties.previous_customization),
      new_customization: JSON.stringify(properties.new_customization),
      fields_modified: properties.fields_modified.join(","),
      success: properties.success,
    };

    posthogClient.captureEvent("qr_code_edited", eventProperties);
  }, []);

  return { trackQrCodeEdit };
};
