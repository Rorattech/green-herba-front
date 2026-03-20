"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/src/layouts/MainLayout";
import { Button } from "@/src/components/ui/Button";
import { getPaymentPreference, getOrder, processPayment } from "@/src/services/api/orders";
import { initMercadoPago, Payment, StatusScreen } from "@mercadopago/sdk-react";
import type { ProcessPaymentBody, PayerAddress } from "@/src/services/api/orders";

export default function CheckoutPayPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const orderId = params?.orderId ? Number(params.orderId) : NaN;
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [mpReady, setMpReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<{ orderNumber: string } | null>(null);
  const [paymentPending, setPaymentPending] = useState<{
    orderNumber: string;
    paymentMethodId: string;
    paymentId: string;
    qrCodeBase64?: string;
    qrCode?: string;
    ticketUrl?: string;
    externalResourceUrl?: string;
  } | null>(null);
  /** paymentId de um pagamento PIX já criado anteriormente (ex.: vindo de Meus pedidos) */
  const [existingPixPaymentId, setExistingPixPaymentId] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(orderId)) {
      setLoading(false);
      setError("Pedido inválido.");
      return;
    }
    Promise.all([
      getPaymentPreference(orderId),
      getOrder(orderId),
    ])
      .then(([pref, order]) => {
        setPreferenceId(pref.preference_id);
        setPublicKey(pref.public_key);
        setAmount(Number(order.total_amount) || 0);

        // Se já existir um pagamento PIX pendente para este pedido (vindo de "Meus pedidos"),
        // usamos diretamente o Status Screen do Mercado Pago em vez de voltar para a escolha de método.
        const overallMethod = (order.payment_method ?? "").toLowerCase();
        let pixId: string | null = null;
        if (overallMethod === "pix" && Array.isArray(order.payments)) {
          const pendingPix = order.payments.find(
            (p) =>
              p.payment_gateway === "mercadopago" &&
              typeof p.status === "string" &&
              p.status.toLowerCase().startsWith("pending") &&
              p.gateway_payment_id
          );
          if (pendingPix?.gateway_payment_id) {
            pixId = String(pendingPix.gateway_payment_id);
          }
        }
        setExistingPixPaymentId(pixId);

        if (pref.public_key) {
          initMercadoPago(pref.public_key);
          setMpReady(true);
        }
      })
      .catch(() => {
        setError("Não foi possível carregar o pagamento. Tente novamente ou pague depois em Meus pedidos.");
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleSubmit = useCallback(
    async (param: unknown) => {
      if (!Number.isFinite(orderId)) return;
      const p = param as {
        paymentType?: string;
        selectedPaymentMethod?: string;
        formData?: Record<string, unknown>;
      };
      const fd = p?.formData ?? {};
      const paymentType = (p?.paymentType ?? p?.selectedPaymentMethod ?? "").toLowerCase();
      const isCard = paymentType.includes("credit") || paymentType.includes("debit") || paymentType === "card";

      const rawAmount = Number(fd.transaction_amount ?? fd.transactionAmount ?? amount);
      const transactionAmount = Math.round(rawAmount * 100) / 100;

      const payer = fd.payer as { email?: string; first_name?: string; firstName?: string; identification?: { type: string; number: string } } | undefined;
      const payerEmail = String(payer?.email ?? "").trim();

      if (transactionAmount <= 0) {
        setError("Valor inválido. Recarregue a página e tente novamente.");
        return;
      }
      if (!payerEmail) {
        setError("O e-mail do comprador é obrigatório.");
        return;
      }

      const token = String(fd.token ?? "").trim();
      if (isCard && !token) {
        setError("Dados do cartão não foram gerados. Tente preencher novamente.");
        return;
      }

      const paymentMethodId = String(fd.payment_method_id ?? fd.paymentMethodId ?? "").trim();
      if (!paymentMethodId) {
        setError("Método de pagamento não identificado. Tente novamente.");
        return;
      }

      const installments = Math.max(1, Math.floor(Number(fd.installments ?? 1)));

      const body: ProcessPaymentBody = {
        payment_method_id: paymentMethodId,
        transaction_amount: transactionAmount,
        installments,
        payer: {
          email: payerEmail,
          first_name: payer?.first_name ?? payer?.firstName,
          last_name: (payer as { last_name?: string })?.last_name,
          identification: payer?.identification,
          address: (payer as { address?: PayerAddress })?.address,
        },
        order_id: orderId,
        payment_type: p?.paymentType ?? p?.selectedPaymentMethod,
      };
      if (isCard && token) body.token = token;
      if (fd.issuer_id != null) body.issuer_id = String(fd.issuer_id);
      if (fd.issuerId != null) body.issuer_id = String(fd.issuerId);

      try {
        const result = await processPayment(orderId, body);
        const status = (result.status ?? "").toLowerCase();
        if (status === "approved" || status === "paid") {
          setPaymentSuccess({ orderNumber: result.order_number });
        } else if (status === "pending" || status === "in_process") {
          setPaymentPending({
            orderNumber: result.order_number,
            paymentMethodId,
            paymentId: String(result.payment_id),
            qrCodeBase64: result.qr_code_base64,
            qrCode: result.qr_code,
            ticketUrl: result.ticket_url,
            externalResourceUrl: result.external_resource_url,
          });
        } else {
          setPaymentSuccess({ orderNumber: result.order_number });
        }
      } catch (err) {
        throw err;
      }
    },
    [orderId, amount]
  );

  if (!Number.isFinite(orderId)) {
    return (
      <MainLayout>
        <section className="bg-white min-h-[calc(100vh-180px)] flex items-center justify-center p-8">
          <div className="max-w-[440px] text-center space-y-6">
            <p className="text-body-m text-error">Pedido inválido.</p>
            <Link href="/account/orders"><Button variant="primary" colorTheme="green" className="text-green-100">Meus pedidos</Button></Link>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <section className="bg-white min-h-[calc(100vh-180px)] flex items-center justify-center p-8">
          <div className="max-w-[440px] text-center space-y-6">
            <h1 className="text-h4 font-heading text-green-800">Pagamento</h1>
            <p className="text-body-m text-green-800/70">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/account/orders/${orderId}`}>
                <Button variant="primary" colorTheme="green" className="w-full sm:w-auto text-green-100">Ver pedido</Button>
              </Link>
              <Link href="/account/orders">
                <Button variant="primary" colorTheme="pistachio" className="w-full sm:w-auto">Meus pedidos</Button>
              </Link>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (paymentSuccess) {
    return (
      <MainLayout>
        <section className="bg-white min-h-[calc(100vh-180px)] flex items-center justify-center p-8">
          <div className="max-w-[440px] text-center space-y-6">
            <h1 className="text-h4 font-heading text-green-800">Pagamento realizado</h1>
            <p className="text-body-m text-green-800/70">
              Pedido #{paymentSuccess.orderNumber} pago com sucesso. Você receberá a confirmação por email.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/account/orders">
                <Button variant="primary" colorTheme="green" className="w-full sm:w-auto text-green-100">Ver meus pedidos</Button>
              </Link>
              <Link href="/products">
                <Button variant="primary" colorTheme="pistachio" className="w-full sm:w-auto">Continuar comprando</Button>
              </Link>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  // Se já temos um paymentId (criado agora ou antes), mostramos apenas o Status Screen oficial do MP.
  const activePaymentId = paymentPending?.paymentId ?? existingPixPaymentId ?? null;

  if (activePaymentId) {
    return (
      <MainLayout>
        <section className="bg-white min-h-[calc(100vh-180px)] flex items-center justify-center p-8">
          <div className="max-w-[540px] w-full space-y-6">
            <h1 className="text-h4 font-heading text-green-800 text-center">Acompanhe seu pagamento</h1>
            <p className="text-body-m text-green-800/70 text-center">
              Esta tela mostra o Status Screen Brick oficial do Mercado Pago para o pagamento criado.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <StatusScreen
                initialization={{ paymentId: activePaymentId }}
                onReady={() => {
                  // opcional: esconder loading próprio
                }}
                onError={(error) => {
                  console.error("Status Screen Brick error", error);
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href={`/account/orders/${orderId}`}>
                <Button variant="secondary" colorTheme="green" className="w-full sm:w-auto">Ver pedido</Button>
              </Link>
              <Link href="/account/orders">
                <Button variant="primary" colorTheme="pistachio" className="w-full sm:w-auto">Meus pedidos</Button>
              </Link>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (loading || !publicKey || !mpReady) {
    return (
      <MainLayout>
        <section className="bg-white min-h-[calc(100vh-180px)] flex items-center justify-center p-8">
          <div className="max-w-[440px] text-center space-y-6">
            <h1 className="text-h4 font-heading text-green-800">Carregando…</h1>
            <p className="text-body-m text-green-800/70">Preparando o checkout.</p>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="bg-white min-h-[calc(100vh-180px)] py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-2xl">
          <h1 className="text-h4 font-heading text-green-800 mb-6">Escolha a forma de pagamento</h1>
          <p className="text-body-m text-green-800/70 mb-8">
            Pagamento seguro pelo Mercado Pago.
          </p>
          <div className="min-h-[400px]">
            <Payment
              initialization={{
                amount,
                preferenceId: preferenceId ?? undefined,
              }}
              customization={{
                paymentMethods: {
                  // Desabilita boleto: array vazio em vez de "all"/"bolbradesco"
                  ticket: [],
                  bankTransfer: "all",
                  creditCard: "all",
                  debitCard: "all",
                  prepaidCard: "all",
                  mercadoPago: "all",
                },
              }}
              locale="pt"
              onSubmit={handleSubmit}
              onReady={() => { }}
              onError={(err) => {
                setError(err?.message ?? "Erro no checkout.");
              }}
            />
          </div>
          <div className="mt-6">
            <Link href={`/account/orders/${orderId}`} className="text-body-s text-green-800 underline">
              ← Voltar ao pedido
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
