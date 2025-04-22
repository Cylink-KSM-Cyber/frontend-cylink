/**
 * QR Code Color
 * @description Defines the structure of a QR code color option
 */
export interface QrCodeColor {
  name: string;
  hex: string;
}

/**
 * QR Code Colors Response
 * @description Defines the structure of the QR code colors API response
 */
export interface QrCodeColorsResponse {
  status: number;
  message: string;
  data: {
    colors: string[];
  };
}

/**
 * QR Code Generate Request
 * @description Defines the structure of the QR code generation request payload
 */
export interface QrCodeGenerateRequest {
  url_id: number;
  color?: string;
  background_color?: string;
  include_logo?: boolean;
  logo_size?: number;
  size?: number;
}

/**
 * QR Code Generate Response
 * @description Defines the structure of the QR code generation API response
 */
export interface QrCodeGenerateResponse {
  status: number;
  message: string;
  data: {
    id: number;
    url_id: number;
    short_code: string;
    short_url: string;
    qr_code_url: string;
    png_url: string;
    svg_url: string;
    color: string;
    background_color: string;
    include_logo: boolean;
    logo_size: number;
    size: number;
    created_at: string;
    updated_at: string;
  };
}

/**
 * QR Code API Response Interface
 * @description Response from the QR codes list API endpoint
 */
export interface QrCodeApiResponse {
  status: number;
  message: string;
  data: Array<{
    id: number;
    url_id: number;
    short_code: string;
    short_url: string;
    qr_code_url: string;
    png_url: string;
    svg_url: string;
    color: string;
    background_color: string;
    include_logo: boolean;
    logo_size: number;
    size: number;
    created_at: string;
    updated_at: string;
    url?: {
      id: number;
      original_url: string;
      title: string;
      clicks: number;
    };
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

/**
 * QR Code Filter Interface
 * @description Filter parameters for QR codes API
 */
export interface QrCodeFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  color?: string;
  includeLogo?: boolean;
  includeUrl?: boolean;
}

/**
 * QR Code Stats Interface
 * @description Stats about QR codes
 */
export interface QrCodeStats {
  total: number;
  createdToday: number;
}
