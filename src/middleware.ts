import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isShortUrlPath } from "@/utils/shortUrlUtils";

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
        return serverSideApiGet<T>(url);
      }

      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`[ShortURL] API request failed: ${url}`, error);
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
      // This endpoint might be public in production
      const publicApiUrl = `/api/v1/public/urls/${shortCode}`;
      const response = await serverSideApiGet<ShortUrlResponse>(publicApiUrl);

      // Process response
      const originalUrl = extractOriginalUrl(response);
      if (originalUrl) {
        return originalUrl;
      }
    } catch {
      // Public endpoint failed, trying authenticated endpoint
    }

    // Fall back to authenticated endpoint
    const apiUrl = `/api/v1/urls/${shortCode}`;
    const response = await serverSideApiGet<ShortUrlResponse>(apiUrl, token);

    // Extract the original URL from the response
    const originalUrl = extractOriginalUrl(response);

    if (originalUrl) {
      // Attempt to record the click asynchronously
      recordUrlClick(shortCode, token).catch(() => {
        // Don't throw - we don't want to block the main redirect flow
      });

      return originalUrl;
    }

    return null;
  } catch (error) {
    console.error(`[ShortURL] Resolution failed: ${shortCode}`, error);
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
  } catch {
    // Don't throw - we don't want to block the main redirect flow
  }
}

/**
 * Special case handling for known short URLs
 * This is a fallback for development/testing environments
 */
const KNOWN_URLS: Record<string, string> = {
  // Add test/development short codes here
  repocylink: "https://github.com/yourusername/cylink",
  testshort: "https://example.com/test-page",
  docs: "https://example.com/documentation",
  dashboard: "https://example.com/dashboard",
};

/**
 * Middleware function for handling authentication and route protection
 * Also handles short URL redirects
 */
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Check if this is a short URL request
  if (isShortUrlPath(pathname)) {
    // Extract the short code from the pathname (remove leading slash)
    const shortCode = pathname.substring(1);

    // Check for known URLs first (development/testing fallback)
    if (shortCode in KNOWN_URLS) {
      const originalUrl = KNOWN_URLS[shortCode];
      return NextResponse.redirect(originalUrl);
    }

    // Make API request to get the original URL
    return getOriginalUrlByIdentifier(shortCode, accessToken)
      .then((originalUrl: string | null) => {
        if (originalUrl) {
          return NextResponse.redirect(originalUrl);
        }
        return NextResponse.next();
      })
      .catch(() => {
        return NextResponse.next();
      });
  }

  // Handle protected routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
    if (!accessToken) {
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
