import MainLayout from "@/src/layouts/MainLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidade | Green Herba Pharma",
  description: "Como tratamos seus dados pessoais na Green Herba Pharma.",
};

export default function PoliticaPrivacidadePage() {
  return (
    <MainLayout>
      <article className="bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-20 max-w-3xl">
          <h1 className="text-h3 md:text-h2 font-heading text-green-800 mb-8">
            Política de privacidade
          </h1>
          <p className="text-body-s text-green-800/50 mb-10">
            Última atualização: março de 2026 · Texto de exemplo — substitua pelo conteúdo jurídico
            definitivo.
          </p>
          <div className="space-y-8 text-body-m text-green-800/80 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-h5 font-heading text-green-800">1. Quem somos</h2>
              <p>
                A Green Herba Pharma (“nós”) respeita a sua privacidade. Este documento descreve, de
                forma resumida, como coletamos, usamos e protegemos informações pessoais quando você
                utiliza nosso site e serviços.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-h5 font-heading text-green-800">2. Dados que podemos coletar</h2>
              <p>
                Exemplos: nome, e-mail, telefone, endereço de entrega, histórico de pedidos, dados de
                navegação (cookies) e informações necessárias para processar pagamentos com
                segurança, sempre em conformidade com a legislação aplicável.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-h5 font-heading text-green-800">3. Finalidades</h2>
              <p>
                Utilizamos seus dados para criar e gerenciar sua conta, entregar produtos, prestar
                suporte, enviar comunicações sobre pedidos e — quando permitido — marketing. Também
                podemos usar dados agregados para melhorar o site e a experiência de compra.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-h5 font-heading text-green-800">4. Compartilhamento</h2>
              <p>
                Podemos compartilhar dados com prestadores de serviço (ex.: logística, pagamentos,
                hospedagem) estritamente para operar o negócio, sob obrigações contratuais de
                confidencialidade e segurança.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-h5 font-heading text-green-800">5. Seus direitos</h2>
              <p>
                Você pode solicitar acesso, correção, anonimização ou eliminação de dados, conforme a
                LGPD e demais leis. Entre em contato pelos canais indicados no site para exercer seus
                direitos.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-h5 font-heading text-green-800">6. Contato</h2>
              <p>
                Dúvidas sobre privacidade podem ser enviadas ao e-mail de atendimento disponível na
                página de contato.
              </p>
            </section>
          </div>
        </div>
      </article>
    </MainLayout>
  );
}
