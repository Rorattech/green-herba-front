import MainLayout from "@/src/layouts/MainLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de frete | Green Herba Pharma",
  description: "Prazos, regiões atendidas e condições de envio.",
};

export default function PoliticaFretePage() {
  return (
    <MainLayout>
      <article className="bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-20 max-w-3xl">
          <h1 className="text-h3 md:text-h2 font-heading text-green-800 mb-8">
            Política de frete
          </h1>
          <p className="text-body-s text-green-800/50 mb-10">
            Última atualização: março de 2026 · Texto de exemplo — ajuste valores, prazos e áreas de
            cobertura conforme a operação real.
          </p>
          <div className="space-y-8 text-body-m text-green-800/80 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-h5 font-heading text-green-800">1. Áreas de entrega</h2>
              <p>
                Realizamos envios para diversas localidades do Brasil. Algumas regiões podem ter
                prazo ou valor diferenciado; o cálculo exibido no checkout prevalece para cada pedido.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-h5 font-heading text-green-800">2. Prazos</h2>
              <p>
                O prazo informado é estimado em dias úteis após confirmação do pagamento e separação
                do pedido. Eventos fora do nosso controle (clima, greves, feriados) podem alterar
                entregas.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-h5 font-heading text-green-800">3. Frete grátis</h2>
              <p>
                Campanhas de frete grátis podem ser aplicadas por valor mínimo de compra ou por
                período promocional, quando indicado no site ou no carrinho.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-h5 font-heading text-green-800">4. Rastreamento</h2>
              <p>
                Quando disponível, enviaremos código de rastreamento por e-mail ou na área “Meus
                pedidos” da sua conta.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-h5 font-heading text-green-800">5. Recebimento</h2>
              <p>
                Verifique os dados do endereço antes de finalizar a compra. Tentativas de entrega
                malsucedidas podem gerar nova cobrança de frete ou devolução do pedido à origem,
                conforme política da transportadora.
              </p>
            </section>
          </div>
        </div>
      </article>
    </MainLayout>
  );
}
