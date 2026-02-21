import { apiGet } from "@/src/lib/api-client";
import type { ApiCoupon } from "@/src/types/api-resources";

export type Coupon = ApiCoupon;

export async function getCoupons(): Promise<ApiCoupon[]> {
  return apiGet<ApiCoupon[]>("/api/coupons");
}
