import type { Order } from '@/src/types/order';
import type { Prescription } from '@/src/types/prescription';
import { getStoredOrders, setStoredOrders, getStoredPrescriptions, setStoredPrescriptions } from '@/src/lib/mock-storage';

function parseOrders(): Order[] {
  const raw = getStoredOrders();
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function parsePrescriptions(): Prescription[] {
  const raw = getStoredPrescriptions();
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getOrdersByUser(userId: string): Order[] {
  return parseOrders().filter((o) => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addOrder(order: Order): void {
  const list = parseOrders();
  list.push(order);
  setStoredOrders(JSON.stringify(list));
}

export function getPrescriptionsByUser(userId: string): Prescription[] {
  return parsePrescriptions()
    .filter((p) => p.userId === userId)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export function addPrescription(prescription: Prescription): void {
  const list = parsePrescriptions();
  list.push(prescription);
  setStoredPrescriptions(JSON.stringify(list));
}

export function updatePrescriptionStatus(id: string, status: Prescription['status'], rejectionReason?: string): void {
  const list = parsePrescriptions();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return;
  list[idx] = {
    ...list[idx],
    status,
    reviewedAt: new Date().toISOString(),
    ...(rejectionReason && { rejectionReason }),
  };
  setStoredPrescriptions(JSON.stringify(list));
}
