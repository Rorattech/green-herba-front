export interface User {
  id: number | string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  document_number?: string | null;
  profile_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}
