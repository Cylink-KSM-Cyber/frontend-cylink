import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isShortUrlPath } from "@/utils/shortUrlUtils";
import logger from "@/utils/logger";

/**
 * Middleware function for handling authentication and route protection
 * Also handles short URL redirects
 *
 * Note: Feature flag evaluation is handled client-side in InterstitialPage
 * because Next.js Edge Runtime (where middleware runs) doesn't support
 * Node.js APIs required by posthog-node.
 */
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Check if this is a short URL request
  // Pass to interstitial page which will handle feature flag check client-side
  if (isShortUrlPath(pathname)) {
    const shortCode = pathname.substring(1);
    logger.urlShortener.info(
      `Short URL detected: ${shortCode} - passing to interstitial page`
    );
    return NextResponse.next();
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
