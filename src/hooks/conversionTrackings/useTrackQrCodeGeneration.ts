/**
 * QR Code Generation Conversion Tracking
 *
 * Provides a hook for tracking QR code generation conversion events in PostHog analytics.
 * Encapsulates logic for capturing QR code generation with relevant metadata.
 *
 * @module src/hooks/conversionTrackings/useTrackQrCodeGeneration
 */
import { useCallback } from "react";
import posthogClient, { PostHogEventProperties } from "@/utils/posthogClient";
import { QrCodeGenerationProperties } from "@/interfaces/conversionTracking";

export const useTrackQrCodeGeneration = () => {
  const trackQrCodeGeneration = useCallback(
    (properties: QrCodeGenerationProperties) => {
      if (!properties.url_id || properties.url_id <= 0) {
        console.warn("Invalid url_id provided to trackQrCodeGeneration");
        return;
      }
      if (
        !properties.customization_options ||
        typeof properties.customization_options !== "object"
      ) {
        console.warn(
          "Invalid customization_options provided to trackQrCodeGeneration"
        );
        return;
      }
      const eventProperties: PostHogEventProperties = {
        timestamp: new Date().toISOString(),
        source:
          typeof window !== "undefined" ? window.location.pathname : "server",
        user_agent:
          typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        screen_resolution:
          typeof screen !== "undefined"
            ? `${screen.width}x${screen.height}`
            : undefined,
        url_id: properties.url_id,
        customization_options: JSON.stringify(properties.customization_options),
        downloaded: properties.downloaded,
        shared: properties.shared,
      };
      posthogClient.captureEvent("qr_code_generated", eventProperties);
    },
    []
  );
  return { trackQrCodeGeneration };
};
