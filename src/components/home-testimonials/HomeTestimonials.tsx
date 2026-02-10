"use client";

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

import { TestimonialCard } from '../testimonial-card/TestimonialCard';
import { SatisfiedCustomers } from '../satisfied-customers/SatisfiedCustomers';
import { Button } from '../ui/Button';

export default function HomeTestimonials() {
  const progressRef = useRef<HTMLDivElement>(null);
  const testimonials = [
    { name: "Larissa Souza", quote: "Faz parte da minha vida", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600" },
    { name: "Roberto Araújo", quote: "Estou muito melhor", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600" },
    { name: "Sofia Lima", quote: "Acabou com as minhas dores", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600" },
  ];

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 items-start">
          
          <div className="flex flex-col gap-6 md:col-span-full lg:col-span-1 lg:sticky lg:pt-14 lg:top-32">
            <div className="flex flex-col gap-2">
              <SatisfiedCustomers variant="content" />
              <h2 className="font-heading text-h3 md:text-h2 text-green-800 leading-tight">
                Green Herba Pharma
              </h2>
              <p className="text-body-m font-body font-medium text-green-800">
                Pessoas reais compartilham o impacto da Green Herba Pharma em suas vidas.
              </p>
            </div>
            <Button className="w-fit">Shop all</Button>
          </div>

          <div className="md:col-span-full lg:col-span-3">
            <div className="hidden md:grid grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <TestimonialCard key={i} {...t} />
              ))}
            </div>

            <div className="md:hidden overflow-hidden">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                slidesPerView={"auto"}
                navigation={{
                  prevEl: '.prev-test',
                  nextEl: '.next-test',
                }}
                pagination={{
                  type: 'progressbar',
                  el: '.test-bar-container',
                }}
                onProgress={(swiper) => {
                  if (progressRef.current) {
                    const move = swiper.progress * (progressRef.current.offsetWidth - 80);
                    progressRef.current.style.setProperty('--progress-left', `${move}px`);
                  }
                }}
                className="overflow-visible!"
              >
                {testimonials.map((t, i) => (
                  <SwiperSlide key={i} className="w-full! max-w-[280px]">
                    <TestimonialCard {...t} />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <div className="w-full max-w-40 h-0.5 bg-gray-200 relative overflow-hidden">
                    <div ref={progressRef} className="test-bar-container absolute! inset-0" />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="primary" 
                      colorTheme="pistachio" 
                      isIconOnly 
                      className="prev-test w-12 h-12"
                      aria-label="Previous testimonial"
                      iconLeft={<ArrowLeft size={18} />}
                    />

                    <Button 
                      variant="primary" 
                      colorTheme="pistachio" 
                      isIconOnly 
                      className="next-test w-12 h-12"
                      aria-label="Next testimonial"
                      iconRight={<ArrowRight size={18} />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .test-bar-container.swiper-pagination-progressbar {
          background: transparent !important;
        }

        .test-bar-container .swiper-pagination-progressbar-fill {
          background-color: #1C3A13 !important;
          width: 80px !important; 
          height: 100% !important;
          transform: none !important;
          position: absolute !important;
          left: var(--progress-left, 0px); 
          transition: left 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}