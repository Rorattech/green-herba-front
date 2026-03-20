import { apiPost } from "@/src/lib/api-client";

/** Corpo enviado em POST /api/contact-messages — ver docs/API_CONTACT_MESSAGES.md */
export interface ContactMessageBody {
  name: string;
  email: string;
  /** Dígitos apenas, ou vazio se não informado */
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessageResponse {
  message: string;
  data?: {
    id: number | string;
    created_at: string;
  };
}

/**
 * Envia mensagem de contato (rota pública; não envia Bearer).
 * Backend: POST /api/contact-messages
 */
export async function submitContactMessage(body: ContactMessageBody): Promise<ContactMessageResponse> {
  return apiPost<ContactMessageResponse>("/api/contact-messages", body, true);
}
