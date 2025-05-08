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
 * Log detailed information about URL formatting for debugging
 *
 * @param component Component name for logging context
 * @param shortUrl Original short URL
 * @param formattedUrl Formatted URL
 */
export function logUrlFormatting(
  component: string,
  shortUrl: string,
  formattedUrl: string
): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`[${component}] URL Formatting:`, {
      originalUrl: shortUrl,
      formattedUrl: formattedUrl,
      baseUrl: process.env.NEXT_PUBLIC_APP_URL || "https://cylink.id",
    });
  }
}
