import { getApiBaseUrlForResources } from "@/src/lib/api-client";

/**
 * Evita open-redirect: só aceita URL da API configurada ou mesmo origin + /api-proxy (assinatura Laravel intacta).
 */
export function isAllowedEmailVerifyRedirectUrl(raw: string): boolean {
  if (typeof raw !== "string" || !raw.trim()) return false;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return false;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return false;
  if (!u.pathname.includes("/api/auth/email/verify/")) return false;

  let apiHostname: string;
  try {
    apiHostname = new URL(getApiBaseUrlForResources()).hostname;
  } catch {
    return false;
  }
  if (u.hostname === apiHostname) return true;

  if (typeof window !== "undefined" && u.origin === window.location.origin && u.pathname.includes("/api/auth/email/verify/")) {
    return u.pathname.startsWith("/api-proxy/");
  }
  return false;
}
