import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/src/layouts/MainLayout";
import { ContactForm } from "@/src/components/contact/ContactForm";
import { SUPPORT_EMAIL } from "@/src/constants/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato | Green Herba Pharma",
  description: "Fale com a Green Herba Pharma.",
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1532765488483-62ff440ee4fd?q=90&w=1920";

export default function ContatoPage() {
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Contato — Green Herba Pharma")}`;

  return (
    <MainLayout>
      <section className="bg-white min-h-[calc(100vh-180px)] flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/2 h-[280px] sm:h-[320px] md:h-auto md:min-h-[min(100%,640px)] overflow-hidden shrink-0">
          <Image
            src={HERO_IMAGE}
            alt="Natureza e bem-estar — Green Herba Pharma"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-green-950/25" aria-hidden />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
            <h2 className="text-white font-heading text-h3 md:text-h2 lg:text-h1 whitespace-nowrap opacity-90 text-center drop-shadow-md">
              Green Herba Pharma &nbsp; Green Herba Pharma &nbsp; Green Herba Pharma
            </h2>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
          <div className="w-full max-w-[440px] space-y-8">
            <div className="space-y-3">
              <h1 className="text-h2 font-heading text-green-800">Contato</h1>
            </div>

            <div className="space-y-2">
              <h2 className="text-h5 font-heading text-green-800">Enviar mensagem</h2>
              <ContactForm />
            </div>

            <p className="text-body-s text-green-800/60">
              Já é cliente?{" "}
              <Link href="/login" className="font-medium text-green-800 underline hover:text-green-700">
                Entrar na conta
              </Link>
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
