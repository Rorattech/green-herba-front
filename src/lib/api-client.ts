const DEFAULT_API_BASE = "https://api.green-herba-pharma.com.br";

const AUTH_TOKEN_KEY = "green-herba-token";

/**
 * Get stored Sanctum token (client-only).
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

/**
 * Base URL for the backend API (no trailing slash).
 * Use NEXT_PUBLIC_API_URL in .env for override.
 */
export function getApiBaseUrl(): string {
  const url =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  return (url && url.trim()) ? url.trim().replace(/\/$/, "") : DEFAULT_API_BASE;
}

export type RequestInit = globalThis.RequestInit;

function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Performs a request to the API. Path should start with / (e.g. /api/products).
 * Query params can be passed as a record or as URLSearchParams.
 * Auth: Bearer token is added automatically when available (client-side).
 */
export async function apiRequest<T>(
  path: string,
  init?: RequestInit & { params?: Record<string, string | number | undefined>; skipAuth?: boolean }
): Promise<T> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const url = new URL(path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`);

  const { params, skipAuth, ...restInit } = init ?? {};
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const authHeaders = skipAuth ? {} : getAuthHeaders();
  const isJson = restInit.body != null && typeof restInit.body === "string" && !(restInit.headers as Record<string, string>)?.["Content-Type"]?.startsWith("multipart");

  const res = await fetch(url.toString(), {
    ...restInit,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(isJson ? { "Content-Type": "application/json" } : {}),
      ...authHeaders,
      ...(restInit.headers as Record<string, string>),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const json = JSON.parse(text);
      message = json.message ?? json.error ?? text;
    } catch {
      // use text as message
    }
    throw new Error(message || `API error: ${res.status}`);
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json() as Promise<T>;
  }
  return res.text() as Promise<T>;
}

/**
 * GET request to the API.
 */
export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  return apiRequest<T>(path, { method: "GET", params });
}

/**
 * POST request with JSON body. Pass skipAuth: true for public routes (login, register, forgot-password, reset-password).
 */
export async function apiPost<T>(path: string, body: unknown, skipAuth?: boolean): Promise<T> {
  return apiRequest<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    skipAuth,
  });
}

/**
 * PUT request with JSON body.
 */
export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

/**
 * DELETE request.
 */
export async function apiDelete<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: "DELETE" });
}

/**
 * POST request with multipart/form-data (e.g. file upload). Do not set Content-Type; browser sets boundary.
 */
export async function apiMultipart<T>(path: string, formData: FormData): Promise<T> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const url = new URL(path.startsWith("/") ? `${base}${path}` : `${base}/${path}`);
  const authHeaders = getAuthHeaders();

  const res = await fetch(url.toString(), {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...authHeaders,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const json = JSON.parse(text);
      message = json.message ?? json.error ?? text;
    } catch {
      // use text as message
    }
    throw new Error(message || `API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
