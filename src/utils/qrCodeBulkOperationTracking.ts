/**
 * QR Code Bulk Operation Tracking Utility
 *
 * Provides utility functions for tracking QR code bulk operation events in PostHog analytics.
 * This utility can be used in service layers where React hooks are not available.
 *
 * @module src/utils/qrCodeBulkOperationTracking
 */
import posthogClient from "@/utils/posthogClient";
import { QrCodeBulkOperationProperties } from "@/interfaces/conversionTrackings/QrCodeBulkOperationProperties";
import { buildQrCodeBulkOperationEvent } from "@/utils/qrCodeBulkOperationEvent";

/**
 * Track QR code bulk operation event
 * @param properties - QR code bulk operation tracking properties
 */
export const trackQrCodeBulkOperation = (
  properties: QrCodeBulkOperationProperties
): boolean => {
  if (
    !properties.operation_type ||
    !["bulk_download", "bulk_delete"].includes(properties.operation_type)
  ) {
    console.warn("Invalid operation_type provided to trackQrCodeBulkOperation");
    return false;
  }
  if (!properties.qr_codes_count || properties.qr_codes_count <= 0) {
    console.warn("Invalid qr_codes_count provided to trackQrCodeBulkOperation");
    return false;
  }
  if (!properties.qr_code_ids || properties.qr_code_ids.length === 0) {
    console.warn("Invalid qr_code_ids provided to trackQrCodeBulkOperation");
    return false;
  }
  if (!properties.url_ids || properties.url_ids.length === 0) {
    console.warn("Invalid url_ids provided to trackQrCodeBulkOperation");
    return false;
  }
  if (!properties.qr_code_titles || properties.qr_code_titles.length === 0) {
    console.warn("Invalid qr_code_titles provided to trackQrCodeBulkOperation");
    return false;
  }
  if (!properties.short_urls || properties.short_urls.length === 0) {
    console.warn("Invalid short_urls provided to trackQrCodeBulkOperation");
    return false;
  }
  if (
    !properties.customization_options ||
    properties.customization_options.length === 0
  ) {
    console.warn(
      "Invalid customization_options provided to trackQrCodeBulkOperation"
    );
    return false;
  }
  if (
    !["list_view", "grid_view", "bulk_actions_panel"].includes(
      properties.ui_source
    )
  ) {
    console.warn("Invalid ui_source provided to trackQrCodeBulkOperation");
    return false;
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
      return false;
    }
    if (
      !properties.download_method ||
      !["zip", "individual", "combined"].includes(properties.download_method)
    ) {
      console.warn(
        "Invalid download_method provided for bulk_download operation"
      );
      return false;
    }
  }

  if (properties.operation_type === "bulk_delete") {
    if (
      !properties.deletion_method ||
      !["batch", "sequential", "api_bulk"].includes(properties.deletion_method)
    ) {
      console.warn(
        "Invalid deletion_method provided for bulk_delete operation"
      );
      return false;
    }
  }

  const built = buildQrCodeBulkOperationEvent(properties);
  posthogClient.captureEvent("qr_code_bulk_operation", built.event);
  return true;
};
