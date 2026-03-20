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
import { ApiError } from "@/src/lib/api-client";
import { formatCurrency } from "@/src/utils/format";
import type { Address } from "@/src/services/api/addresses";
import type { ApiCoupon } from "@/src/types/api-resources";
import type { Product } from "@/src/types/product";

const SHIPPING_FREE_THRESHOLD = 50;
const SHIPPING_COST = 0;

function getItemSubtotal(item: { product: Product; quantity: number }): number {
  const price = parseFloat(String(item.product.price).replace(/[^0-9.-]+/g, "")) || 0;
  return price * item.quantity;
}

/**
 * Pré-valida o cupom contra a lista (GET /api/coupons) e calcula o desconto estimado.
 * A validação definitiva é sempre no backend ao criar o pedido (POST /api/checkout).
 */
function validateCouponAgainstList(
  coupons: ApiCoupon[],
  code: string,
  subtotal: number
): { valid: true; discountAmount: number } | { valid: false; error: string } {
  const trimmed = code.trim();
  if (!trimmed) return { valid: false, error: "Digite o código do cupom." };

  const coupon = coupons.find((c) => c.code.trim().toUpperCase() === trimmed.toUpperCase());
  if (!coupon) return { valid: false, error: "O cupom informado é inválido." };

  if (coupon.remaining_usage != null && coupon.remaining_usage <= 0) {
    return { valid: false, error: "Este cupom não possui mais usos disponíveis." };
  }

  const minOrder = coupon.min_order_amount ? parseFloat(coupon.min_order_amount) : null;
  if (minOrder != null && !Number.isNaN(minOrder) && subtotal < minOrder) {
    return { valid: false, error: `Pedido mínimo para este cupom: ${formatCurrency(minOrder)}` };
  }

  const discountValue = parseFloat(coupon.discount_value) || 0;
  let discountAmount = 0;
  if (coupon.discount_type === "percentage") {
    discountAmount = (subtotal * discountValue) / 100;
    const maxDiscount = coupon.max_discount ? parseFloat(coupon.max_discount) : null;
    if (maxDiscount != null && !Number.isNaN(maxDiscount)) {
      discountAmount = Math.min(discountAmount, maxDiscount);
    }
  } else {
    discountAmount = Math.min(discountValue, subtotal);
  }
  discountAmount = Math.round(discountAmount * 100) / 100;

  return { valid: true, discountAmount };
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [coupons, setCoupons] = useState<ApiCoupon[]>([]);
  const [shippingAddressId, setShippingAddressId] = useState<number | "">("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponDiscount, setAppliedCouponDiscount] = useState<number | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = getTotalPrice();
  const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_COST;
  const discount = appliedCouponDiscount ?? 0;
  const total = Math.max(0, subtotal + shipping - discount);

  function handleApplyCoupon() {
    const code = couponCode.trim();
    if (!code) return;
    setCouponError(null);
    if (coupons.length === 0) {
      setCouponError("Lista de cupons ainda não carregada. O cupom será validado ao finalizar.");
      return;
    }
    const result = validateCouponAgainstList(coupons, code, subtotal);
    if (result.valid) {
      setAppliedCouponDiscount(result.discountAmount);
    } else {
      setCouponError(result.error);
      setAppliedCouponDiscount(null);
    }
  }

  function handleRemoveCoupon() {
    setCouponCode("");
    setAppliedCouponDiscount(null);
    setCouponError(null);
  }

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
          const firstMissing = itemsRequiringPrescription.find((i) => !approvedIds.has(Number(i.product.id)));
          if (firstMissing) {
            const productId = Number(firstMissing.product.id);
            router.replace(`/account/prescriptions?missing_prescription=1&product_id=${productId}`);
          }
        })
        .catch(() => { });
    }
    getAddresses()
      .then((list) => {
        setAddresses(list);
        const defaultShipping = list.find((a) => a.is_default_shipping) ?? list[0];
        if (defaultShipping) setShippingAddressId(defaultShipping.id);
        else if (list.length === 1) setShippingAddressId(list[0].id);
      })
      .catch(() => setError("Erro ao carregar endereços."));
    getCoupons().then(setCoupons).catch(() => { });
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
        shipping_method: "entrega_propria",
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
      // 422 pode vir com errors.coupon_code ou só message (ex.: success: false, message: "Invalid or expired coupon")
      const msg =
        err instanceof ApiError
          ? (err.errors?.coupon_code?.[0] ?? err.message)
          : err instanceof Error
            ? err.message
            : "Erro ao criar pedido. Tente novamente.";
      setError(msg);
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
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-3xl">
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

            <div>
              <h2 className="text-h6 font-heading text-green-800 mb-2">Cupom</h2>
              {/* {coupons.length > 0 && (
                <ul className="mb-3 space-y-2">
                  {coupons.map((c) => (
                    <li key={c.code} className="text-body-s text-green-800/80">
                      <span className="font-mono font-medium">{c.code}</span>
                      {c.description && ` — ${c.description}`}
                      {c.remaining_usage != null && (
                        <span className="text-gray-500"> ({c.remaining_usage} usos restantes)</span>
                      )}
                    </li>
                  ))}
                </ul>
              )} */}
              {appliedCouponDiscount != null && appliedCouponDiscount > 0 ? (
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-body-m font-medium text-green-800">
                    Cupom <span className="font-mono">{couponCode}</span> aplicado. Desconto: {formatCurrency(appliedCouponDiscount)}
                  </span>
                  <Button
                    type="button"
                    variant="primary"
                    colorTheme="pistachio"
                    className="text-body-s"
                    onClick={handleRemoveCoupon}
                  >
                    Remover
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="Código do cupom"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setAppliedCouponDiscount(null);
                      setCouponError(null);
                      if (error) setError(null);
                    }}
                    className="border border-gray-300 rounded px-3 py-2 text-body-m w-full max-w-[200px]"
                  />
                  <Button
                    type="button"
                    variant="primary"
                    colorTheme="pistachio"
                    className="text-body-s"
                    disabled={!couponCode.trim()}
                    onClick={handleApplyCoupon}
                  >
                    Aplicar
                  </Button>
                </div>
              )}
              {couponError && <p className="mt-2 text-body-s text-error font-medium">{couponError}</p>}
            </div>

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
              {discount > 0 && (
                <div className="flex justify-between text-body-m text-green-700">
                  <span>Desconto (cupom)</span>
                  <span className="font-medium">-{formatCurrency(discount)}</span>
                </div>
              )}
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
