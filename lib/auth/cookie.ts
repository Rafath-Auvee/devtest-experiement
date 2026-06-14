import { NextResponse } from "next/server";

export const AUTH_COOKIE = "auth_token";

/** Sets the shared auth_token JWT cookie (same options used by login/register). */
export function setAuthCookie(res: NextResponse, token: string) {
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}
