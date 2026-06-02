import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const SECRET = process.env.NEXTAUTH_SECRET || "clothhaus-secret-key-change-in-production";
export const ADMIN_EMAIL = "ahsanzaidi51272@gmail.com";

export async function getAuthToken(req: NextRequest) {
  return getToken({
    req,
    secret: SECRET,
    secureCookie: process.env.NEXTAUTH_URL?.startsWith("https") ?? process.env.NODE_ENV === "production",
  });
}

export async function isAdmin(req: NextRequest) {
  const token = await getAuthToken(req);
  return token?.email === ADMIN_EMAIL;
}
