import { apiGet, apiPost, apiPut, apiDelete } from "@/src/lib/api-client";
import type { ApiAddress } from "@/src/types/api-resources";

export type Address = ApiAddress;

export interface CreateAddressBody {
  label: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default_billing?: boolean;
  is_default_shipping?: boolean;
}

export type UpdateAddressBody = Partial<CreateAddressBody>;

export interface AddressResponse {
  message?: string;
  data: ApiAddress;
}

export async function getAddresses(): Promise<ApiAddress[]> {
  const res = await apiGet<{ data: ApiAddress[] }>("/api/addresses");
  return res.data ?? [];
}

export async function getAddress(id: number): Promise<ApiAddress> {
  const res = await apiGet<{ data: ApiAddress }>(`/api/addresses/${id}`);
  return res.data;
}

export async function createAddress(body: CreateAddressBody): Promise<ApiAddress> {
  const res = await apiPost<AddressResponse>("/api/addresses", body);
  return res.data;
}

export async function updateAddress(id: number, body: UpdateAddressBody): Promise<ApiAddress> {
  const res = await apiPut<AddressResponse>(`/api/addresses/${id}`, body);
  return res.data;
}

export async function deleteAddress(id: number): Promise<void> {
  await apiDelete<{ message: string }>(`/api/addresses/${id}`);
}

export async function setDefaultBilling(id: number): Promise<ApiAddress> {
  const res = await apiPost<AddressResponse>(`/api/addresses/${id}/set-default-billing`, {});
  return res.data;
}

export async function setDefaultShipping(id: number): Promise<ApiAddress> {
  const res = await apiPost<AddressResponse>(`/api/addresses/${id}/set-default-shipping`, {});
  return res.data;
}
