import { apiGet } from "@/src/lib/api-client";
import { createRequestCache } from "@/src/lib/request-cache";
import type { ApiCoupon } from "@/src/types/api-resources";

export type Coupon = ApiCoupon;

const COUPONS_CACHE_TTL_MS = 60_000;
const cachedCoupons = createRequestCache<ApiCoupon[]>(COUPONS_CACHE_TTL_MS);

export async function getCoupons(): Promise<ApiCoupon[]> {
  return cachedCoupons("coupons:list", () => apiGet<ApiCoupon[]>("/api/coupons"));
}
