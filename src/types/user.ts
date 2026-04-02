export interface User {
  id: number | string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  document_number?: string | null;
  profile_completed?: boolean;
  /** ISO datetime quando o e-mail foi verificado; ausente/null = não verificado */
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
