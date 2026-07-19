import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/privacy",
  "/terms",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths exactly
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow public prefixes (static assets, Next.js internals)
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Allow API routes (handled by the proxy, auth checked server-side)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Check for session cookie (set by the API proxy on this domain)
  const session = request.cookies.get("session");

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.svg).*)",
  ],
};
