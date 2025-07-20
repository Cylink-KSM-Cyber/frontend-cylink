/**
 * QR Code Customization Options Interface
 *
 * Defines the options for customizing QR code appearance. Ensures structured and type-safe customization for QR code generation in analytics systems.
 *
 * @module src/interfaces/conversionTrackings/QrCodeCustomizationOptions
 */

import { QrCodeFormat } from "@/types/conversionTracking";

export interface QrCodeCustomizationOptions {
  foreground_color?: string;
  background_color?: string;
  size?: number;
  format?: QrCodeFormat;
}
