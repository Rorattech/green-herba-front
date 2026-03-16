import { apiGet, apiPost } from "@/src/lib/api-client";
import type { ApiOrder } from "@/src/types/api-resources";

export type Order = ApiOrder;

export interface OrdersListResponse {
  data: ApiOrder[];
  links: { first: string; last: string; prev: string | null; next: string | null };
  meta: { current_page: number; from: number; last_page: number; path: string; per_page: number; to: number; total: number };
}

export async function getOrders(params?: { per_page?: number }): Promise<OrdersListResponse> {
  return apiGet<OrdersListResponse>("/api/orders", params);
}

export async function getOrder(orderId: number): Promise<ApiOrder> {
  const res = await apiGet<{ data: ApiOrder }>(`/api/orders/${orderId}`);
  return res.data;
}

export interface PaymentPreferenceResponse {
  preference_id: string;
  public_key: string;
}

export async function getPaymentPreference(orderId: number): Promise<PaymentPreferenceResponse> {
  return apiPost<PaymentPreferenceResponse>(`/api/orders/${orderId}/payment/preference`, {});
}

/** Endereço do pagador (obrigatório para boleto no MP). */
export interface PayerAddress {
  zip_code?: string;
  street_name?: string;
  street_number?: string;
  neighborhood?: string;
  city?: string;
  federal_unit?: string;
}

export interface ProcessPaymentBody {
  /** Obrigatório apenas para cartão (credit/debit). PIX e boleto não usam token. */
  token?: string;
  issuer_id?: string;
  payment_method_id: string;
  transaction_amount: number;
  installments: number;
  payer: {
    email: string;
    first_name?: string;
    last_name?: string;
    identification?: { type: string; number: string };
    /** Obrigatório para boleto (MP exige CEP, rua, número, bairro, cidade, UF). */
    address?: PayerAddress;
  };
  /** Tipo retornado pelo Brick (credit_card, debit_card, bank_transfer/pix, etc.) — backend usa para chamar a API correta do MP */
  payment_type?: string;
  /** ID do pedido (recomendado enviar no body para o backend usar como external_reference na API do MP) */
  order_id?: number;
}

export interface ProcessPaymentResponse {
  success: true;
  payment_id: string;
  status: string;
  status_detail?: string;
  order_number: string;
  /** Preenchido quando status === "pending" e método é PIX: imagem do QR em base64. */
  qr_code_base64?: string;
  /** Preenchido quando status === "pending" e método é PIX: código copia-e-cola. */
  qr_code?: string;
  /** URL do MP com instruções (PIX ou boleto). Mostrar "Ver instruções" quando pending. */
  ticket_url?: string;
  /** URL do boleto para imprimir/pagar (quando status pending e método boleto). */
  external_resource_url?: string;
}

export async function processPayment(orderId: number, body: ProcessPaymentBody): Promise<ProcessPaymentResponse> {
  return apiPost<ProcessPaymentResponse>(`/api/orders/${orderId}/payment/process`, body);
}
