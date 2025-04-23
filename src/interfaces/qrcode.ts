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

/**
 * QR Code Edit Request Interface
 * @description Defines the structure for editing a QR code
 */
export interface QrCodeEditRequest {
  /** Foreground color in hex format */
  color: string;
  /** Background color in hex format */
  background_color: string;
  /** Whether to include logo */
  include_logo: boolean;
  /** Logo size as an integer percentage (0-100) */
  logo_size: number;
  /** QR code size in pixels */
  size: number;
}

/**
 * QR Code Update Response Interface
 * @description Defines the structure of the QR code update response
 */
export interface QrCodeUpdateResponse {
  /** Response status code */
  status: number;
  /** Response message */
  message: string;
  /** Updated QR code data */
  data: {
    /** QR code ID */
    id: number;
    /** URL ID this QR code is associated with */
    url_id: number;
    /** Short URL */
    short_url: string;
    /** QR code image URL */
    image_url: string;
    /** QR code customization settings */
    customization: {
      /** Foreground color */
      foreground_color: string;
      /** Background color */
      background_color: string;
      /** Whether logo is included */
      include_logo: boolean;
      /** Logo size */
      logo_size: number;
      /** QR code size */
      size: number;
    };
    /** Created date */
    created_at: string;
    /** Updated date */
    updated_at: string;
  };
}

/**
 * QR Code Delete Response Interface
 * @description Defines the structure for QR code deletion response
 */
export interface QrCodeDeleteResponse {
  /** Response status code */
  status: number;
  /** Response message */
  message: string;
  /** Deleted QR code data */
  data: {
    /** QR code ID */
    id: number;
    /** Deletion timestamp */
    deleted_at: string;
  };
}
