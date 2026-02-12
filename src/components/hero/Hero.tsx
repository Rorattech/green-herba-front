"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import { Button } from '../ui/Button';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { SatisfiedCustomers } from '../satisfied-customers/SatisfiedCustomers';

export default function Hero() {
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1617101814812-3529cf87b5ce?auto=format&fit=crop&q=80&w=1920",
      alt: "Natureza",
      title: "Saúde que você pode sentir. Todos os dias.",
      description: "Suplementos diários direcionados projetados para apoiar digestão, imunidade e equilíbrio geral — sem complicar sua rotina.",
      buttonText: "Comprar suplementos"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1605040056130-38d9faad3534?auto=format&fit=crop&q=80&w=1920",
      alt: "Yoga",
      title: "Encontre seu equilíbrio através da natureza.",
      description: "Descubra uma gama de soluções à base de plantas criadas para harmonizar seu corpo e mente no mundo acelerado de hoje.",
      buttonText: "Explorar Equilíbrio"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1594841061289-1d892771c607?auto=format&fit=crop&q=80&w=1920",
      alt: "Saúde",
      title: "Ingredientes puros. Resultados reais.",
      description: "Buscamos matérias-primas da mais alta qualidade para garantir que cada cápsula entregue a potência que sua saúde merece.",
      buttonText: "Ver nossa qualidade"
    },
  ];

  return (
    <section className="relative h-[65vh] md:h-[75vh] w-full bg-green-700">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        speed={1200}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 z-10" />

              <div className="absolute inset-0 z-20 flex items-center">
                <div className="container mx-auto px-4 md:px-0">
                  <div className="max-w-4xl flex flex-col items-start gap-4 md:gap-6 text-gray-100">

                    <SatisfiedCustomers variant="hero" />

                    <h1 className="text-h3 md:text-h2 lg:text-h1 leading-tight">
                      {slide.title}
                    </h1>

                    <p className="text-body-m font-body font-medium md:max-w-3xl">
                      {slide.description}
                    </p>

                    <div className="mt-2">
                      <Button variant="primary" colorTheme="white">
                        {slide.buttonText}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination {
          display: flex;
          justify-content: center;
          gap: 8px;
          padding: 0 16px;
          z-index: 50;
        }
        
        .swiper-pagination-bullet {
          width: 33.33% !important;
          height: 2px !important;
          background-color: white !important;
          border-radius: 0 !important;
          opacity: 0.2;
          transition: all 0.3s ease;
          margin: 0 !important;
          cursor: pointer;
        }

        @media (min-width: 768px) {
          .swiper-pagination-bullet {
            padding: 0 !important;
          }
          .swiper-pagination-bullet {
            width: 190px !important;
          }
        }

        .swiper-pagination-bullet-active {
          opacity: 1 !important;
        }

        .swiper-pagination-bullet:hover {
          opacity: 0.7;
        }
      `}</style>
    </section>
  );
}