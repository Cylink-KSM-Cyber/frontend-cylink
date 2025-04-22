import { get, post } from "./api";
import {
  QrCodeColorsResponse,
  QrCodeGenerateRequest,
  QrCodeGenerateResponse,
  QrCodeApiResponse,
  QrCodeFilter,
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

/**
 * Fetch QR codes list with optional filtering
 * @param filter - Filter parameters for QR codes
 * @returns Promise with QR codes list response
 */
export const fetchQrCodes = async (
  filter?: QrCodeFilter
): Promise<QrCodeApiResponse> => {
  let endpoint = `/api/v1/qr-codes`;

  // Add query parameters if filters are provided
  if (filter) {
    const params = new URLSearchParams();

    if (filter.page) params.append("page", filter.page.toString());
    if (filter.limit) params.append("limit", filter.limit.toString());
    if (filter.sortBy) params.append("sortBy", filter.sortBy);
    if (filter.sortOrder) params.append("sortOrder", filter.sortOrder);
    if (filter.search) params.append("search", filter.search);
    if (filter.color) params.append("color", filter.color);
    if (filter.includeLogo !== undefined)
      params.append("includeLogo", filter.includeLogo.toString());
    if (filter.includeUrl !== undefined)
      params.append("includeUrl", filter.includeUrl.toString());

    const queryString = params.toString();
    if (queryString) endpoint += `?${queryString}`;
  }

  return get<QrCodeApiResponse>(endpoint);
};
