import { get, post } from "./api";
import {
  QrCodeColorsResponse,
  QrCodeGenerateRequest,
  QrCodeGenerateResponse,
} from "@/interfaces/qrcode";

/**
 * QR Code Service
 * @description Service for interacting with QR code-related API endpoints
 */

/**
 * Fetch available QR code colors
 * @returns Promise with QR code colors response
 */
export const fetchQrCodeColors = async (): Promise<QrCodeColorsResponse> => {
  const endpoint = `/api/v1/qr-codes/colors`;
  return get<QrCodeColorsResponse>(endpoint);
};

/**
 * Generate QR code for URL
 * @param data - QR code generation parameters
 * @returns Promise with QR code generation response
 */
export const generateQrCode = async (
  data: QrCodeGenerateRequest
): Promise<QrCodeGenerateResponse> => {
  const endpoint = `/api/v1/qr-codes`;
  return post<QrCodeGenerateResponse, QrCodeGenerateRequest>(endpoint, data);
};
