import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = request.cookies.has("auth_token");

  if (hasToken && (pathname === "/" || AUTH_ROUTES.includes(pathname))) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  if (!hasToken && pathname.startsWith("/feed")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/feed/:path*", "/login", "/register"],
};
