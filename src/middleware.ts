import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get("admin_token");

  // Define protected paths
  const isDashboardPath = request.nextUrl.pathname.startsWith("/dashboard");

  // If trying to access dashboard without token, redirect to login
  if (isDashboardPath && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access login/register while already authenticated, redirect to dashboard
  const isAuthPath =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register";
  if (isAuthPath && token) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
