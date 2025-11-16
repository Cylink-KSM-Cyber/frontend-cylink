import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isShortUrlPath } from "@/utils/shortUrlUtils";
import logger from "@/utils/logger";
import { isFeatureEnabledServer } from "@/utils/posthogServer";
import { FEATURE_FLAG_INTERSTITIAL } from "@/constants/featureFlags";

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
 * Direct API call for server-side context
 * This bypasses the client-side interceptors and handles auth directly
 * @param url The full URL to call
 * @param token Optional authorization token
 */
async function serverSideApiGet<T>(url: string, token?: string): Promise<T> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_API_URL || "https://dev.api.cylink.id";
  const fullUrl = `${baseUrl}${url}`;

  // Prepare headers - include auth token if available
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    // Make a direct fetch call instead of using axios instance
    const response = await fetch(fullUrl, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      // Try making the request without authentication as fallback
      if (response.status === 401 && token) {
        logger.urlShortener.warn(
          `Authentication failed, retrying without token: ${url}`
        );
        return serverSideApiGet<T>(url);
      }

      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    logger.urlShortener.error(`API request failed: ${url}`, error);
    throw error;
  }
}

/**
 * Direct API call for server-side context without authentication
 * This is specifically for public endpoints that should not include auth headers
 * @param url The full URL to call
 */
