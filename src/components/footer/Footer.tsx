import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Youtube } from 'lucide-react';

export const Footer = () => (
    <footer className="bg-green-800 text-green-100 px-8 py-10 md:py-16 font-sans">
        <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

                <div className="md:col-span-4 space-y-6">
                    <Link href="/" className="relative block w-[180px] h-[40px]">
                        <Image
                            src="/assets/logo-footer.png"
                            alt="Green Herba Pharma"
                            width={327}
                            height={90}
                            className="object-contain"
                        />
                    </Link>

                    <p className="text-green-100 text-body-m font-body font-medium">Junte-se à nossa newsletter e economize 10% no seu primeiro pedido</p>

                    <p className="text-[10px] text-green-100/60">
                        Ao se inscrever, você concorda com nossos <a href="#" className="underline">Termos de serviço</a> e <a href="#" className="underline">Política de privacidade</a>.
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
                        <ul className="space-y-4 text-green-100 text-body-m font-body font-medium">
                            <li className="hover:text-green-100 cursor-pointer transition-colors">Ver todos</li>
                            <li className="hover:text-green-100 cursor-pointer transition-colors">Mais vendidos</li>
                            <li className="hover:text-green-100 cursor-pointer transition-colors">Essenciais diários</li>
                            <li className="hover:text-green-100 cursor-pointer transition-colors">Suporte direcionado</li>
                            <li className="hover:text-green-100 cursor-pointer transition-colors">Bem-estar a longo prazo</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-green-100 text-body-l font-body font-bold mb-6">Informações</h4>
                        <ul className="space-y-4 text-green-100 text-body-m font-body font-medium">
                            <li className="hover:text-green-100 cursor-pointer transition-colors">Blog</li>
                            <li className="hover:text-green-100 cursor-pointer transition-colors">Sobre</li>
                            <li className="hover:text-green-100 cursor-pointer transition-colors">Perguntas frequentes</li>
                            <li className="hover:text-green-100 cursor-pointer transition-colors">Contato</li>
                            <li className="hover:text-green-100 cursor-pointer transition-colors">Entrar</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-green-100 text-body-l font-body font-bold mb-6">Legal</h4>
                        <ul className="space-y-4 text-green-100 text-body-m font-body font-medium">
                            <li className="hover:text-green-100 cursor-pointer transition-colors">Política de privacidade</li>
                            <li className="hover:text-green-100 cursor-pointer transition-colors">Termos de serviço</li>
                            <li className="hover:text-green-100 cursor-pointer transition-colors">Configurações de cookies</li>
                            <li className="hover:text-green-100 cursor-pointer transition-colors">Política de frete</li>
                            <li className="hover:text-green-100 cursor-pointer transition-colors">Iniciar devolução</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-green-600 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-green-100 text-body-m font-body font-medium">© Green Herba Pharma 2026</p>

                <div className="flex gap-2 items-center opacity-80">
                    <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] text-black font-bold">VISA</div>
                    <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] text-black font-bold">MC</div>
                    <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] text-black font-bold">AMEX</div>
                    <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[8px] text-black font-bold">PAY</div>
                </div>
            </div>
        </div>
    </footer>
);