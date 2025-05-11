/**
 * Utility functions for handling short URLs
 */

import { get, getPublic } from "@/services/api";
import { AxiosError } from "axios";
import logger from "@/utils/logger";

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
  "logo",
  // Common files
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
];

// File extensions to exclude (these are likely static files, not short URLs)
const FILE_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "webp",
  "ico",
  "css",
  "js",
  "json",
  "map",
  "ttf",
  "woff",
  "woff2",
  "html",
  "htm",
  "xml",
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
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

  // Empty path is not a short URL (root path)
  if (!path) {
    logger.urlShortener.debug("Empty path detected, not a short URL");
    return false;
  }

  logger.urlShortener.debug(`Checking if path is a short URL: ${path}`);

  // Check if it's one of our known routes or nested routes
  for (const route of KNOWN_ROUTES) {
    if (path === route || path.startsWith(`${route}/`)) {
      logger.urlShortener.debug(
        `Path matches known route '${route}', not a short URL`
      );
      return false;
    }
  }

  // Check if it has a file extension - first with simple dot check
  if (path.includes(".")) {
    // Extract the extension
    const extension = path.split(".").pop()?.toLowerCase();

    // If it has a known file extension, it's not a short URL
    if (extension && FILE_EXTENSIONS.includes(extension)) {
      logger.urlShortener.debug(
        `Path has file extension '${extension}', not a short URL`
      );
      return false;
    }
  }

  // If it has more than one slash, it's likely a nested route, not a short URL
  if (path.includes("/")) {
    logger.urlShortener.debug(
      `Path contains slashes, likely a nested route, not a short URL`
    );
    return false;
  }

  // If it passes all exclusions, it's likely a short URL path
  logger.urlShortener.debug(`Path is likely a short URL: ${path}`);
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
    logger.urlShortener.info(`Fetching URL for short code: ${shortCode}`);

    // Try the public endpoint first (no authentication required)
    try {
      const publicApiUrl = `/api/v1/public/urls/${shortCode}`;
      logger.urlShortener.debug(`Trying public API endpoint: ${publicApiUrl}`);

      // Use getPublic to ensure no authentication headers are sent
      const publicResponse = await getPublic<ShortUrlResponse>(publicApiUrl);

      const originalUrl = extractOriginalUrlFromResponse(publicResponse);
      if (originalUrl) {
        logger.urlShortener.info(
          `Found URL from public endpoint: ${shortCode} → ${originalUrl.substring(
            0,
            50
          )}${originalUrl.length > 50 ? "..." : ""}`
        );

        // Record the click asynchronously
        recordUrlClick(shortCode).catch((err) => {
          logger.urlShortener.warn(
            `Failed to record click for ${shortCode}`,
            err
          );
        });

        return originalUrl;
      }
    } catch (error) {
      // Check if the error is a 404 (URL not found)
      const is404Error =
        // Check if it's an Axios error with status 404
        (error instanceof Error &&
          error instanceof AxiosError &&
          error.response?.status === 404) ||
        // Or check message content for other error types
        (error instanceof Error && error.message.includes("404"));

      if (is404Error) {
        // If it's a 404, don't try the authenticated endpoint
        logger.urlShortener.info(`Short URL not found: ${shortCode}`);
        return null;
      }

      logger.urlShortener.warn(
        `Public endpoint error for ${shortCode}, falling back to authenticated endpoint`,
        error
      );
    }

    // Fall back to authenticated endpoint only for non-404 errors
    const apiUrl = `/api/v1/urls/${shortCode}`;
    logger.urlShortener.debug(`Trying authenticated endpoint: ${apiUrl}`);

    // Make the API request
    const response = await get<ShortUrlResponse>(apiUrl);

    // Extract the original URL from the response
    const originalUrl = extractOriginalUrlFromResponse(response);

    if (originalUrl) {
      logger.urlShortener.info(
        `Found URL from authenticated endpoint: ${shortCode}`
      );
      // Record the click asynchronously
      recordUrlClick(shortCode).catch((err) => {
        logger.urlShortener.warn(
          `Failed to record click for ${shortCode}`,
          err
        );
      });

      return originalUrl;
    }

    logger.urlShortener.info(
      `No original URL found for short code: ${shortCode}`
    );
    return null;
  } catch (error) {
    logger.urlShortener.error(
      `Error fetching URL for short code: ${shortCode}`,
      error
    );
    return null;
  }
}

/**
 * Extract original URL from API response
 * @param response The API response object
 * @returns The original URL or null if not found
 */
function extractOriginalUrlFromResponse(
  response: ShortUrlResponse
): string | null {
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

  return originalUrl;
}

/**
 * Record a click on a short URL
 * @param shortCode The short code that was clicked
 */
async function recordUrlClick(shortCode: string): Promise<void> {
  try {
    const endpoint = `/api/v1/urls/click/${shortCode}`;
    await get(endpoint);
    logger.urlShortener.debug(`Click recorded for ${shortCode}`);
  } catch (error) {
    logger.urlShortener.warn(`Failed to record click for ${shortCode}`, error);
    // Don't throw - we don't want to block the main redirect flow
  }
}
