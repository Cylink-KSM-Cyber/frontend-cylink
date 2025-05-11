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

  console.log(`Making server-side GET request to: ${fullUrl}`);

  // Prepare headers - include auth token if available
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    console.log("Including authorization token in request");
  } else {
    console.log("No authorization token available for request");
  }

  try {
    // Make a direct fetch call instead of using axios instance
    const response = await fetch(fullUrl, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);

      // Try making the request without authentication as fallback
      if (response.status === 401 && token) {
        console.log("Trying public API endpoint without authentication");
        return serverSideApiGet<T>(url);
      }

      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log(`API Response data:`, data);
    return data as T;
  } catch (error) {
    console.error(`Server-side GET request failed:`, error);
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
    console.log(`Fetching original URL for short code: ${shortCode}`);

    // Create API URL with the correct endpoint structure
    const apiUrl = `/api/v1/urls/${shortCode}`;
    console.log(`API URL: ${apiUrl}`);

    // Try with public URL endpoint first (no authentication)
    try {
      console.log("Attempting to fetch URL with public endpoint");
      // This endpoint might be public in production
      const publicApiUrl = `/api/v1/public/urls/${shortCode}`;
      const response = await serverSideApiGet<ShortUrlResponse>(publicApiUrl);

      // Process response
      const originalUrl = extractOriginalUrl(response);
      if (originalUrl) {
        return originalUrl;
      }
    } catch (error) {
      console.log(
        "Public endpoint failed, trying authenticated endpoint:",
        error
      );
    }

    // Fall back to authenticated endpoint
    const response = await serverSideApiGet<ShortUrlResponse>(apiUrl, token);

    // Extract the original URL from the response
    const originalUrl = extractOriginalUrl(response);

    if (originalUrl) {
      // Attempt to record the click asynchronously
      recordUrlClick(shortCode, token).catch((err) => {
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
    console.log(`Successfully recorded click for ${shortCode}`);
  } catch (error) {
    console.error(`Failed to record click for ${shortCode}:`, error);
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
  // Enhanced logging - show full URL and details
  console.log("==================== MIDDLEWARE EXECUTING ====================");
  console.log(`Full URL: ${request.url}`);
  console.log(`Method: ${request.method}`);
  console.log(`Pathname: ${request.nextUrl.pathname}`);
  console.log(`Search params: ${request.nextUrl.search}`);
  console.log(
    `Headers: ${JSON.stringify(
      Object.fromEntries(request.headers.entries()),
      null,
      2
    )}`
  );

  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Debug: Print out the result of the path check
  const pathCheckResult = isShortUrlPath(pathname);
  console.log(`Is ${pathname} a short URL path? ${pathCheckResult}`);

  // Check if this is a short URL request
  if (pathCheckResult) {
    // Extract the short code from the pathname (remove leading slash)
    const shortCode = pathname.substring(1);
    console.log(`Short URL detected, code: ${shortCode}`);

    // Check for known URLs first (development/testing fallback)
    if (shortCode in KNOWN_URLS) {
      const originalUrl = KNOWN_URLS[shortCode];
      console.log(`[KNOWN URL] Redirecting to: ${originalUrl}`);
      return NextResponse.redirect(originalUrl);
    }

    // Make API request to get the original URL using the new endpoint structure
    return getOriginalUrlByIdentifier(shortCode, accessToken)
      .then((originalUrl: string | null) => {
        if (originalUrl) {
          console.log(`[SUCCESS] Redirecting to original URL: ${originalUrl}`);
          return NextResponse.redirect(originalUrl);
        }

        console.log(
          `[NOT FOUND] No original URL found for short code: ${shortCode}`
        );
        return NextResponse.next();
      })
      .catch((error: Error) => {
        console.error(`[ERROR] Error handling short URL ${shortCode}:`, error);
        return NextResponse.next();
      });
  }

  // Handle protected routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
    console.log(`Protected route detected: ${pathname}`);
    if (!accessToken) {
      console.log(`Access denied: No token found for ${pathname}`);
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
