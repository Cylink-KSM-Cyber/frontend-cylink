/**
 * QR Code Bulk Operation Tracking Properties Interface
 *
 * Defines the properties required for tracking QR code bulk operation events. Ensures structured and type-safe event tracking for bulk download and delete operations in analytics systems.
 *
 * @module src/interfaces/conversionTrackings/QrCodeBulkOperationProperties
 */

import { QrCodeCustomizationOptions } from "./QrCodeCustomizationOptions";

export interface QrCodeBulkOperationProperties {
  /** Operation type (bulk_download or bulk_delete) */
  operation_type: "bulk_download" | "bulk_delete";
  /** Number of QR codes involved in the operation */
  qr_codes_count: number;
  /** Array of QR code IDs involved in the operation */
  qr_code_ids: number[];
  /** Array of URL IDs associated with the QR codes */
  url_ids: number[];
  /** Array of QR code titles or identifiers */
  qr_code_titles: string[];
  /** Array of short URLs associated with the QR codes */
  short_urls: string[];
  /** Download format for bulk download operations (png, svg, or mixed) */
  download_format?: "png" | "svg" | "mixed";
  /** Download method for bulk download operations (zip, individual, or combined) */
  download_method?: "zip" | "individual" | "combined";
  /** Deletion method for bulk delete operations (batch, sequential, or api_bulk) */
  deletion_method?: "batch" | "sequential" | "api_bulk";
  /** Reason for bulk delete operations */
  deletion_reason?: string;
  /** Array of customization options for each QR code */
  customization_options: QrCodeCustomizationOptions[];
  /** Total number of scans across all QR codes before operation */
  total_scans: number;
  /** Average age of QR codes in days */
  average_qr_code_age_days: number;
  /** Number of QR codes with logos */
  qr_codes_with_logos: number;
  /** Whether the operation was successful */
  success: boolean;
  /** Number of successful operations */
  success_count: number;
  /** Number of failed operations */
  failed_count: number;
  /** Error message if operation failed */
  error_message?: string;
  /** Operation duration in milliseconds */
  operation_duration_ms?: number;
  /** User interface source (list_view, grid_view, bulk_actions_panel) */
  ui_source: "list_view" | "grid_view" | "bulk_actions_panel";
}
