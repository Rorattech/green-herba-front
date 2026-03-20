import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import { mailtoReturnsHref } from '@/src/constants/contact';

const footerLinkClass =
  'text-green-100 text-body-m font-body font-medium hover:text-white transition-colors inline-block';

export const Footer = () => (
  <footer className="bg-green-800 text-green-100 px-8 py-10 md:py-16 font-sans">
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        <div className="md:col-span-4 space-y-6">
          <Link href="/" className="relative block w-45 h-10">
            <Image
              src="/assets/logo-footer.png"
              alt="Green Herba Pharma"
              width={327}
              height={90}
              className="object-contain"
            />
          </Link>

          <p className="text-green-100 text-body-m font-body font-medium">
            Faça parte da nossa comunidade, receba conteúdos exclusivos e garanta 5% no seu
            primeiro pedido.
          </p>

          <p className="text-[10px] text-green-100/60">
            Ao se inscrever, você concorda com nossos{' '}
            <Link href="/legal/termos-de-servico" className="underline hover:text-green-100">
              Termos de serviço
            </Link>{' '}
            e{' '}
            <Link href="/legal/politica-de-privacidade" className="underline hover:text-green-100">
              Política de privacidade
            </Link>
            .
          </p>

          <div className="flex gap-4 pt-4">
            <Instagram size={20} className="cursor-pointer hover:text-green-100/70" />
            <Facebook size={20} className="cursor-pointer hover:text-green-100/70" />
            <Youtube size={20} className="cursor-pointer hover:text-green-100/70" />
          </div>
        </div>

        <div className="md:col-start-7 md:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-green-100 text-body-l font-body font-bold mb-6">Comprar</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/products" className={footerLinkClass}>
                  Ver todos
                </Link>
              </li>
              <li>
                <Link href="/products?sort=bestsellers" className={footerLinkClass}>
                  Mais vendidos
                </Link>
              </li>
              <li>
                <Link href="/login" className={footerLinkClass}>
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-green-100 text-body-l font-body font-bold mb-6">Informações</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className={footerLinkClass}>
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/about#perguntas-frequentes" className={footerLinkClass}>
                  Perguntas frequentes
                </Link>
              </li>
              <li>
                <Link href="/contato" className={footerLinkClass}>
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-green-100 text-body-l font-body font-bold mb-6">Legal</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/legal/politica-de-privacidade" className={footerLinkClass}>
                  Política de privacidade
                </Link>
              </li>
              <li>
                <Link href="/legal/politica-de-frete" className={footerLinkClass}>
                  Política de frete
                </Link>
              </li>
              <li>
                <a href={mailtoReturnsHref()} className={footerLinkClass}>
                  Iniciar devolução
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-green-600 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-green-100 text-body-m font-body font-medium">© Green Herba Pharma 2026</p>

        <div className="flex gap-2 items-center opacity-80">
          <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] text-black font-bold">
            VISA
          </div>
          <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] text-black font-bold">
            MC
          </div>
          <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] text-black font-bold">
            AMEX
          </div>
          <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] text-black font-bold">
            PAY
          </div>
        </div>
      </div>
    </div>
  </footer>
);
