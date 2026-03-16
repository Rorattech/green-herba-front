import { apiPost } from "@/src/lib/api-client";
import type { ApiOrder } from "@/src/types/api-resources";

export interface CheckoutItem {
  product_id: number;
  quantity: number;
  requires_prescription: boolean;
}

export interface CheckoutBody {
  shipping_address_id: number;
  shipping_method: "entrega_propria";
  /** Only the code; backend validates and applies discount. Never send discount amount. */
  coupon_code?: string;
  items: CheckoutItem[];
}

export interface CheckoutResponse {
  success: true;
  message: string;
  order: ApiOrder;
}

export async function createOrder(body: CheckoutBody): Promise<CheckoutResponse> {
  return apiPost<CheckoutResponse>("/api/checkout", body);
}
