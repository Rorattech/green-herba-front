"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MainLayout from "@/src/layouts/MainLayout";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { EyeOff } from "lucide-react";
import { useAuth } from "@/src/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value?.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;
    if (!email) {
      setError("Digite seu email.");
      return;
    }
    if (!password) {
      setError("Digite sua senha.");
      return;
    }
    // Mock: qualquer email/senha loga; depois a API Laravel fará a validação
    const name = email.split("@")[0] || "Usuário";
    login({
      id: `mock-${Date.now()}`,
      email,
      name,
      firstName: name,
      lastName: "",
    });
    router.push("/account");
  }

  return (
    <MainLayout>
      <section className="bg-white min-h-[calc(100vh-180px)] flex flex-col md:flex-row">

        <div className="relative w-full md:w-1/2 h-[300px] md:h-auto overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1532765488483-62ff440ee4fd?q=90&w=1920"
            alt="Terra Health Life"
            fill
            className="object-cover"
            priority
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
              <h1 className="text-h2 font-heading text-green-800">Entrar</h1>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <p className="text-body-s text-error font-medium">{error}</p>
              )}
              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="Digite seu email"
                colorTheme="light"
                required
              />

              <div className="space-y-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  label="Senha"
                  placeholder="Digite sua senha"
                  colorTheme="light"
                  iconRight={<EyeOff size={20} className="cursor-pointer" />}
                  required
                />
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-body-s font-normal text-green-800 underline hover:text-green-700"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  colorTheme="green"
                  className="w-full h-14 text-body-m text-green-100"
                >
                  Entrar
                </Button>

                <Link href="/register" className="block">
                  <Button
                    type="button"
                    variant="primary"
                    colorTheme="pistachio"
                    className="w-full h-14 text-body-m"
                  >
                    Criar uma conta
                  </Button>
                </Link>
              </div>
            </form>

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