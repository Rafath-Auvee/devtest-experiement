import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;
  const isAuthed = token ? verifyToken(token) !== null : false;

  if (isAuthed && (pathname === "/" || AUTH_ROUTES.includes(pathname))) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  if (!isAuthed && pathname.startsWith("/feed")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/feed/:path*", "/login", "/register"],
};
