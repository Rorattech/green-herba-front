const DEFAULT_API_BASE = "https://api.green-herba-pharma.com.br";

const AUTH_TOKEN_KEY = "green-herba-token";

/**
 * Thrown when the API returns an error (4xx/5xx). Carries status and optional
 * validation errors (e.g. errors.coupon_code) for 422 responses.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors?: Record<string, string[]>,
    /** Presente em alguns 403 (ex.: checkout sem e-mail verificado) */
    public readonly requireEmailVerification?: boolean
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

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
 * Server: uses API_URL / NEXT_PUBLIC_API_URL / default.
 * Client: uses same-origin proxy (/api-proxy) to avoid CORS when the API does not send Access-Control-Allow-Origin.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api-proxy`;
  }
  const url = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  return (url && url.trim()) ? url.trim().replace(/\/$/, "") : DEFAULT_API_BASE;
}

/**
 * Real API base URL for building resource URLs (images, storage).
 * Always returns the actual API host (never the proxy), so next/image and img work in both dev and production.
 * Use this only for src attributes; use getApiBaseUrl() for fetch().
 */
export function getApiBaseUrlForResources(): string {
  const url = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;
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
    let errors: Record<string, string[]> | undefined;
    let requireEmailVerification: boolean | undefined;
    try {
      const json = JSON.parse(text) as {
        message?: string;
        error?: string;
        errors?: Record<string, string[]>;
        require_email_verification?: boolean;
      };
      message = json.message ?? json.error ?? text;
      errors = json.errors;
      if (json.require_email_verification === true) requireEmailVerification = true;
    } catch {
      // use text as message
    }
    throw new ApiError(message || `API error: ${res.status}`, res.status, errors, requireEmailVerification);
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
    let errors: Record<string, string[]> | undefined;
    let requireEmailVerification: boolean | undefined;
    try {
      const json = JSON.parse(text) as {
        message?: string;
        error?: string;
        errors?: Record<string, string[]>;
        require_email_verification?: boolean;
      };
      message = json.message ?? json.error ?? text;
      errors = json.errors;
      if (json.require_email_verification === true) requireEmailVerification = true;
    } catch {
      // use text as message
    }
    throw new ApiError(message || `API error: ${res.status}`, res.status, errors, requireEmailVerification);
  }

  return res.json() as Promise<T>;
}
