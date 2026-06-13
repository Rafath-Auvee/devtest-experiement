import { cookies } from "next/headers";
import { verifyToken, JWTPayload } from "@/lib/auth/jwt";

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
