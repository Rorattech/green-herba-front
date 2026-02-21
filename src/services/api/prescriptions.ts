import { apiGet, apiMultipart } from "@/src/lib/api-client";
import type { ApiPrescription, ApiPrescriptionStatus } from "@/src/types/api-resources";

export type Prescription = ApiPrescription;
export type PrescriptionStatusResponse = ApiPrescriptionStatus;

export interface PrescriptionsListResponse {
  data: ApiPrescription[];
  links: { first: string; last: string; prev: string | null; next: string | null };
  meta: { current_page: number; from: number; last_page: number; path: string; per_page: number; to: number; total: number };
}

export async function getPrescriptions(params?: { per_page?: number }): Promise<PrescriptionsListResponse> {
  return apiGet<PrescriptionsListResponse>("/api/prescriptions", params);
}

export async function uploadPrescription(file: File, productId: number): Promise<ApiPrescription> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("product_id", String(productId));
  const res = await apiMultipart<ApiPrescription | { data: ApiPrescription }>("/api/prescriptions", formData);
  return "data" in res ? res.data : res;
}

export async function getPrescriptionStatus(prescriptionId: number): Promise<PrescriptionStatusResponse> {
  const res = await apiGet<{ data: PrescriptionStatusResponse }>(`/api/prescriptions/${prescriptionId}/status`);
  return res.data;
}

/**
 * Returns the set of product IDs for which the current user has an approved prescription.
 * Use this to check if the user can buy a product that requires prescription.
 */
export async function getApprovedPrescriptionProductIds(): Promise<Set<number>> {
  const res = await getPrescriptions({ per_page: 100 });
  const ids = new Set<number>();
  for (const p of res.data ?? []) {
    if (p.status !== "approved") continue;
    for (const prod of p.products ?? []) {
      ids.add(prod.id);
    }
  }
  return ids;
}
