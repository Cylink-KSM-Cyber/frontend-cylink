import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Middleware function for handling authentication and route protection
 * Only protects dashboard routes - all other routes are publicly accessible
 */
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Only protect /dashboard routes
  const isDashboardRoute =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  // If trying to access dashboard without access token, redirect to login
  if (isDashboardRoute && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If has access token and on login page, redirect to dashboard
  if (accessToken && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

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
