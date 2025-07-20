/**
 * URL Edit Method Type
 *
 * Defines the methods by which URLs can be edited in the system. Ensures consistency in tracking how URLs are modified.
 *
 * @module src/types/conversionTrackings/UrlEditMethod
 */

export type UrlEditMethod = "manual" | "bulk_edit" | "api";

/**
 * Type guard to check if a value is a valid UrlEditMethod
 * @param value - Value to check
 * @returns True if value is a valid UrlEditMethod
 */
export const isUrlEditMethod = (value: unknown): value is UrlEditMethod => {
  const validMethods: UrlEditMethod[] = ["manual", "bulk_edit", "api"];
  return (
    typeof value === "string" && validMethods.includes(value as UrlEditMethod)
  );
};
