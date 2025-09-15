/**
 * QR Code Mapping Utilities
 * @description Helpers to map API QR code responses to internal models and compute derived values
 * @module src/utils/qrcodeMapping
 */

import type { QrCode } from "@/interfaces/url";

/**
 * Compute QR code age in days from createdAt ISO string
 */
export const computeQrCodeAgeDays = (createdAt: string): number => {
  return Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
};

/**
 * Map a single API QR code item to internal QrCode model
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapApiQrCodeToModel = (apiQrCode: any): QrCode => {
  return {
    id: apiQrCode.id,
    urlId: apiQrCode.url_id,
    shortCode: apiQrCode.short_code,
    shortUrl: apiQrCode.short_url,
    // Deprecated image fields (kept as undefined as per current behavior)
    imageUrl: undefined,
    pngUrl: undefined,
    svgUrl: undefined,
    createdAt: apiQrCode.created_at,
    updatedAt: apiQrCode.updated_at,
    scans: apiQrCode.url?.clicks || 0,
    title: apiQrCode.url?.title || apiQrCode.short_code,
    description: apiQrCode.url?.original_url,
    customization: {
      foregroundColor: apiQrCode.color || "#000000",
      backgroundColor: apiQrCode.background_color || "#FFFFFF",
      includeLogo: apiQrCode.include_logo,
      logoSize: apiQrCode.logo_size || 0.25,
      size: apiQrCode.size || 300,
      logoUrl: apiQrCode.include_logo ? "/logo/logo-ksm.svg" : undefined,
      cornerRadius: 0,
    },
  } as QrCode;
};

/**
 * Map a list of API QR code items to internal QrCode[]
 */
export const mapApiListToQrCodes = (apiList: unknown[]): QrCode[] => {
  return apiList.map(mapApiQrCodeToModel);
};
