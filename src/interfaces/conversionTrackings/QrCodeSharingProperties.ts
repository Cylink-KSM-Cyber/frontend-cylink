/**
 * QR Code Sharing Tracking Properties Interface
 *
 * Defines the properties required for tracking QR code sharing events. Ensures structured and type-safe event tracking for QR code sharing in analytics systems.
 *
 * @module src/interfaces/conversionTrackings/QrCodeSharingProperties
 */

import { QrCodeCustomizationOptions } from "./QrCodeCustomizationOptions";

export interface QrCodeSharingProperties {
  /** QR code ID being shared */
  qr_code_id: number;
  /** URL ID associated with the QR code */
  url_id: number;
  /** QR code title or identifier */
  qr_code_title: string;
  /** Short URL associated with the QR code */
  short_url: string;
  /** Customization options of the shared QR code */
  customization_options: QrCodeCustomizationOptions;
  /** Sharing method used (web_share_api, clipboard, etc.) */
  sharing_method: "web_share_api" | "clipboard" | "direct_link";
  /** Platform where sharing occurred (mobile, desktop, etc.) */
  sharing_platform: "mobile" | "desktop" | "tablet";
  /** Whether the QR code includes a logo */
  includes_logo: boolean;
  /** Total number of scans before sharing */
  total_scans: number;
  /** Age of QR code in days */
  qr_code_age_days: number;
  /** Whether the sharing was successful */
  success: boolean;
  /** Error message if sharing failed */
  error_message?: string;
}
