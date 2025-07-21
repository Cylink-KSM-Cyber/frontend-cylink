/**
 * QR Code Format Type
 *
 * Defines the available formats for QR code generation. Ensures type safety when specifying output formats.
 *
 * @module src/types/conversionTrackings/QrCodeFormat
 */

export type QrCodeFormat = "png" | "svg" | "jpeg";

/**
 * Type guard to check if a value is a valid QrCodeFormat
 * @param value - Value to check
 * @returns True if value is a valid QrCodeFormat
 */
export const isQrCodeFormat = (value: unknown): value is QrCodeFormat => {
  const validFormats: QrCodeFormat[] = ["png", "svg", "jpeg"];
  return (
    typeof value === "string" && validFormats.includes(value as QrCodeFormat)
  );
};
