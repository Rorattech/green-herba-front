import { apiGet, apiPost, setStoredToken, clearStoredToken, getStoredToken, ApiError } from "@/src/lib/api-client";
import { hashPassword } from "@/src/lib/password";
import type { ApiUser } from "@/src/types/api-resources";
import type { User } from "@/src/types/user";

function mapApiUserToUser(api: ApiUser): User {
  const parts = api.name.trim().split(/\s+/);
  const firstName = parts[0] ?? api.name;
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
  return {
    id: api.id,
    email: api.email,
    name: api.name,
    firstName,
    lastName,
    phone: api.phone ?? undefined,
    document_number: api.document_number ?? undefined,
    profile_completed: api.profile_completed,
    email_verified_at: api.email_verified_at ?? null,
    created_at: api.created_at,
    updated_at: api.updated_at,
  };
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface AuthResponse {
  message: string;
  data: { user: ApiUser; token: string };
}

export async function register(body: RegisterBody): Promise<AuthData> {
  const password = await hashPassword(body.password);
  const res = await apiPost<AuthResponse>("/api/auth/register", { ...body, password }, true);
  const token = res.data.token;
  setStoredToken(token);
  return { user: mapApiUserToUser(res.data.user), token };
}

export async function login(body: LoginBody): Promise<AuthData> {
  const password = await hashPassword(body.password);
  const res = await apiPost<AuthResponse>("/api/auth/login", { ...body, password }, true);
  const token = res.data.token;
  setStoredToken(token);
  return { user: mapApiUserToUser(res.data.user), token };
}

export async function logout(): Promise<void> {
  try {
    await apiPost<{ message: string }>("/api/auth/logout", {});
  } catch {
    // ignore
  } finally {
    clearStoredToken();
  }
}

export async function fetchMe(): Promise<User | null> {
  const res = await apiGet<{ data: ApiUser }>("/api/auth/me");
  return res.data ? mapApiUserToUser(res.data) : null;
}

export async function forgotPassword(email: string): Promise<void> {
  await apiPost<{ message: string }>("/api/auth/forgot-password", { email }, true);
}

export interface ResetPasswordBody {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export async function resetPassword(body: ResetPasswordBody): Promise<void> {
  const password = await hashPassword(body.password);
  const password_confirmation = await hashPassword(body.password_confirmation);
  await apiPost<{ message: string }>(
    "/api/auth/reset-password",
    { ...body, password, password_confirmation },
    true
  );
}

export interface VerifyEmailApiResponse {
  message: string;
  data?: { user?: ApiUser };
}

/**
 * GET na URL assinada enviada no e-mail (query `redirect` da página /verify-email).
 */
export async function verifyEmailWithRedirect(redirectUrl: string): Promise<VerifyEmailApiResponse> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = getStoredToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(redirectUrl, {
    method: "GET",
    credentials: "include",
    headers,
    cache: "no-store",
  });

  const text = await res.text();
  let body: {
    message?: string;
    data?: { user?: ApiUser };
    require_email_verification?: boolean;
  };
  try {
    body = JSON.parse(text) as typeof body;
  } catch {
    throw new ApiError(text.trim() || "Resposta inválida da API.", res.status);
  }

  if (!res.ok) {
    throw new ApiError(
      body.message ?? "Não foi possível verificar o e-mail.",
      res.status,
      undefined,
      body.require_email_verification === true
    );
  }

  return {
    message: body.message ?? "E-mail verificado com sucesso.",
    data: body.data,
  };
}
