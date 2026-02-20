"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MainLayout from "@/src/layouts/MainLayout";
import { Button } from "@/src/components/ui/Button";
import { useCart } from "@/src/contexts/CartContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { addOrder } from "@/src/services/mock-account";
import { formatCurrency } from "@/src/utils/format";

const SHIPPING_FREE_THRESHOLD = 50;
const SHIPPING_COST = 10;

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false);

  const subtotal = getTotalPrice();
  const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setPlacing(true);
    const orderId = `ord-${Date.now()}`;
    const now = new Date().toISOString();
    addOrder({
      id: orderId,
      userId: user?.id ?? "guest",
      items: items.map((i) => ({
        product: i.product,
        quantity: i.quantity,
        selectedSize: i.selectedSize,
      })),
      subtotal,
      shipping,
      total,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
    clearCart();
    setPlacing(false);
    setDone(true);
  }

  if (done) {
    return (
      <MainLayout>
        <section className="bg-white min-h-[calc(100vh-180px)] flex items-center justify-center p-8">
          <div className="max-w-[440px] text-center space-y-6">
            <h1 className="text-h4 font-heading text-green-800">Pedido realizado</h1>
            <p className="text-body-m text-green-800/70">
              Obrigado pela compra. Em breve você receberá a confirmação por email.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button variant="primary" colorTheme="green" className="w-full sm:w-auto text-green-100">
                  Continuar comprando
                </Button>
              </Link>
              {user && (
                <Link href="/account/orders">
                  <Button variant="primary" colorTheme="pistachio" className="w-full sm:w-auto">
                    Ver meus pedidos
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (items.length === 0 && !placing) {
    return (
      <MainLayout>
        <section className="bg-white min-h-[calc(100vh-180px)] flex items-center justify-center p-8">
          <div className="max-w-[440px] text-center space-y-6">
            <h1 className="text-h4 font-heading text-green-800">Carrinho vazio</h1>
            <p className="text-body-m text-green-800/70">
              Adicione itens ao carrinho para finalizar a compra.
            </p>
            <Link href="/products">
              <Button variant="primary" colorTheme="green" className="text-green-100">
                Ir às compras
              </Button>
            </Link>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="bg-white min-h-[calc(100vh-180px)] py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-0 max-w-3xl">
          <h1 className="text-h4 font-heading text-green-800 mb-8">Checkout</h1>

          <form onSubmit={handlePlaceOrder} className="space-y-8">
            <div>
              <h2 className="text-h6 font-heading text-green-800 mb-4">Resumo do pedido</h2>
              <ul className="space-y-4 border-b border-gray-200 pb-6">
                {items.map((item) => {
                  const price = parseFloat(item.product.price.replace(/[^0-9.-]+/g, "")) || 0;
                  return (
                    <li key={`${item.product.id}-${item.selectedSize ?? "default"}`} className="flex gap-4">
                      <div className="relative w-16 h-20 bg-gray-100 rounded-sm overflow-hidden shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-m font-medium text-green-800">{item.product.name}</p>
                        {item.selectedSize && (
                          <p className="text-body-s text-gray-500">Tamanho: {item.selectedSize}</p>
                        )}
                        <p className="text-body-s text-gray-500">
                          {item.quantity} × {formatCurrency(price)}
                        </p>
                      </div>
                      <p className="text-body-m font-medium text-green-800 shrink-0">
                        {formatCurrency(price * item.quantity)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="space-y-2 border-b border-gray-200 pb-6">
              <div className="flex justify-between text-body-m text-gray-500">
                <span>Subtotal</span>
                <span className="text-green-800 font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-body-m text-gray-500">
                <span>Frete</span>
                <span className="text-green-800 font-medium">
                  {shipping === 0 ? "Grátis" : formatCurrency(shipping)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-body-l font-medium text-green-800 uppercase tracking-wider">
                Total
              </span>
              <span className="text-h5 font-heading text-green-800">{formatCurrency(total)}</span>
            </div>

            <p className="text-body-s text-gray-400">
              Pagamento será integrado em breve (Stripe, Mercado Pago ou PagBank). Por enquanto este checkout é simulado.
            </p>

            <Button
              type="submit"
              variant="primary"
              colorTheme="green"
              className="w-full h-14 text-green-100"
              disabled={placing}
            >
              {placing ? "Processando…" : "Finalizar pedido"}
            </Button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
}
