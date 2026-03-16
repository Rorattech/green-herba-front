/**
 * API response shapes (from backend Resources).
 * Nested objects/arrays when relations are loaded.
 */

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  document_number: string | null;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  addresses?: ApiAddress[];
}

export interface ApiAddress {
  id: number;
  user_id: number;
  label: string;
  street: string;
  number: string;
  complement: string | null;
  district: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default_billing: boolean;
  is_default_shipping: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ApiOrderItem {
  id: number;
  product_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  requires_prescription: boolean;
  product?: unknown;
  prescription_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface ApiPayment {
  id: number;
  payment_gateway: string;
  gateway_payment_id: string;
  status: string;
  amount: number;
  currency: string;
  installments: number;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Amounts may be string (e.g. "150.00") or number from backend. */
export interface ApiOrder {
  id: number;
  order_number: string;
  status: string;
  total_items_amount: number | string;
  shipping_cost: number | string;
  discount_amount: number | string;
  total_amount: number | string;
  currency: string;
  shipping_method: string;
  coupon_code: string | null;
  payment_method: string | null;
  payment_gateway: string | null;
  user?: ApiUser;
  items?: ApiOrderItem[];
  shipping_address?: ApiAddress;
  payments?: ApiPayment[];
  created_at: string;
  updated_at: string;
}

export interface ApiPrescription {
  id: number;
  user_id: number;
  file_path: string;
  file_url: string;
  status: string;
  uploaded_at: string;
  approved_at: string | null;
  approved_by_user_id: number | null;
  rejection_reason: string | null;
  valid_until: string | null;
  notes: string | null;
  ai_suggestion: string;
  ai_validation_status: string;
  ai_reasoning: string | null;
  ai_processed_at: string | null;
  status_message: string | null;
  products?: Array<{ id: number; name: string; sku: string; max_quantity: number | null }>;
  created_at: string;
  updated_at: string;
}

export interface ApiPrescriptionStatus {
  id: number;
  status: string;
  status_message: string | null;
  uploaded_at: string;
  approved_at: string | null;
  rejection_reason: string | null;
  valid_until: string | null;
  ai_suggestion: string;
  ai_validation_status: string;
  ai_reasoning: string | null;
  ai_processed_at: string | null;
}

export interface ApiCoupon {
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: string;
  starts_at: string | null;
  ends_at: string | null;
  min_order_amount: string | null;
  max_discount: string | null;
  max_usage: number | null;
  usage_count: number;
  remaining_usage: number | null;
}

/** Standard pagination (products, orders, prescriptions) */
export interface ApiPaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

/** Admin users pagination (no links) */
export interface ApiAdminUsersResponse {
  data: ApiUser[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}
