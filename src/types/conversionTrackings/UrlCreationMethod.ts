/**
 * URL Creation Method Type
 *
 * Defines the methods by which URLs can be created in the system. Ensures consistency in tracking how URLs are generated.
 *
 * @module src/types/conversionTrackings/UrlCreationMethod
 */

export type UrlCreationMethod =
  | "manual"
  | "qr_code_flow"
  | "api"
  | "bulk_import";

/**
 * Type guard to check if a value is a valid UrlCreationMethod
 * @param value - Value to check
 * @returns True if value is a valid UrlCreationMethod
 */
export const isUrlCreationMethod = (
  value: unknown
): value is UrlCreationMethod => {
  const validMethods: UrlCreationMethod[] = [
    "manual",
    "qr_code_flow",
    "api",
    "bulk_import",
  ];
  return (
    typeof value === "string" &&
    validMethods.includes(value as UrlCreationMethod)
  );
};
