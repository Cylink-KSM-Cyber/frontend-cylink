/**
 * URL Deletion Method Type
 *
 * Defines the methods by which URLs can be deleted in the system. Ensures consistency in tracking how URLs are removed.
 *
 * @module src/types/conversionTrackings/UrlDeletionMethod
 */

export type UrlDeletionMethod = "manual" | "bulk_delete" | "api" | "expired";

/**
 * Type guard to check if a value is a valid UrlDeletionMethod
 * @param value - Value to check
 * @returns True if value is a valid UrlDeletionMethod
 */
export const isUrlDeletionMethod = (
  value: unknown
): value is UrlDeletionMethod => {
  const validMethods: UrlDeletionMethod[] = [
    "manual",
    "bulk_delete",
    "api",
    "expired",
  ];
  return (
    typeof value === "string" &&
    validMethods.includes(value as UrlDeletionMethod)
  );
};
