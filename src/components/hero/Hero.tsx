"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function Hero() {
  const slides = [
    { id: 1, image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1920", alt: "Natureza" },
    { id: 2, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1920", alt: "Yoga" },
    { id: 3, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1920", alt: "Saúde" },
  ];

  return (
    <section className="relative h-[70vh] w-full bg-green-700">
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
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination {
          display: flex;
          justify-content: center;
          gap: 8px;
          z-index: 50;
        }
        
        .swiper-pagination-bullet {
          width: 64px !important;
          height: 3px !important;
          background-color: white !important;
          border-radius: 0 !important;
          opacity: 0.2;
          transition: all 0.3s ease;
          margin: 0 !important;
          cursor: pointer;
        }

        @media (min-width: 768px) {
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