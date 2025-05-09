import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  isShortUrlPath,
  getOriginalUrlByShortCode,
} from "@/utils/shortUrlUtils";

/**
 * Middleware function for handling authentication and route protection
 * Also handles short URL redirects
 */
export function middleware(request: NextRequest) {
  // Log the current request for debugging
  console.log("Middleware executing for URL:", request.url);
  console.log("Pathname:", request.nextUrl.pathname);

  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Check if this is a short URL request - using utility function for flexible pattern matching
  // This will support various short code formats, not just alphanumeric 5-10 chars
  const isShortUrlRequest = isShortUrlPath(pathname);

  console.log("Is short URL request:", isShortUrlRequest);

  if (isShortUrlRequest) {
    // Extract the short code from the pathname (remove leading slash)
    const shortCode = pathname.substring(1);
    console.log("Short URL detected, code:", shortCode);

    // Make API request to get the original URL - handled by utility function
    // This is more direct than rewriting to an API route
    return getOriginalUrlByShortCode(shortCode)
      .then((originalUrl: string | null) => {
        if (originalUrl) {
          console.log(`Redirecting to original URL: ${originalUrl}`);
          return NextResponse.redirect(originalUrl);
        }

        // If no original URL found, let the request continue to be handled by Next.js 404
        console.log(
          `No original URL found for short code: ${shortCode}, proceeding with request`
        );
        return NextResponse.next();
      })
      .catch((error: Error) => {
        console.error(`Error handling short URL ${shortCode}:`, error);
        // On error, let the request continue to be handled by Next.js
        return NextResponse.next();
      });
  }

  // Only protect /dashboard routes
  const isDashboardRoute =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  console.log("Is dashboard route:", isDashboardRoute);

  // If trying to access dashboard without access token, redirect to login
  if (isDashboardRoute && !accessToken) {
    console.log("Redirecting to login (unauthorized dashboard access)");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If has access token and on login page, redirect to dashboard
  if (accessToken && pathname === "/login") {
    console.log("Redirecting to dashboard (already logged in)");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  console.log("Proceeding with request");
  return NextResponse.next();
}

/**
 * Configuration for which routes the middleware applies to
 */
export const config = {
  matcher: [
    /**
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
