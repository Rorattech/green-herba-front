import { apiGet, apiPost, setStoredToken, clearStoredToken } from "@/src/lib/api-client";
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
  const res = await apiPost<AuthResponse>("/api/auth/register", body, true);
  const token = res.data.token;
  setStoredToken(token);
  return { user: mapApiUserToUser(res.data.user), token };
}

export async function login(body: LoginBody): Promise<AuthData> {
  const res = await apiPost<AuthResponse>("/api/auth/login", body, true);
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
  await apiPost<{ message: string }>("/api/auth/reset-password", body, true);
}
