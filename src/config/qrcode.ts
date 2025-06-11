/**
 * QR Code Configuration
 * @description Centralized configuration for QR code generation feature
 */

/**
 * QR Code size options with labels and descriptions
 */
export const QR_SIZE_OPTIONS = [
  {
    value: 200,
    label: "Small",
    size: "200×200px",
    description: "Perfect for business cards",
  },
  {
    value: 280,
    label: "Medium",
    size: "280×280px",
    description: "Standard size for most uses",
  },
  {
    value: 400,
    label: "Large",
    size: "400×400px",
    description: "High visibility displays",
  },
] as const;

/**
 * Default QR code colors
 */
export const DEFAULT_QR_COLORS = {
  foreground: "#000000", // Black
  background: "#FFFFFF", // White
} as const;

/**
 * Preset foreground color options for easy selection
 */
export const PRESET_FOREGROUND_COLORS = [
  { hex: "#000000", name: "Black" },
  { hex: "#1F2937", name: "Dark Gray" },
  { hex: "#3B82F6", name: "Blue" },
  { hex: "#EF4444", name: "Red" },
  { hex: "#10B981", name: "Green" },
  { hex: "#8B5CF6", name: "Purple" },
] as const;

/**
 * Preset background color options for easy selection
 */
export const PRESET_BACKGROUND_COLORS = [
  { hex: "#FFFFFF", name: "White" },
  { hex: "#F9FAFB", name: "Light Gray" },
  { hex: "#EBF8FF", name: "Light Blue" },
  { hex: "#FEF2F2", name: "Light Red" },
  { hex: "#ECFDF5", name: "Light Green" },
  { hex: "#FAF5FF", name: "Light Purple" },
] as const;

/**
 * Error correction levels for QR codes
 */
export const ERROR_CORRECTION_LEVELS = {
  L: {
    value: "L",
    label: "Low",
    percentage: "7%",
    description: "Can sustain up to 7% damage",
  },
  M: {
    value: "M",
    label: "Medium",
    percentage: "15%",
    description: "Can sustain up to 15% damage",
  },
  Q: {
    value: "Q",
    label: "Quartile",
    percentage: "25%",
    description: "Can sustain up to 25% damage",
  },
  H: {
    value: "H",
    label: "High",
    percentage: "30%",
    description: "Can sustain up to 30% damage",
  },
} as const;

/**
 * Default error correction level (Medium 15% - smart default)
 */
export const DEFAULT_ERROR_CORRECTION_LEVEL = "M" as const;

/**
 * Logo size constraints
 */
export const LOGO_SIZE_CONFIG = {
  min: 0.1, // 10%
  max: 0.4, // 40%
  default: 0.25, // 25%
  step: 0.05, // 5%
} as const;

/**
 * Default expiry days for new URLs
 */
export const DEFAULT_URL_EXPIRY_DAYS = 30;

/**
 * Recent URLs display limit
 */
export const RECENT_URLS_LIMIT = 6;

/**
 * Popular URLs display limit
 */
export const POPULAR_URLS_LIMIT = 4;

/**
 * Recent searches tracking limit
 */
export const RECENT_SEARCHES_LIMIT = 5;

/**
 * Minimum search term length for tracking
 */
export const MIN_SEARCH_TERM_LENGTH = 2;

/**
 * QR code creation steps configuration
 */
export const QR_CREATION_STEPS = [
  { id: 1, name: "Select URL", description: "Choose or create a URL" },
  { id: 2, name: "Customize", description: "Customize QR code appearance" },
] as const;

/**
 * Animation durations for UI transitions
 */
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 200,
  slow: 300,
} as const;

/**
 * Popular URL categories for new users
 */
export const POPULAR_URL_CATEGORIES = [
  "Social media profiles",
  "Business websites",
  "Portfolio links",
  "Contact information",
] as const;

/**
 * QR code file formats
 */
export const QR_FILE_FORMATS = [
  { value: "png", label: "PNG", description: "Best for web and digital use" },
  { value: "svg", label: "SVG", description: "Vector format, scalable" },
] as const;

/**
 * Type definitions for configuration values
 */
export type QrSizeOption = (typeof QR_SIZE_OPTIONS)[number];
export type PresetColor = (typeof PRESET_FOREGROUND_COLORS)[number];
export type ErrorCorrectionLevel = keyof typeof ERROR_CORRECTION_LEVELS;
export type QrCreationStep = (typeof QR_CREATION_STEPS)[number];
export type QrFileFormat = (typeof QR_FILE_FORMATS)[number];
