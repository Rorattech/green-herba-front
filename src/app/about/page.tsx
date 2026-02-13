"use client";

import Image from "next/image";
import MainLayout from "@/src/layouts/MainLayout";
import { Button } from "@/src/components/ui/Button";
import { Check } from "lucide-react";
import { TextAccordion } from "@/src/components/ui/TextAccordion";
import { SatisfiedCustomers } from "@/src/components/satisfied-customers/SatisfiedCustomers";
import Link from "next/link";

export default function AboutPage() {
    return (
        <MainLayout>
            <section className="flex flex-col md:flex-row min-h-[80vh] bg-white">
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-20 lg:p-32 space-y-6">
                    <SatisfiedCustomers variant="content" />
                    <span className="text-[12px] font-normal uppercase tracking-widest text-gray-500">Nossa abordagem</span>
                    <h1 className="text-h3 md:text-h1 font-heading text-green-800 leading-tight">
                        Bem-estar construído pela consistência
                    </h1>
                    <p className="text-body-m text-green-800/70 max-w-md">
                        A Terra Health nasceu de uma ideia simples: bem-estar a longo prazo não é sobre extremos. É sobre pequenos hábitos repetíveis que se encaixam naturalmente no dia a dia.
                    </p>
                    <Link href="/products">
                        <Button variant="primary" colorTheme="green" className="w-fit px-8 h-12">
                            Comprar suplementos
                        </Button>
                    </Link>
                </div>
                <div className="w-full md:w-1/2 relative h-[400px] md:h-auto">
                    <Image
                        src="https://images.unsplash.com/photo-1625188770425-bb118b81eb4e?q=80&w=1200"
                        alt="Textura de folha natural"
                        fill
                        className="object-cover"
                    />
                </div>
            </section>

            <div className="bg-green-200 py-4 overflow-hidden border-y border-green-200">
                <div className="container mx-auto flex flex-wrap justify-center md:justify-between gap-6 px-4">
                    {["SAÚDE DO DIA A DIA, SIMPLIFICADA", "FEITO PARA USO DIÁRIO", "FORMULADO COM CUIDADO", "FEITO PARA ROTINAS DE LONGO PRAZO"].map((text, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-green-800 tracking-[0.2em]">
                            <Check size={12} className="text-green-800" />
                            {text}
                        </div>
                    ))}
                </div>
            </div>

            {/* Standards Section: Numbers and Impact */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-0 flex flex-col md:flex-row gap-16 items-center">
                    <div className="w-full md:w-1/2 relative h-[500px] overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?q=80&w=1200"
                            alt="Agricultura sustentável"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="w-full md:w-1/2 space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-h3 font-heading text-green-800">Nossos padrões, aplicados no dia a dia</h2>
                            <p className="text-body-m text-green-800/60 max-w-md">
                                Toda decisão que tomamos — da formulação à origem dos ingredientes — segue um conjunto claro de padrões pensados para uso diário e de longo prazo.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <span className="text-h2 font-heading text-green-800">100%</span>
                                <p className="text-body-s font-bold text-green-800/60 uppercase tracking-widest mt-2">Propósito claro por trás de cada fórmula</p>
                            </div>
                            <div>
                                <span className="text-h2 font-heading text-green-800">98%</span>
                                <p className="text-body-s font-bold text-green-800/60 uppercase tracking-widest mt-2">Feito para a vida real, a longo prazo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Journey Section: Timeline */}
            <section className="bg-green-200 py-20 text-green-800">
                <div className="container mx-auto px-4 md:px-0 grid grid-cols-1 md:grid-cols-2 gap-20">
                    <div className="space-y-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Nossa jornada</span>
                        <h2 className="text-h2 font-heading leading-tight">Construído com tempo, não da noite pro dia</h2>
                        <p className="text-body-m opacity-70 max-w-sm">
                            Uma evolução gradual moldada por experiência, iteração e compromisso com o bem-estar a longo prazo — não com tendências passageiras.
                        </p>
                    </div>
                    <div className="space-y-12 border-l border-green-700 text-green-800 pl-8 md:pl-16">
                        {[
                            { year: "2021", title: "Dos conceitos às formulações", desc: "As primeiras formulações foram desenvolvidas com foco no uso diário." },
                            { year: "2023", title: "Refinando a rotina", desc: "O feedback dos clientes moldou melhorias na formulação e na embalagem." },
                            { year: "Hoje", title: "Feito para o dia a dia", desc: "A Terra Health segue construindo suplementos em torno de pequenos hábitos." }
                        ].map((item, i) => (
                            <div key={i} className="relative group">
                                <div className="absolute -left-[37px] md:-left-[69px] top-1 w-2 h-2 rounded-full bg-green-800" />
                                <h4 className="text-h5 font-heading mb-2">{item.year}</h4>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-green-800 mb-2">{item.title}</p>
                                <p className="text-body-s opacity-70">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ: Perguntas frequentes */}
            <section className="py-20 bg-green-100">
                <div className="container mx-auto px-4 md:px-0 flex flex-col md:flex-row gap-20">
                    <div className="w-full md:w-1/3 space-y-6">
                        <h2 className="text-h2 font-heading text-green-800">Perguntas frequentes</h2>
                        <p className="text-body-m text-green-800/60">
                            Se você é novo na Terra Health, aqui estão algumas coisas que as pessoas costumam querer saber antes de começar.
                        </p>
                        <Button variant="primary" colorTheme="green" className="h-12 px-8">Fale conosco</Button>
                    </div>
                    <div className="w-full md:w-2/3">
                        <TextAccordion title="O que torna a Terra Health diferente?" defaultOpen>
                            A Terra Health prioriza consistência em vez de complexidade. Em vez de linhas grandes e avassaladoras, oferecemos produtos que se adaptam ao dia a dia.
                        </TextAccordion>
                        <TextAccordion title="Como escolher os produtos certos para mim?">
                            Nossos produtos são pensados para serem modulares. Você pode começar com os suplementos base e adicionar suporte específico conforme sua rotina evolui.
                        </TextAccordion>
                        <TextAccordion title="Posso tomar os produtos Terra Health todos os dias?">
                            Sim, todas as nossas fórmulas são feitas para consumo diário e de longo prazo, com a segurança como base.
                        </TextAccordion>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}