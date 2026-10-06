import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "zenwol_admin_session";
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 hari

function getSecretKey(): string {
  return (
    process.env.ADMIN_SECRET_TOKEN ||
    "zenwol_super_secret_admin_session_key_2026"
  );
}

export function createSessionToken(username: string): string {
  const secret = getSecretKey();
  const expiresAt = Date.now() + SESSION_MAX_AGE_SEC * 1000;
  const payload = `${username.trim().toLowerCase()}:${expiresAt}`;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${hmac}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [payloadB64, signature] = parts;
    const payload = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const [username, expiresAtStr] = payload.split(":");

    if (!username || !expiresAtStr) return false;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

    // Pastikan username sesuai dengan ADMIN_USERNAME yang ada di .env (case-insensitive & trimmed)
    const configuredUsername = (process.env.ADMIN_USERNAME || "admin_zenwol").trim().toLowerCase();
    if (username.toLowerCase() !== configuredUsername) return false;

    const secret = getSecretKey();
    const expectedHmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    const sigBuffer = Buffer.from(signature);
    const expBuffer = Buffer.from(expectedHmac);
    if (sigBuffer.length !== expBuffer.length) return false;

    return crypto.timingSafeEqual(sigBuffer, expBuffer);
  } catch {
    return false;
  }
}

export async function isUserAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch {
    return false;
  }
}
