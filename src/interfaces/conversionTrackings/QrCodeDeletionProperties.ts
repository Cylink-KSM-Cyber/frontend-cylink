/**
 * QR Code Deletion Tracking Properties Interface
 *
 * Defines the properties required for tracking QR code deletion events. Ensures structured and type-safe event tracking for QR code deletions in analytics systems.
 *
 * @module src/interfaces/conversionTrackings/QrCodeDeletionProperties
 */

import { QrCodeCustomizationOptions } from "./QrCodeCustomizationOptions";

export interface QrCodeDeletionProperties {
  /** QR code ID being deleted */
  qr_code_id: number;
  /** URL ID associated with the QR code */
  url_id: number;
  /** QR code title or identifier */
  qr_code_title: string;
  /** Short URL associated with the QR code */
  short_url: string;
  /** Customization options of the deleted QR code */
  customization_options: QrCodeCustomizationOptions;
  /** Total number of scans before deletion */
  total_scans: number;
  /** Age of QR code in days */
  qr_code_age_days: number;
  /** Deletion method (manual, bulk, etc.) */
  deletion_method: "manual" | "bulk";
  /** Reason for deletion if provided */
  deletion_reason?: string;
  /** Whether the deletion was successful */
  success: boolean;
}
