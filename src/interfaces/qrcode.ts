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
    foreground_colors: QrCodeColor[];
    background_colors: QrCodeColor[];
  };
}

/**
 * QR Code Generate Request
 * @description Defines the structure of the QR code generation request payload
 */
export interface QrCodeGenerateRequest {
  url_id: number;
  short_code: string;
  color: string;
  background_color: string;
  include_logo: boolean;
  logo_size: number;
  size: number;
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
    image_url: string;
    created_at: string;
  };
}
