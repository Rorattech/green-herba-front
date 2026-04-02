import type { User } from "@/src/types/user";

export function isUserEmailVerified(user: User | null | undefined): boolean {
  if (!user) return false;
  return Boolean(user.email_verified_at);
}
