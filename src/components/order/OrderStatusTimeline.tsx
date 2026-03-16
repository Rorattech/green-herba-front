"use client";

import {
  CreditCard,
  CheckCircle2,
  Package,
  Truck,
  Home,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/src/utils/cn";

export type TimelineStepKey =
  | "pending_payment"
  | "paid"
  | "processing"
  | "ready_to_ship"
  | "shipped"
  | "delivered";

/** Ordem dos status no fluxo. Prescrição é aprovada antes do pedido; não há mais status de prescrição no pedido. */
const STATUS_ORDER: Record<string, number> = {
  pending_payment: 0,
  pending: 0,
  paid: 1,
  processing: 2,
  ready_to_ship: 2,
  shipped: 3,
  delivered: 4,
};

const TIMELINE_STEPS: { key: TimelineStepKey; label: string; icon: LucideIcon }[] = [
  { key: "pending_payment", label: "Pagamento pendente", icon: CreditCard },
  { key: "paid", label: "Pago", icon: CheckCircle2 },
  { key: "ready_to_ship", label: "Pronto para envio", icon: Package },
  { key: "shipped", label: "Enviado", icon: Truck },
  { key: "delivered", label: "Entregue", icon: Home },
];

interface OrderStatusTimelineProps {
  /** Status atual do pedido (ex: "pending_payment", "paid", "shipped"). */
  currentStatus: string;
  className?: string;
}

export function OrderStatusTimeline({ currentStatus, className }: OrderStatusTimelineProps) {
  const isCancelled = currentStatus === "cancelled";
  const currentIndex = isCancelled ? -1 : (STATUS_ORDER[currentStatus] ?? -1);

  if (isCancelled) {
    return (
      <div className={cn("rounded-lg border border-gray-200 bg-gray-50 p-4", className)}>
        <div className="flex items-center justify-center gap-2 text-body-m text-gray-600">
          <XCircle size={20} className="shrink-0 text-error" />
          <span className="font-medium">Pedido cancelado</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white p-4 md:p-6", className)}>
      <h3 className="text-h6 font-heading text-green-800 mb-4">Status do pedido</h3>
      <div className="overflow-x-auto pb-2 -mx-1">
        <ol className="flex items-start gap-0 min-w-max mx-auto w-fit">
          {TIMELINE_STEPS.map((step, index) => {
            const stepIndex = index;
            const isCompleted =
              currentIndex > stepIndex ||
              (currentIndex === stepIndex && currentStatus === "delivered");
            const isCurrent = currentIndex === stepIndex && currentStatus !== "delivered";
            const isPending = currentIndex < stepIndex;
            const Icon = step.icon;
            const isLast = index === TIMELINE_STEPS.length - 1;

            return (
              <li key={step.key} className="flex items-start shrink-0">
                <div className="flex flex-col items-center shrink-0 px-0.5 md:px-1" style={{ minWidth: "72px" }}>
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      isCompleted && "border-green-600 bg-green-600 text-white",
                      isCurrent && "border-green-600 bg-green-50 text-green-700",
                      isPending && "border-gray-200 bg-gray-100 text-gray-400"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={20} className="text-white" aria-hidden />
                    ) : (
                      <Icon size={20} aria-hidden />
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-center text-[10px] font-medium leading-tight md:text-body-s",
                      isCompleted && "text-green-700",
                      isCurrent && "text-green-800",
                      isPending && "text-gray-400"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {/* Conector à direita (único entre este e o próximo) */}
                {!isLast && (
                  <div
                    className={cn(
                      "mt-5 h-0.5 w-3 shrink-0 rounded-full md:w-8",
                      currentIndex > index ? "bg-green-600" : "bg-gray-200"
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
