"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/src/layouts/MainLayout";
import { Button } from "@/src/components/ui/Button";
import { fetchMe, verifyEmailWithRedirect } from "@/src/services/api/auth";
import { useAuth } from "@/src/contexts/AuthContext";
import { getStoredToken } from "@/src/lib/api-client";
import { isAllowedEmailVerifyRedirectUrl } from "@/src/lib/email-verify-redirect";

type VerifyState = "loading" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const redirectRaw = searchParams.get("redirect");
  const { setUser } = useAuth();
  const [state, setState] = useState<VerifyState>("loading");
  const [message, setMessage] = useState<string>("");
  const [detail, setDetail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!redirectRaw || !redirectRaw.trim()) {
        if (!cancelled) {
          setMessage("Falta o parâmetro do link de verificação.");
          setDetail("Este link está incompleto. Use o link enviado por e-mail ou solicite um novo.");
          setState("error");
        }
        return;
      }

      let decoded: string;
      try {
        decoded = decodeURIComponent(redirectRaw);
      } catch {
        if (!cancelled) {
          setMessage("Link inválido.");
          setDetail(null);
          setState("error");
        }
        return;
      }

      if (!isAllowedEmailVerifyRedirectUrl(decoded)) {
        if (!cancelled) {
          setMessage("Não foi possível validar o link.");
          setDetail("O endereço de verificação não é válido ou não pertence a este site.");
          setState("error");
        }
        return;
      }

      if (!cancelled) setState("loading");

      try {
        const res = await verifyEmailWithRedirect(decoded);
        if (cancelled) return;
        setMessage(res.message);
        setState("success");
        const token = getStoredToken();
        if (token) {
          try {
            const u = await fetchMe();
            if (!cancelled && u) setUser(u);
          } catch {
            // sessão inválida: mantém só a mensagem de sucesso
          }
        }
      } catch (err: unknown) {
        if (cancelled) return;
        setMessage(err instanceof Error ? err.message : "Não foi possível verificar o e-mail.");
        setDetail(null);
        setState("error");
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [redirectRaw, setUser]);

  if (state === "loading") {
    return (
      <div className="w-full max-w-[440px] space-y-4 text-center">
        <p className="text-body-m text-green-800/70">Confirmando seu e-mail…</p>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="w-full max-w-[440px] space-y-8">
        <div className="space-y-2">
          <h1 className="text-h2 font-heading text-green-800">E-mail confirmado</h1>
          <p className="text-body-m text-green-800/70">{message}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="block flex-1">
            <Button variant="primary" colorTheme="pistachio" className="w-full h-14 text-green-800">
              Ir à loja
            </Button>
          </Link>
          <Link href="/login" className="block flex-1">
            <Button variant="primary" colorTheme="green" className="w-full h-14 text-green-100">
              Entrar
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px] space-y-8">
      <div className="space-y-2">
        <h1 className="text-h2 font-heading text-green-800">Não foi possível confirmar</h1>
        <p className="text-body-m text-green-800/70">{message}</p>
        {detail && <p className="text-body-s text-error font-medium">{detail}</p>}
      </div>
      <Link href="/" className="block">
        <Button variant="primary" colorTheme="green" className="w-full h-14 text-green-100">
          Voltar ao início
        </Button>
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <MainLayout>
      <section className="bg-white min-h-[calc(100vh-180px)] flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/2 h-[300px] md:h-auto overflow-hidden">
          <Image src="/images/about-3.png" alt="Green Herba Pharma" fill className="object-cover" />
          <div className="absolute inset-0 bg-green-950/35" aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="text-white font-heading text-h3 md:text-h2 lg:text-h1 whitespace-nowrap opacity-90">
              Green Herba Pharma &nbsp; Green Herba Pharma
            </h2>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
          <Suspense fallback={<p className="text-body-m text-green-800/70">Carregando…</p>}>
            <VerifyEmailContent />
          </Suspense>
        </div>
      </section>
    </MainLayout>
  );
}
