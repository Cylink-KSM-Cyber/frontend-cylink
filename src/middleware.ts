import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  const { pathname } = request.nextUrl;

  // Log details in development mode
  if (process.env.NODE_ENV === "development") {
    console.log("[Middleware] Processing request:", {
      pathname,
      accessToken: accessToken ? "exists" : "missing",
      url: request.url,
    });
  }

  // Only protect /dashboard routes
  const isDashboardRoute =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  // If trying to access dashboard without access token, redirect to login
  if (isDashboardRoute && !accessToken) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[Middleware] No access token, redirecting to login from ${pathname}`
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If has access token and on login page, redirect to dashboard
  if (accessToken && pathname === "/login") {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "[Middleware] Has access token on login page, redirecting to dashboard"
      );
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

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
