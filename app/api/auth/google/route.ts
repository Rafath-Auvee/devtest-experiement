import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { buildGoogleAuthUrl, isGoogleConfigured } from "@/lib/auth/google";

// Starts the Google OAuth flow: sets a CSRF state cookie and redirects to consent.
export async function GET(req: NextRequest) {
  if (!isGoogleConfigured()) {
    return NextResponse.redirect(
      `${req.nextUrl.origin}/login?error=${encodeURIComponent("Google login is not configured")}`
    );
  }

  const redirectUri = `${req.nextUrl.origin}/api/auth/google/callback`;
  const state = crypto.randomBytes(16).toString("hex");

  const res = NextResponse.redirect(buildGoogleAuthUrl(redirectUri, state));
  res.cookies.set("g_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