async function serverSideApiGetPublic<T>(url: string): Promise<T> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_API_URL || "https://dev.api.cylink.id";
  const fullUrl = `${baseUrl}${url}`;

  // Prepare headers without auth token
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  try {
    logger.urlShortener.debug(`Making public API request: ${url}`);
    // Make a direct fetch call without auth header
    const response = await fetch(fullUrl, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `Public API request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    logger.urlShortener.debug(`Public API response received`);
    return data as T;
  } catch (error) {
    logger.urlShortener.error(`Public API request failed: ${url}`, error);
    throw error;
  }
}

/**
 * Fetch the original URL for a short code using the correct API endpoint
 * @param shortCode The short code to lookup
 * @param token Authorization token if available
 * @returns Promise resolving to the original URL or null if not found
 */
async function getOriginalUrlByIdentifier(
  shortCode: string,
  token?: string
): Promise<string | null> {
  try {
    // Try with public URL endpoint first (no authentication)
    try {
      // This is the public endpoint that doesn't require authentication
      const publicApiUrl = `/api/v1/public/urls/${shortCode}`;
      logger.urlShortener.info(
        `Resolving short URL: ${shortCode} (public endpoint)`
      );

      // Use the public API get function without auth headers
      const response = await serverSideApiGetPublic<ShortUrlResponse>(
        publicApiUrl
      );

      // Process response
      const originalUrl = extractOriginalUrl(response);
      if (originalUrl) {
        logger.urlShortener.info(
          `Short URL resolved: ${shortCode} → ${originalUrl.substring(0, 50)}${
            originalUrl.length > 50 ? "..." : ""
          }`
        );

        // Attempt to record the click asynchronously
        recordUrlClick(shortCode, token).catch(() => {
          // Don't throw - we don't want to block the main redirect flow
          logger.urlShortener.warn(`Failed to record click: ${shortCode}`);
        });

        return originalUrl;
      }
    } catch (error) {
      // Check if the error is a 404 (not found)
      const is404Error =
        error instanceof Error && error.message.includes("404");

      if (is404Error) {
        // If it's a 404, the URL simply doesn't exist, so don't try other endpoints
        logger.urlShortener.info(`Short URL not found: ${shortCode}`);
        return null;
      }

      // For other errors (network issues, etc.), log and try authenticated endpoint if token exists
      logger.urlShortener.warn(
        `Public endpoint error for ${shortCode}, trying authenticated endpoint`,
        error
      );
    }

    // Only proceed with authenticated endpoint if we have a token
    if (token) {
      logger.urlShortener.debug(`Trying authenticated endpoint: ${shortCode}`);
      const apiUrl = `/api/v1/urls/${shortCode}`;
      const response = await serverSideApiGet<ShortUrlResponse>(apiUrl, token);

      // Extract the original URL from the response
      const originalUrl = extractOriginalUrl(response);

      if (originalUrl) {
        logger.urlShortener.info(`Short URL resolved via auth: ${shortCode}`);
        // Attempt to record the click asynchronously
        recordUrlClick(shortCode, token).catch(() => {
          // Don't throw - we don't want to block the main redirect flow
          logger.urlShortener.warn(`Failed to record click: ${shortCode}`);
        });

        return originalUrl;
      }
    } else {
      logger.urlShortener.debug(
        `No authentication token available for ${shortCode}`
      );
    }

    return null;
  } catch (error) {
    logger.urlShortener.error(`URL resolution failed: ${shortCode}`, error);
    return null;
  }
}

/**
 * Extract original URL from API response
 */
function extractOriginalUrl(response: ShortUrlResponse): string | null {
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
 * @param token Authorization token if available
 */
async function recordUrlClick(
  shortCode: string,
  token?: string
): Promise<void> {
  try {
    const endpoint = `/api/v1/urls/click/${shortCode}`;
    await serverSideApiGet(endpoint, token);
    logger.urlShortener.debug(`Click recorded: ${shortCode}`);

    // Note: PostHog tracking is handled client-side in shortUrlUtils.ts
    // Server-side middleware cannot access browser APIs for PostHog tracking
  } catch {
    // Don't throw - we don't want to block the main redirect flow
    logger.urlShortener.warn(`Failed to record click: ${shortCode}`);
  }
}

/**
 * Middleware function for handling authentication and route protection
 * Also handles short URL redirects with feature flag support
 */
export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Check if this is a short URL request
  if (isShortUrlPath(pathname)) {
    const shortCode = pathname.substring(1);

    // Get or generate a distinct ID for feature flag evaluation
    // Try to use user ID from token, otherwise use a combination of IP and user agent
    let distinctId = request.cookies.get("ph_distinct_id")?.value;

    if (!distinctId) {
      // Generate a simple distinct ID based on request characteristics
      const ip =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown";
      const userAgent = request.headers.get("user-agent") || "unknown";
      distinctId = `anonymous_${Buffer.from(`${ip}-${userAgent}`)
        .toString("base64")
        .substring(0, 20)}`;
    }

    // Check if interstitial feature flag is enabled
    const isInterstitialEnabled = await isFeatureEnabledServer(
      FEATURE_FLAG_INTERSTITIAL,
      distinctId
    );

    if (isInterstitialEnabled) {
      // Feature flag is enabled - pass to interstitial page
      logger.urlShortener.info(
        `Short URL detected: ${shortCode} - interstitial enabled, passing to interstitial page`
      );
      return NextResponse.next();
    } else {
      // Feature flag is disabled - redirect directly to original URL (old behavior)
      logger.urlShortener.info(
        `Short URL detected: ${shortCode} - interstitial disabled, attempting direct redirect`
      );

      // Try to get original URL and redirect directly
      const originalUrl = await getOriginalUrlByIdentifier(
        shortCode,
        accessToken
      );

      if (originalUrl) {
        logger.urlShortener.info(
          `Direct redirect: ${shortCode} → ${originalUrl.substring(0, 50)}${
            originalUrl.length > 50 ? "..." : ""
          }`
        );
        return NextResponse.redirect(originalUrl);
      } else {
        // If we can't get the URL, pass to the page to show error
        logger.urlShortener.warn(
          `Failed to resolve short URL: ${shortCode} - passing to page for error handling`
        );
        return NextResponse.next();
      }
    }
  }

  // Handle protected routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
    if (!accessToken) {
      logger.info(
        `Redirecting unauthenticated user to login from: ${pathname}`
      );
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Configuration for which routes the middleware applies to
 * We need to explicitly include all paths and only exclude specific static file patterns
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - API routes (/api/)
     * - Static files in _next
     * - Static image files
     * - favicon.ico
     * - Files with common static file extensions
     */
    "/((?!api/|_next/static|_next/image|favicon\\.ico).*)",
  ],
};
