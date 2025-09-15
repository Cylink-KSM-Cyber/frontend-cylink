/**
 * QR Code Preview Interaction Tracking Properties Interface
 *
 * Defines the properties required for tracking QR code preview interaction events. Ensures structured and type-safe event tracking for QR code preview interactions in analytics systems.
 *
 * @module src/interfaces/conversionTrackings/QrCodePreviewInteractionProperties
 */

import { QrCodeCustomizationOptions } from "./QrCodeCustomizationOptions";

export interface QrCodePreviewInteractionProperties {
  /** QR code ID being previewed */
  qr_code_id: number;
  /** URL ID associated with the QR code */
  url_id: number;
  /** QR code title or identifier */
  qr_code_title: string;
  /** Short URL associated with the QR code */
  short_url: string;
  /** Customization options of the previewed QR code */
  customization_options: QrCodeCustomizationOptions;
  /** Preview interaction type (open, close, view_details, etc.) */
  interaction_type:
    | "open_preview"
    | "close_preview"
    | "view_details"
    | "interact_with_preview";
  /** Preview source (list_view, grid_view, edit_modal, etc.) */
  preview_source:
    | "list_view"
    | "grid_view"
    | "edit_modal"
    | "creation_flow"
    | "direct_link";
  /** Preview duration in seconds (if applicable) */
  preview_duration_seconds?: number;
  /** Whether the QR code includes a logo */
  includes_logo: boolean;
  /** Total number of scans before preview */
  total_scans: number;
  /** Age of QR code in days */
  qr_code_age_days: number;
  /** Whether the interaction was successful */
  success: boolean;
  /** Error message if interaction failed */
  error_message?: string;
}
