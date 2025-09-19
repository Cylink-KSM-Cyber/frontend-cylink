/**
 * QR Code Bulk Operation Conversion Tracking
 *
 * Provides a hook for tracking QR code bulk operation conversion events in PostHog analytics.
 * Encapsulates logic for capturing bulk download and delete operations with relevant metadata and sanitization.
 *
 * @module src/hooks/conversionTrackings/useTrackQrCodeBulkOperation
 */
import { useCallback } from "react";
import posthogClient from "@/utils/posthogClient";
import { QrCodeBulkOperationProperties } from "@/interfaces/conversionTrackings/QrCodeBulkOperationProperties";
import { buildQrCodeBulkOperationEvent } from "@/utils/qrCodeBulkOperationEvent";

export const useTrackQrCodeBulkOperation = () => {
  const trackQrCodeBulkOperation = useCallback(
    (properties: QrCodeBulkOperationProperties) => {
      if (
        !properties.operation_type ||
        !["bulk_download", "bulk_delete"].includes(properties.operation_type)
      ) {
        console.warn(
          "Invalid operation_type provided to trackQrCodeBulkOperation"
        );
        return;
      }
      if (!properties.qr_codes_count || properties.qr_codes_count <= 0) {
        console.warn(
          "Invalid qr_codes_count provided to trackQrCodeBulkOperation"
        );
        return;
      }
      if (!properties.qr_code_ids || properties.qr_code_ids.length === 0) {
        console.warn(
          "Invalid qr_code_ids provided to trackQrCodeBulkOperation"
        );
        return;
      }
      if (!properties.url_ids || properties.url_ids.length === 0) {
        console.warn("Invalid url_ids provided to trackQrCodeBulkOperation");
        return;
      }
      if (
        !properties.qr_code_titles ||
        properties.qr_code_titles.length === 0
      ) {
        console.warn(
          "Invalid qr_code_titles provided to trackQrCodeBulkOperation"
        );
        return;
      }
      if (!properties.short_urls || properties.short_urls.length === 0) {
        console.warn("Invalid short_urls provided to trackQrCodeBulkOperation");
        return;
      }
      if (
        !properties.customization_options ||
        properties.customization_options.length === 0
      ) {
        console.warn(
          "Invalid customization_options provided to trackQrCodeBulkOperation"
        );
        return;
      }
      if (
        !["list_view", "grid_view", "bulk_actions_panel"].includes(
          properties.ui_source
        )
      ) {
        console.warn("Invalid ui_source provided to trackQrCodeBulkOperation");
        return;
      }

      // Add array length consistency validation
      if (properties.qr_code_ids.length !== properties.url_ids.length) {
        console.warn(
          "Array length mismatch: qr_code_ids and url_ids must have the same length"
        );
        return;
      }

      if (properties.qr_code_ids.length !== properties.qr_codes_count) {
        console.warn(
          "Count mismatch: qr_codes_count doesn't match actual array length"
        );
        return;
      }

      if (properties.qr_code_ids.length !== properties.qr_code_titles.length) {
        console.warn(
          "Array length mismatch: qr_code_ids and qr_code_titles must have the same length"
        );
        return;
      }

      if (properties.qr_code_ids.length !== properties.short_urls.length) {
        console.warn(
          "Array length mismatch: qr_code_ids and short_urls must have the same length"
        );
        return;
      }

      if (
        properties.qr_code_ids.length !==
        properties.customization_options.length
      ) {
        console.warn(
          "Array length mismatch: qr_code_ids and customization_options must have the same length"
        );
        return;
      }

      // Validate operation-specific properties
      if (properties.operation_type === "bulk_download") {
        if (
          !properties.download_format ||
          !["png", "svg", "mixed"].includes(properties.download_format)
        ) {
          console.warn(
            "Invalid download_format provided for bulk_download operation"
          );
          return;
        }
        if (
          !properties.download_method ||
          !["zip", "individual", "combined"].includes(
            properties.download_method
          )
        ) {
          console.warn(
            "Invalid download_method provided for bulk_download operation"
          );
          return;
        }
      }

      if (properties.operation_type === "bulk_delete") {
        if (
          !properties.deletion_method ||
          !["batch", "sequential", "api_bulk"].includes(
            properties.deletion_method
          )
        ) {
          console.warn(
            "Invalid deletion_method provided for bulk_delete operation"
          );
          return;
        }
      }

      const built = buildQrCodeBulkOperationEvent(properties);
      posthogClient.captureEvent("qr_code_bulk_operation", built.event);
      return true;
    },
    []
  );

  return { trackQrCodeBulkOperation };
};
