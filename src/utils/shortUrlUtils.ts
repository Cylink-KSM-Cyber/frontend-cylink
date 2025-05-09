/**
 * Utility functions for handling short URLs
 */

import { get } from "@/services/api";

// Define known routes to exclude from short URL detection
const KNOWN_ROUTES = [
  // App routes
  "dashboard",
  "login",
  "register",
  "settings",
  "profile",
  // Asset directories
  "api",
  "_next",
  "images",
  "assets",
  "static",
  // Common files
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
];

/**
 * Check if a pathname is likely a short URL path
 * Uses a smarter approach than simple regex to identify short URLs:
 * 1. Excludes known routes
 * 2. Handles various formats of short codes (not just alphanumeric with fixed length)
 *
 * @param pathname The pathname to check (with leading slash)
 * @returns True if the pathname is likely a short URL path
 */
export function isShortUrlPath(pathname: string): boolean {
  // Remove leading slash for easier processing
  const path = pathname.startsWith("/") ? pathname.substring(1) : pathname;

  // Empty path is not a short URL
  if (!path) return false;

  // Check if it's one of our known routes or nested routes
  for (const route of KNOWN_ROUTES) {
    if (path === route || path.startsWith(`${route}/`)) {
      return false;
    }
  }

  // Check for file extensions (likely not a short URL if it has a file extension)
  if (/\.\w{2,4}$/.test(path)) {
    return false;
  }

  // If it passes all exclusions, it's likely a short URL path
  // This approach considers any unrecognized path as a potential short URL
  return true;
}

/**
 * API response interface for short URL lookup
 */
interface ShortUrlResponse {
  status?: number;
  message?: string;
  data?: {
    original_url?: string;
    [key: string]: unknown;
  };
  original_url?: string;
  [key: string]: unknown;
}

/**
 * Fetch the original URL for a short code
 * Makes a direct API call to get the redirect information
 *
 * @param shortCode The short code to lookup
 * @returns Promise resolving to the original URL or null if not found
 */
export async function getOriginalUrlByShortCode(
  shortCode: string
): Promise<string | null> {
  try {
    console.log(`Fetching original URL for short code: ${shortCode}`);

    // Create API URL for fetching the original URL
    const apiUrl = `/api/v1/urls/by-code/${shortCode}`;
    console.log(`API URL: ${apiUrl}`);

    // Make the API request
    const response = await get<ShortUrlResponse>(apiUrl);
    console.log(`API Response:`, response);

    // Extract the original URL from various possible response structures
    let originalUrl: string | null = null;

    if (response && typeof response === "object") {
      // Direct response contains original_url
      if (
        "original_url" in response &&
        typeof response.original_url === "string"
      ) {
        originalUrl = response.original_url;
      }
      // Response has data property with original_url
      else if (
        "data" in response &&
        response.data &&
        typeof response.data === "object"
      ) {
        const data = response.data;
        if ("original_url" in data && typeof data.original_url === "string") {
          originalUrl = data.original_url;
        }
      }
    }

    if (originalUrl) {
      // Record the click asynchronously
      recordUrlClick(shortCode).catch((err) => {
        console.error(`Failed to record click for ${shortCode}:`, err);
      });

      return originalUrl;
    }

    console.warn(`No original URL found for short code: ${shortCode}`);
    return null;
  } catch (error) {
    console.error(`Error fetching original URL for ${shortCode}:`, error);
    return null;
  }
}

/**
 * Record a click on a short URL
 * @param shortCode The short code that was clicked
 */
async function recordUrlClick(shortCode: string): Promise<void> {
  try {
    const endpoint = `/api/v1/urls/click/${shortCode}`;
    await get(endpoint);
    console.log(`Successfully recorded click for ${shortCode}`);
  } catch (error) {
    console.error(`Failed to record click for ${shortCode}:`, error);
    // Don't throw - we don't want to block the main redirect flow
  }
}
