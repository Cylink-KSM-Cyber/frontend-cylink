/** Common QR Event Utilities
 * Helpers for validating and sanitizing common QR event properties used across hooks
 * @module src/utils/qrcodeEventCommons
 */

// Define common properties locally to avoid external dependency
export type QrCodeCommonProperties = {
  qr_code_id: number;
  url_id: number;
  qr_code_title: string;
  short_url: string;
  customization_options: {
    foreground_color?: string;
    background_color?: string;
    size?: number;
  };
};

/**
 * Validate common QR event properties shared by multiple tracking hooks
 */
export const validateCommonQrEventProps = (
  props: QrCodeCommonProperties
): { ok: true } | { ok: false; error: string } => {
  if (!props.qr_code_id || props.qr_code_id <= 0) {
    return { ok: false, error: "Invalid qr_code_id" };
  }
  if (!props.url_id || props.url_id <= 0) {
    return { ok: false, error: "Invalid url_id" };
  }
  if (!props.qr_code_title || props.qr_code_title.trim().length === 0) {
    return { ok: false, error: "Invalid qr_code_title" };
  }
  if (!props.short_url || props.short_url.trim().length === 0) {
    return { ok: false, error: "Invalid short_url" };
  }
  if (
    !props.customization_options ||
    typeof props.customization_options !== "object"
  ) {
    return { ok: false, error: "Invalid customization_options" };
  }
  return { ok: true };
};

/**
 * Sanitize common QR event properties (truncate strings and stringify complex fields)
 */
export const sanitizeCommonQrEventProps = (props: QrCodeCommonProperties) => {
  return {
    ...props,
    qr_code_title: props.qr_code_title?.substring(0, 100),
    short_url: props.short_url?.substring(0, 200),
    customization_options: JSON.stringify(props.customization_options),
  };
};
