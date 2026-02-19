const AUTH_KEY = 'green-herba-auth';
const ORDERS_KEY = 'green-herba-orders';
const PRESCRIPTIONS_KEY = 'green-herba-prescriptions';

export function getStoredUser(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_KEY);
}

export function setStoredUser(json: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_KEY, json);
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
}

export function getStoredOrders(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ORDERS_KEY);
}

export function setStoredOrders(json: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ORDERS_KEY, json);
}

export function getStoredPrescriptions(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PRESCRIPTIONS_KEY);
}

export function setStoredPrescriptions(json: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRESCRIPTIONS_KEY, json);
}
