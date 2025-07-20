/**
 * QR Code Generation Tracking Properties Interface
 *
 * Defines the properties required for tracking QR code generation events. Ensures structured and type-safe event tracking for QR code generation in analytics systems.
 *
 * @module src/interfaces/conversionTrackings/QrCodeGenerationProperties
 */

import { QrCodeCustomizationOptions } from "./QrCodeCustomizationOptions";

export interface QrCodeGenerationProperties {
  url_id: number;
  customization_options: QrCodeCustomizationOptions;
  downloaded: boolean;
  shared: boolean;
}
