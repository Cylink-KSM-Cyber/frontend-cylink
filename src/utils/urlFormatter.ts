/**
 * Formats a URL ensuring it has the correct protocol and base domain
 * Prevents the double https:// issue
 *
 * @param shortUrl The short URL to format
 * @returns Properly formatted full URL
 */
export function formatShortUrl(shortUrl: string): string {
  // Get the base app URL from environment or default to production URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cylink.id";

  // Check if shortUrl already contains http/https protocol
  const hasProtocol =
    shortUrl.startsWith("http://") || shortUrl.startsWith("https://");

  // Format the full URL properly
  let fullUrl = "";
  if (hasProtocol) {
    // URL already has protocol, use as-is
    fullUrl = shortUrl;
  } else if (shortUrl.includes("cylink.id/")) {
    // If it already has the domain but no protocol
    fullUrl = `https://${shortUrl}`;
  } else {
    // Just the path or code - construct with environment base URL
    // Remove any leading slashes to avoid double slashes
    const cleanPath = shortUrl.replace(/^\/+/, "");
    fullUrl = `${baseUrl}/${cleanPath}`;
  }

  return fullUrl;
}

/**
 * Truncates long URLs to improve UI readability and prevent overflow
 * Handles edge cases like invalid inputs, protocol preservation, and unicode characters
 *
 * @param url The URL to truncate
 * @param maxLength Maximum number of characters to display (default: 45)
 * @returns Truncated URL with ellipsis if longer than maxLength
 */
export function truncateUrl(url: string, maxLength: number = 45): string {
  // Type and input validation
  if (!url || typeof url !== "string") return "";

  // Normalize maxLength to prevent edge cases
  // First: Reset invalid inputs to default
  if (!Number.isFinite(maxLength) || maxLength < 0) maxLength = 45; // Reset to default
  // Then: Enforce minimum length for valid inputs
  if (maxLength < 4) maxLength = 4; // Minimum for "a..."

  // Handle very short URLs that don't need truncation
  if (url.length <= maxLength) return url;

  // Smart truncation - preserve protocol when possible
  if (
    maxLength > 10 &&
    (url.startsWith("http://") || url.startsWith("https://"))
  ) {
    const protocolEnd = url.indexOf("://") + 3;
    if (protocolEnd > 0 && protocolEnd < maxLength - 3) {
      // Ensure we keep protocol intact and have meaningful content after
      const availableLength = maxLength - 3; // Reserve 3 chars for "..."
      const minContentAfterProtocol = Math.min(
        5,
        availableLength - protocolEnd
      );

      if (protocolEnd + minContentAfterProtocol <= availableLength) {
        return url.substring(0, availableLength) + "...";
      }
    }
  }

  // Standard truncation with safe substring
  try {
    return url.substring(0, Math.max(1, maxLength - 3)) + "...";
  } catch {
    // Fallback for any unexpected string issues
    return url.slice(0, Math.max(1, maxLength - 3)) + "...";
  }
}
