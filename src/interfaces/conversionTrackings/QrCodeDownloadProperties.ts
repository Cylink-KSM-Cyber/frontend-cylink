/**
 * QR Code Download Tracking Properties Interface
 *
 * Defines the properties required for tracking QR code download events. Ensures structured and type-safe event tracking for QR code downloads in analytics systems.
 *
 * @module src/interfaces/conversionTrackings/QrCodeDownloadProperties
 */

import { QrCodeCustomizationOptions } from "./QrCodeCustomizationOptions";

export interface QrCodeDownloadProperties {
  /** QR code ID being downloaded */
  qr_code_id: number;
  /** URL ID associated with the QR code */
  url_id: number;
  /** QR code title or identifier */
  qr_code_title: string;
  /** Short URL associated with the QR code */
  short_url: string;
  /** Customization options of the downloaded QR code */
  customization_options: QrCodeCustomizationOptions;
  /** Download format (png or svg) */
  download_format: "png" | "svg";
  /** Download size in pixels */
  download_size: number;
  /** Whether the QR code includes a logo */
  includes_logo: boolean;
  /** Total number of scans before download */
  total_scans: number;
  /** Age of QR code in days */
  qr_code_age_days: number;
  /** Download method (individual, bulk, etc.) */
  download_method: "individual" | "bulk";
  /** Whether the download was successful */
  success: boolean;
}
