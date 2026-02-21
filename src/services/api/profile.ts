import { apiPut } from "@/src/lib/api-client";
import type { ApiUser } from "@/src/types/api-resources";
import type { User } from "@/src/types/user";

function mapApiUserToUser(api: ApiUser): User {
  const parts = api.name.trim().split(/\s+/);
  return {
    id: api.id,
    email: api.email,
    name: api.name,
    firstName: parts[0] ?? api.name,
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : "",
    phone: api.phone ?? undefined,
    document_number: api.document_number ?? undefined,
    profile_completed: api.profile_completed,
    created_at: api.created_at,
    updated_at: api.updated_at,
  };
}

export interface UpdateProfileBody {
  phone?: string;
  document_number?: string;
}

export interface ProfileResponse {
  message: string;
  data: ApiUser;
}

export async function updateProfile(body: UpdateProfileBody): Promise<User> {
  const res = await apiPut<ProfileResponse>("/api/users/profile", body);
  return mapApiUserToUser(res.data);
}
