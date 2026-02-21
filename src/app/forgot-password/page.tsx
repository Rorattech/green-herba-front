"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/src/layouts/MainLayout";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { forgotPassword } from "@/src/services/api/auth";

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value?.trim();
    if (!email) {
      setError("Digite seu email.");
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <section className="bg-white min-h-[calc(100vh-180px)] flex flex-col md:flex-row">

        <div className="relative w-full md:w-1/2 h-[300px] md:h-auto overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1532765488483-62ff440ee4fd?q=90&w=1920"
            alt="Green Herba Pharma Life"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="text-white font-heading text-h3 md:text-h2 lg:text-h1 whitespace-nowrap opacity-90">
              Green Herba Pharma &nbsp; Green Herba Pharma &nbsp; Green Herba Pharma
            </h2>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
          <div className="w-full max-w-[440px] space-y-8">
            <div className="space-y-2">
              <h1 className="text-h2 font-heading text-green-800">Esqueceu sua senha?</h1>
              <p className="text-body-m text-green-800/70">
                {success
                  ? "Se existir uma conta com esse email, você receberá um link para redefinir sua senha."
                  : "Digite seu email e enviaremos um link para redefinir sua senha."}
              </p>
            </div>

            {success ? (
              <Link href="/login" className="block">
                <Button variant="primary" colorTheme="green" className="w-full h-14 text-green-100">
                  Voltar para entrar
                </Button>
              </Link>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && <p className="text-body-s text-error font-medium">{error}</p>}
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="seu@email.com"
                  required
                />
                <div className="pt-2">
                  <Button type="submit" variant="primary" colorTheme="green" className="w-full h-14 text-green-100" disabled={loading}>
                    {loading ? "Enviando…" : "Enviar link"}
                  </Button>
                </div>
              </form>
            )}

            <p className="text-[10px] text-gray-400 leading-relaxed">
              Este site é protegido por reCAPTCHA e a
              <a href="#" className="underline mx-1">Política de Privacidade do Google</a> e os
              <a href="#" className="underline mx-1">Termos de Serviço</a> se aplicam.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
