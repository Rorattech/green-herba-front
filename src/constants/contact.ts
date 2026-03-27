/** E-mail de atendimento (substitua via NEXT_PUBLIC_SUPPORT_EMAIL no .env). */
export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "contato@green-herba-pharma.com.br";

export function mailtoReturnsHref(): string {
  const subject = encodeURIComponent("Solicitação de devolução — Green Herba Pharma");
  const body = encodeURIComponent(
    "Olá,\n\nGostaria de iniciar uma devolução.\n\nNúmero do pedido:\nMotivo:\n\nObrigado(a)."
  );
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
}
