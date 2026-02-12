const DEFAULT_API_BASE = "https://pharma-green-backend.onrender.com";

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

/**
 * Performs a request to the API. Path should start with / (e.g. /api/products).
 * Query params can be passed as a record or as URLSearchParams.
 */
export async function apiRequest<T>(
  path: string,
  init?: RequestInit & { params?: Record<string, string | number | undefined> }
): Promise<T> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const url = new URL(path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`);

  if (init?.params) {
    Object.entries(init.params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
    const { params: _, ...restInit } = init;
    init = restInit as RequestInit;
  }

  const res = await fetch(url.toString(), {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...init?.headers,
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

  return res.json() as Promise<T>;
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
