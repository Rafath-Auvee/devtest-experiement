import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { signToken } from "@/lib/auth/jwt";
import { setAuthCookie } from "@/lib/auth/cookie";
import { exchangeCodeForToken, fetchGoogleProfile } from "@/lib/auth/google";

function fail(origin: string, message: string) {
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(message)}`);
}

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const { searchParams } = req.nextUrl;

  if (searchParams.get("error")) return fail(origin, "Google sign-in was cancelled");

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const stateCookie = req.cookies.get("g_oauth_state")?.value;

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return fail(origin, "Invalid Google sign-in state. Please try again.");
  }

  try {
    const redirectUri = `${origin}/api/auth/google/callback`;
    const accessToken = await exchangeCodeForToken(code, redirectUri);
    const profile = await fetchGoogleProfile(accessToken);

    if (!profile.email || profile.email_verified === false) {
      return fail(origin, "Your Google email is not verified.");
    }

    await connectDB();
    const email = profile.email.toLowerCase().trim();
    const nameParts = (profile.name ?? "").trim().split(/\s+/).filter(Boolean);
    const firstName = profile.given_name?.trim() || nameParts[0] || "Google";
    const lastName = profile.family_name?.trim() || nameParts.slice(1).join(" ") || "User";

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        firstName,
        lastName,
        email,
        googleId: profile.sub,
        avatar: profile.picture,
        provider: "google",
      });
    } else if (!user.googleId) {
      user.googleId = profile.sub;
      if (profile.picture && !user.avatar) user.avatar = profile.picture;
      await user.save();
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    const res = NextResponse.redirect(`${origin}/feed`);
    setAuthCookie(res, token);
    res.cookies.delete("g_oauth_state");
    return res;
  } catch (err) {
    console.error("[google callback]", err);
    return fail(origin, "Google sign-in failed. Please try again.");
  }
}
