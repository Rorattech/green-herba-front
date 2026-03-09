"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getOrder } from "@/src/services/api/orders";
import { formatCurrency } from "@/src/utils/format";
import type { ApiOrder } from "@/src/types/api-resources";
import { Button } from "@/src/components/ui/Button";
import { ArrowLeft } from "lucide-react";

const statusLabel: Record<string, string> = {
  pending: "Pendente",
  pending_payment: "Aguardando pagamento",
  processing: "Em processamento",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  paid: "Pago",
};

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id ? Number(params.id) : NaN;
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setLoading(false);
      return;
    }
    getOrder(id)
      .then(setOrder)
      .catch(() => setError("Erro ao carregar pedido."))
      .finally(() => setLoading(false));
  }, [id]);

  if (!Number.isFinite(id)) {
    return (
      <div className="space-y-4">
        <p className="text-body-m text-error">Pedido inválido.</p>
        <Link href="/account/orders">Voltar aos pedidos</Link>
      </div>
    );
  }

  if (loading) return <p className="text-body-m text-gray-500">Carregando…</p>;
  if (error) return <p className="text-body-s text-error font-medium">{error}</p>;
  if (!order) return <p className="text-body-m text-gray-500">Pedido não encontrado.</p>;

  const canPay = order.status === "pending_payment";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Link href="/account/orders" className="inline-flex items-center gap-2 text-body-m text-green-800 hover:underline">
          <ArrowLeft size={18} /> Voltar aos pedidos
        </Link>
      </div>
      <h2 className="text-h5 font-heading text-green-800">Pedido #{order.order_number}</h2>
      <div className="flex flex-wrap gap-4 text-body-s text-gray-600">
        <span>Data: {new Date(order.created_at).toLocaleDateString("pt-BR")}</span>
        <span className="font-medium text-green-800 uppercase">{statusLabel[order.status] ?? order.status}</span>
      </div>

      {order.items && order.items.length > 0 && (
        <div>
          <h3 className="text-h6 font-heading text-green-800 mb-2">Itens</h3>
          <ul className="border border-gray-200 rounded-lg divide-y divide-gray-200">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between items-center p-4">
                <div>
                  <p className="text-body-m font-medium text-green-800">{item.product_name}</p>
                  <p className="text-body-s text-gray-500">
                    {item.quantity} × {formatCurrency(item.unit_price)} = {formatCurrency(item.subtotal)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border border-gray-200 rounded-lg p-4 space-y-2">
        <p className="text-body-s text-gray-500">Subtotal: {formatCurrency(order.total_items_amount)}</p>
        <p className="text-body-s text-gray-500">Frete: {formatCurrency(order.shipping_cost)}</p>
        {(Number(order.discount_amount) || 0) > 0 && <p className="text-body-s text-gray-500">Desconto: -{formatCurrency(order.discount_amount)}</p>}
        <p className="text-body-m font-medium text-green-800">Total: {formatCurrency(order.total_amount)}</p>
      </div>

      {order.shipping_address && (
        <div>
          <h3 className="text-h6 font-heading text-green-800 mb-2">Endereço de entrega</h3>
          <p className="text-body-m text-gray-700">
            {order.shipping_address.street}, {order.shipping_address.number}
            {order.shipping_address.complement ? `, ${order.shipping_address.complement}` : ""}<br />
            {order.shipping_address.district}, {order.shipping_address.city}/{order.shipping_address.state} — CEP {order.shipping_address.postal_code}
          </p>
        </div>
      )}

      {canPay && (
        <div>
          <Link href={`/checkout/pay/${order.id}`}>
            <Button variant="primary" colorTheme="green" className="text-green-100">
              Pagar com Mercado Pago
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
