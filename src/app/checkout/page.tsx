"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MainLayout from "@/src/layouts/MainLayout";
import { Button } from "@/src/components/ui/Button";
import { useCart } from "@/src/contexts/CartContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { getAddresses } from "@/src/services/api/addresses";
import { getCoupons } from "@/src/services/api/coupons";
import { getApprovedPrescriptionProductIds } from "@/src/services/api/prescriptions";
import { createOrder } from "@/src/services/api/checkout";
import { formatCurrency } from "@/src/utils/format";
import type { Address } from "@/src/services/api/addresses";
import type { Product } from "@/src/types/product";

const SHIPPING_FREE_THRESHOLD = 50;
const SHIPPING_COST = 10;

function getItemSubtotal(item: { product: Product; quantity: number }): number {
  const price = parseFloat(String(item.product.price).replace(/[^0-9.-]+/g, "")) || 0;
  return price * item.quantity;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [coupons, setCoupons] = useState<Array<{ code: string; description: string | null }>>([]);
  const [shippingAddressId, setShippingAddressId] = useState<number | "">("");
  const [couponCode, setCouponCode] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = getTotalPrice();
  const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!user) {
      router.replace("/login?redirect=/checkout");
      return;
    }
    const itemsRequiringPrescription = items.filter(
      (i) => (i.product as Product & { requiresPrescription?: boolean }).requiresPrescription
    );
    if (itemsRequiringPrescription.length > 0) {
      getApprovedPrescriptionProductIds()
        .then((approvedIds) => {
          const missing = itemsRequiringPrescription.some((i) => !approvedIds.has(Number(i.product.id)));
          if (missing) {
            router.replace("/account/prescriptions?missing_prescription=1");
          }
        })
        .catch(() => {});
    }
    getAddresses()
      .then((list) => {
        setAddresses(list);
        const defaultShipping = list.find((a) => a.is_default_shipping) ?? list[0];
        if (defaultShipping) setShippingAddressId(defaultShipping.id);
        else if (list.length === 1) setShippingAddressId(list[0].id);
      })
      .catch(() => setError("Erro ao carregar endereços."));
    getCoupons().then(setCoupons).catch(() => {});
  }, [user, router, items]);

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0 || !user) return;
    const addressId = typeof shippingAddressId === "number" ? shippingAddressId : null;
    if (!addressId) {
      setError("Selecione um endereço de entrega.");
      return;
    }
    setError(null);
    setPlacing(true);
    try {
      const order = await createOrder({
        shipping_address_id: addressId,
        shipping_method: "standard_fixed",
        coupon_code: couponCode.trim() || undefined,
        items: items.map((i) => ({
          product_id: Number(i.product.id),
          quantity: i.quantity,
          requires_prescription: Boolean((i.product as Product & { requiresPrescription?: boolean }).requiresPrescription),
        })),
      });
      clearCart();
      router.push(`/checkout/pay/${order.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar pedido. Tente novamente.");
    } finally {
      setPlacing(false);
    }
  }

  if (!user) return null;

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

          {addresses.length === 0 && !error && (
            <div className="mb-6 p-4 bg-warning/10 border border-warning rounded-lg">
              <p className="text-body-m text-green-800">Cadastre um endereço de entrega para continuar.</p>
              <Link href="/account/addresses" className="text-body-m font-medium text-green-700 underline mt-2 inline-block">
                Ir para endereços
              </Link>
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-8">
            {error && <p className="text-body-s text-error font-medium">{error}</p>}

            {addresses.length > 0 && (
              <div>
                <h2 className="text-h6 font-heading text-green-800 mb-4">Endereço de entrega</h2>
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <label key={addr.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shipping_address"
                        value={addr.id}
                        checked={shippingAddressId === addr.id}
                        onChange={() => setShippingAddressId(addr.id)}
                        className="mt-1"
                      />
                      <span className="text-body-m text-green-800">
                        {addr.street}, {addr.number}
                        {addr.complement ? `, ${addr.complement}` : ""} — {addr.district}, {addr.city}/{addr.state} — CEP {addr.postal_code}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {coupons.length > 0 && (
              <div>
                <h2 className="text-h6 font-heading text-green-800 mb-2">Cupom</h2>
                <input
                  type="text"
                  placeholder="Código do cupom"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-body-m w-full max-w-xs"
                />
              </div>
            )}

            <div>
              <h2 className="text-h6 font-heading text-green-800 mb-4">Resumo do pedido</h2>
              <ul className="space-y-4 border-b border-gray-200 pb-6">
                {items.map((item) => (
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
                        {item.quantity} × {formatCurrency(parseFloat(String(item.product.price).replace(/[^0-9.-]+/g, "")) || 0)}
                      </p>
                    </div>
                    <p className="text-body-m font-medium text-green-800 shrink-0">
                      {formatCurrency(getItemSubtotal(item))}
                    </p>
                  </li>
                ))}
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
                Total (estimado)
              </span>
              <span className="text-h5 font-heading text-green-800">{formatCurrency(total)}</span>
            </div>

            <p className="text-body-s text-gray-400">
              O valor final será confirmado na próxima tela. Pagamento via Mercado Pago.
            </p>

            <Button
              type="submit"
              variant="primary"
              colorTheme="green"
              className="w-full h-14 text-green-100"
              disabled={placing || addresses.length === 0}
            >
              {placing ? "Processando…" : "Continuar para pagamento"}
            </Button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
}
