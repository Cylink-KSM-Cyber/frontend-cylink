import { z } from "zod";
import { DEFAULT_URL_EXPIRY_DAYS } from "@/config/qrcode";
import { URL_CUSTOM_CODE_LIMITS } from "@/config/urlLimits";

/**
 * QR Code Validation Utilities
 * @description Centralized validation logic for QR code creation
 */

/**
 * URL source type definition
 */
export type UrlSource = "existing" | "new";

/**
 * Form data interface for QR code creation
 */
export interface QrCodeFormData {
  urlSource: UrlSource;
  existingUrlId: number | string | null | undefined;
  title?: string;
  originalUrl?: string;
  customCode?: string;
  expiryDate?: string;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Base schema for URL validation
 */
const urlSchema = z.string().url("Please enter a valid URL");

/**
 * Title validation schema
 */
const titleSchema = z
  .string()
  .min(1, "Title is required")
  .max(100, "Title must be less than 100 characters");

/**
 * Custom code validation schema
 */
const customCodeSchema = z
  .string()
  .optional()
  .refine((code) => {
    if (!code) return true; // Optional field
    return /^[a-zA-Z0-9-_]+$/.test(code);
  }, "Custom code can only contain letters, numbers, hyphens, and underscores")
  .refine((code) => {
    if (!code) return true; // Optional field
    return code.length <= URL_CUSTOM_CODE_LIMITS.MAX_LENGTH;
  }, "Custom code must be 30 characters or less");

/**
 * Expiry date validation schema
 */
const expiryDateSchema = z
  .string()
  .min(1, "Expiry date is required")
  .refine((date) => {
    const expiryDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    return expiryDate >= today;
  }, "Expiry date must be today or in the future");

/**
 * Zod schema for QR code creation form validation
 */
export const qrCodeCreateSchema = z
  .object({
    urlSource: z.enum(["existing", "new"]),
    existingUrlId: z.union([z.number(), z.string()]).optional().nullable(),
    title: titleSchema.optional(),
    originalUrl: urlSchema.optional(),
    customCode: customCodeSchema,
    expiryDate: expiryDateSchema.optional(),
  })
  .refine(
    (data) => {
      // If using existing URL, validate existingUrlId
      if (data.urlSource === "existing") {
        return (
          data.existingUrlId !== null &&
          data.existingUrlId !== undefined &&
          data.existingUrlId !== ""
        );
      }

      // If creating new URL, validate required fields
      if (data.urlSource === "new") {
        return !!data.title && !!data.originalUrl && !!data.expiryDate;
      }

      return false;
    },
    {
      message: "Please complete all required fields",
      path: ["urlSource"],
    }
  );

/**
 * Validate existing URL selection
 */
export const validateExistingUrlSelection = (
  urlId: number | string | null | undefined
): ValidationResult => {
  const isValid = urlId !== null && urlId !== undefined && urlId !== "";

  return {
    isValid,
    errors: isValid ? {} : { existingUrlId: "Please select a URL" },
  };
};

/**
 * Validate new URL creation data
 */
export const validateNewUrlData = (data: {
  title?: string;
  originalUrl?: string;
  expiryDate?: string;
  customCode?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  // Validate title
  const titleResult = titleSchema.safeParse(data.title);
  if (!titleResult.success) {
    errors.title = titleResult.error.errors[0]?.message || "Invalid title";
  }

  // Validate original URL
  const urlResult = urlSchema.safeParse(data.originalUrl);
  if (!urlResult.success) {
    errors.originalUrl = urlResult.error.errors[0]?.message || "Invalid URL";
  }

  // Validate expiry date
  const expiryResult = expiryDateSchema.safeParse(data.expiryDate);
  if (!expiryResult.success) {
    errors.expiryDate =
      expiryResult.error.errors[0]?.message || "Invalid expiry date";
  }

  // Validate custom code (optional)
  if (data.customCode) {
    const customCodeResult = customCodeSchema.safeParse(data.customCode);
    if (!customCodeResult.success) {
      errors.customCode =
        customCodeResult.error.errors[0]?.message || "Invalid custom code";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate QR code customization options
 */
export const validateQrCustomization = (customization: {
  foregroundColor?: string;
  backgroundColor?: string;
  logoSize?: number;
  qrSize?: number;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  // Validate colors are hex format
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  if (
    customization.foregroundColor &&
    !hexColorRegex.test(customization.foregroundColor)
  ) {
    errors.foregroundColor = "Invalid color format";
  }

  if (
    customization.backgroundColor &&
    !hexColorRegex.test(customization.backgroundColor)
  ) {
    errors.backgroundColor = "Invalid color format";
  }

  // Validate logo size (0.1 to 0.4)
  if (customization.logoSize !== undefined) {
    if (customization.logoSize < 0.1 || customization.logoSize > 0.4) {
      errors.logoSize = "Logo size must be between 10% and 40%";
    }
  }

  // Validate QR size
  if (customization.qrSize !== undefined) {
    const validSizes = [200, 280, 400];
    if (!validSizes.includes(customization.qrSize)) {
      errors.qrSize = "Invalid QR code size";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Get default expiry date (30 days from now)
 */
export const getDefaultExpiryDate = (): string => {
  const defaultExpiryDate = new Date();
  defaultExpiryDate.setDate(
    defaultExpiryDate.getDate() + DEFAULT_URL_EXPIRY_DAYS
  );
  return defaultExpiryDate.toISOString().split("T")[0];
};

/**
 * Check if URL search term is meaningful for tracking
 */
export const isMeaningfulSearchTerm = (
  term: string,
  minLength: number = 2
): boolean => {
  return term.trim().length > minLength;
};

/**
 * Validate search query
 */
export const validateSearchQuery = (query: string): ValidationResult => {
  const trimmedQuery = query.trim();

  return {
    isValid: trimmedQuery.length >= 1,
    errors:
      trimmedQuery.length < 1 ? { search: "Search query cannot be empty" } : {},
  };
};

/**
 * Type definition for form schema
 */
export type QrCodeCreateFormSchema = z.infer<typeof qrCodeCreateSchema>;
