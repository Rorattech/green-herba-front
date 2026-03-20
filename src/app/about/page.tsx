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
                    <span className="text-sub-s font-normal uppercase tracking-widest text-gray-500">Nossa abordagem</span>
                    <h1 className="text-h3 md:text-h1 font-heading text-green-800 leading-tight">
                        Cuidado contínuo para uma saúde duradoura
                    </h1>
                    <p className="text-body-m text-green-800/70 max-w-md">
                        A Green Herba Pharma nasceu com o propósito de oferecer soluções terapêuticas seguras e baseadas em ciência. Acreditamos que o bem-estar sustentável é construído por meio de acompanhamento responsável, rigor técnico e excelência em qualidade farmacêutica.
                    </p>
                    <Link href="/products">
                        <Button variant="primary" colorTheme="green" className="w-fit px-8 h-12">
                            Conheça nossos produtos
                        </Button>
                    </Link>
                </div>
                <div className="w-full md:w-1/2 relative h-100 md:h-auto">
                    <Image
                        src="/images/about-1.png"
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
                <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row gap-16 items-center">
                    <div className="w-full md:w-1/2 relative h-125 overflow-hidden">
                        <Image
                            src="/images/about-2.png"
                            alt="Agricultura sustentável"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="w-full md:w-1/2 space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-h3 font-heading text-green-800">Aqui na Green Herba Fharma, não apenas produzimos óleos, cultivamos esperança, alívio e a promessa de uma vida melhor.</h2>
                            <p className="text-body-m text-green-800/60 max-w-md">
                                Cada frasco que entregamos é um convite para uma jornada pessoal, uma busca pelo equilíbrio e pela harmonia.
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

            {/* Journey Section: Timeline
            <section className="bg-green-200 py-20 text-green-800">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-20">
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
                                <div className="absolute -left-9.25 md:-left-17.25 top-1 w-2 h-2 rounded-full bg-green-800" />
                                <h4 className="text-h5 font-heading mb-2">{item.year}</h4>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-green-800 mb-2">{item.title}</p>
                                <p className="text-body-s opacity-70">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* FAQ: Perguntas frequentes */}
            <section id="perguntas-frequentes" className="py-20 bg-green-100 scroll-mt-24">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row gap-20">
                    <div className="w-full md:w-1/3 space-y-6">
                        <h2 className="text-h2 font-heading text-green-800">Perguntas frequentes</h2>
                        <p className="text-body-m text-green-800/60">
                            Se você é novo na Green Herba Pharma, aqui está um guia rápido com informações importantes que ajudam a entender nossos produtos e nosso compromisso com a saúde.
                        </p>
                        <Link href="/contato">
                            <Button variant="primary" colorTheme="green" className="h-12 px-8">Fale conosco</Button>
                        </Link>
                    </div>
                    <div className="w-full md:w-2/3">
                        <TextAccordion title="O que torna a Green Herba Pharma diferente?" defaultOpen>
                            A Green Herba Pharma se destaca por unir ciência, segurança e cuidado em cada produto. Nossas terapias à base de cannabis são desenvolvidas com controle de qualidade, garantindo soluções confiáveis para diferentes necessidades de saúde.
                        </TextAccordion>
                        <TextAccordion title="Como escolher os produtos certos para mim?">
                            Escolher o produto certo começa com compreender suas necessidades e objetivos de cuidado.
                        </TextAccordion>
                        <TextAccordion title="Posso tomar os produtos Green Herba Pharma todos os dias?">
                            Sempre consulte médicos especializados, que podem avaliar suas necessidades individuais e indicar a melhor.
                        </TextAccordion>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}