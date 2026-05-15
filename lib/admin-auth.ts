import { env } from "./env";

const COOKIE_NAME = "admin_session";

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function getAdminSessionValue() {
  if (!env.ADMIN_PASSWORD) {
    throw new Error("Missing ADMIN_PASSWORD");
  }
  return sha256(env.ADMIN_PASSWORD as string);
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}

export async function isAdminPasswordValid(input: string) {
  if (!env.ADMIN_PASSWORD) {
    return false;
  }
  return input === env.ADMIN_PASSWORD;
}

export function isBearerAuthorized(authHeader: string | null) {
  if (!env.ADMIN_BEARER_TOKEN) {
    return false;
  }
  if (!authHeader) return false;
  const [scheme, token] = authHeader.split(" ");
  return scheme === "Bearer" && token === env.ADMIN_BEARER_TOKEN;
}
