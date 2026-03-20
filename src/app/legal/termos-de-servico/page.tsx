import MainLayout from "@/src/layouts/MainLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de serviço | Green Herba Pharma",
  description: "Condições de uso do site e dos serviços Green Herba Pharma.",
};

export default function TermosServicoPage() {
  return (
    <MainLayout>
      <article className="bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-20 max-w-3xl">
          <h1 className="text-h3 md:text-h2 font-heading text-green-800 mb-8">
            Termos de serviço
          </h1>
          <p className="text-body-s text-green-800/50 mb-10">
            Última atualização: março de 2026 · Texto de exemplo — revise com assessoria jurídica
            antes de publicar.
          </p>
          <div className="space-y-8 text-body-m text-green-800/80 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-h5 font-heading text-green-800">1. Aceitação</h2>
              <p>
                Ao acessar ou usar o site da Green Herba Pharma, você declara ter lido e concordado
                com estes termos. Se não concordar, interrompa o uso dos serviços.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-h5 font-heading text-green-800">2. Uso do site</h2>
              <p>
                Compromete-se a fornecer informações verdadeiras, não utilizar o site para fins
                ilícitos e a respeitar direitos de terceiros e da empresa.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-h5 font-heading text-green-800">3. Produtos e prescrição</h2>
              <p>
                Produtos sujeitos a prescrição médica seguem as regras legais aplicáveis. A venda
                pode depender de validação documental e critérios clínicos definidos pela operação.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-h5 font-heading text-green-800">4. Preços e pagamento</h2>
              <p>
                Preços e condições de pagamento são aqueles exibidos no momento da compra, salvo erro
                manifesto corrigido com comunicação ao cliente.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-h5 font-heading text-green-800">5. Limitação de responsabilidade</h2>
              <p>
                O site é oferecido “no estado em que se encontra”. Na medida permitida pela lei,
                excluímos garantias implícitas e limitamos responsabilidades conforme contrato e
                legislação consumerista.
              </p>
            </section>
          </div>
        </div>
      </article>
    </MainLayout>
  );
}
