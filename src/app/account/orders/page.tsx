"use client";

import { useMemo } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { getOrdersByUser } from "@/src/services/mock-account";
import { formatCurrency } from "@/src/utils/format";
import type { OrderStatus } from "@/src/types/order";

const statusLabel: Record<OrderStatus, string> = {
  pending: "Pendente",
  processing: "Em processamento",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export default function AccountOrdersPage() {
  const { user } = useAuth();
  const orders = useMemo(() => (user ? getOrdersByUser(user.id) : []), [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-h5 font-heading text-green-800">Meus pedidos</h2>
      {orders.length === 0 ? (
        <p className="text-body-m text-gray-400">Você ainda não fez nenhum pedido.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-body-s font-medium text-green-800">
                  Pedido #{order.id.slice(-8)}
                </span>
                <span className="text-body-s text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                </span>
                <span className="text-body-s font-medium text-green-700 uppercase tracking-wide">
                  {statusLabel[order.status]}
                </span>
              </div>
              <p className="text-body-s text-gray-500">
                {order.items.length} {order.items.length === 1 ? "item" : "itens"} · Total {formatCurrency(order.total)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
