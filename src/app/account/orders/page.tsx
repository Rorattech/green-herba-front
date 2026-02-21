"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getOrders } from "@/src/services/api/orders";
import { formatCurrency } from "@/src/utils/format";
import type { ApiOrder } from "@/src/types/api-resources";

const statusLabel: Record<string, string> = {
  pending: "Pendente",
  pending_payment: "Aguardando pagamento",
  processing: "Em processamento",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrders({ per_page: 20 })
      .then((res) => setOrders(res.data ?? []))
      .catch(() => setError("Erro ao carregar pedidos."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-h5 font-heading text-green-800">Meus pedidos</h2>
      {error && <p className="text-body-s text-error font-medium">{error}</p>}
      {loading ? (
        <p className="text-body-m text-gray-500">Carregando…</p>
      ) : orders.length === 0 ? (
        <p className="text-body-m text-gray-400">Você ainda não fez nenhum pedido.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <Link href={`/account/orders/${order.id}`} className="text-body-s font-medium text-green-800 hover:underline">
                  Pedido #{order.order_number}
                </Link>
                <span className="text-body-s text-gray-500">
                  {new Date(order.created_at).toLocaleDateString("pt-BR")}
                </span>
                <span className="text-body-s font-medium text-green-700 uppercase tracking-wide">
                  {statusLabel[order.status] ?? order.status}
                </span>
              </div>
              <p className="text-body-s text-gray-500">
                {order.items?.length ?? 0} {(order.items?.length ?? 0) === 1 ? "item" : "itens"} · Total {formatCurrency(order.total_amount)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
