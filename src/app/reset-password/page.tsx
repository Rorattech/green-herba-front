"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/src/layouts/MainLayout";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { resetPassword } from "@/src/services/api/auth";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") ?? "";
  const tokenFromUrl = searchParams.get("token") ?? "";
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value?.trim();
    const token = (form.elements.namedItem("token") as HTMLInputElement)?.value?.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;
    const password_confirmation = (form.elements.namedItem("password_confirmation") as HTMLInputElement)?.value;
    if (!email || !token || !password || !password_confirmation) {
      setError("Preencha todos os campos.");
      return;
    }
    if (password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }
    if (password !== password_confirmation) {
      setError("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ email, token, password, password_confirmation });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao redefinir senha. Verifique o link e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-[440px] space-y-8">
        <div className="space-y-2">
          <h1 className="text-h2 font-heading text-green-800">Senha alterada</h1>
          <p className="text-body-m text-green-800/70">Sua senha foi redefinida. Agora você pode entrar com a nova senha.</p>
        </div>
        <Link href="/login" className="block">
          <Button variant="primary" colorTheme="green" className="w-full h-14 text-green-100">
            Ir para entrar
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px] space-y-8">
      <div className="space-y-2">
        <h1 className="text-h2 font-heading text-green-800">Nova senha</h1>
        <p className="text-body-m text-green-800/70">Digite e confirme sua nova senha (mínimo 8 caracteres).</p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && <p className="text-body-s text-error font-medium">{error}</p>}
        <input type="hidden" name="token" value={tokenFromUrl} />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="seu@email.com"
          defaultValue={emailFromUrl}
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Nova senha"
          placeholder="Mínimo 8 caracteres"
          showPasswordToggle
          required
          minLength={8}
        />
        <Input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          label="Confirmar nova senha"
          placeholder="Repita a nova senha"
          showPasswordToggle
          required
          minLength={8}
        />
        <Button type="submit" variant="primary" colorTheme="green" className="w-full h-14 text-green-100" disabled={loading}>
          {loading ? "Salvando…" : "Salvar nova senha"}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <MainLayout>
      <section className="bg-white min-h-[calc(100vh-180px)] flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/2 h-[300px] md:h-auto overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1532765488483-62ff440ee4fd?q=90&w=1920"
            alt="Green Herba Pharma"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="text-white font-heading text-h3 md:text-h2 lg:text-h1 whitespace-nowrap opacity-90">
              Green Herba Pharma &nbsp; Green Herba Pharma
            </h2>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
          <Suspense fallback={<p className="text-body-m text-green-800/70">Carregando…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </section>
    </MainLayout>
  );
}
