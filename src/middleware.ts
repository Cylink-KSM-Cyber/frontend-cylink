import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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

  // Check if this is a short URL request (looks like a code rather than a known route)
  // Assume short codes are alphanumeric strings (can adjust pattern based on your app's needs)
  const shortCodePattern = /^\/([A-Za-z0-9]{5,10})$/;
  const isShortUrlRequest = shortCodePattern.test(pathname);

  console.log("Is short URL request:", isShortUrlRequest);

  if (isShortUrlRequest) {
    console.log("Short URL detected, code:", pathname.substring(1));

    // Extract the short code from the pathname
    const shortCode = pathname.substring(1);

    // Redirect to our API route handler for shortcode redirection
    // This will tell Next.js to use our custom route handler to handle this request
    // rather than trying to find a matching page
    console.log(`Redirecting to API route handler for code: ${shortCode}`);
    return NextResponse.rewrite(
      new URL(`/api/v1/redirect/${shortCode}`, request.url)
    );
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
