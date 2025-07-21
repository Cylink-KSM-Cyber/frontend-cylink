/**
 * QR Code Edit Tracking Properties Interface
 *
 * Defines the properties required for tracking QR code edit events. Ensures structured and type-safe event tracking for QR code editing in analytics systems.
 *
 * @module src/interfaces/conversionTrackings/QrCodeEditProperties
 */

import { QrCodeCustomizationOptions } from "./QrCodeCustomizationOptions";

export interface QrCodeEditProperties {
  /** QR code ID being edited */
  qr_code_id: number;
  /** URL ID associated with the QR code */
  url_id: number;
  /** Previous customization options before edit */
  previous_customization: QrCodeCustomizationOptions;
  /** New customization options after edit */
  new_customization: QrCodeCustomizationOptions;
  /** Fields that were modified during the edit */
  fields_modified: string[];
  /** Whether the edit was successful */
  success: boolean;
}
