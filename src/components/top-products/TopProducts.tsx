"use client";
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

import { Product } from '@/src/types/product';
import SectionHeader from '../section-header/SectionHeader';
import ProductCard from '../product-card/ProductCard';
import { Button } from '../ui/Button';

export default function TopProducts({ products }: { products: Product[] }) {
  const progressRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-10 md:py-14 overflow-hidden">

      <div className="container mx-auto px-4 md:px-0">
        <SectionHeader title="Top Produtos" buttonText="Ver todos" buttonLink="/products" />
      </div>

      <div className="container mx-auto px-4 md:px-0">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={"auto"}
          navigation={{
            prevEl: '.prev-prod',
            nextEl: '.next-prod',
          }}
          pagination={{
            type: 'progressbar',
            el: '.custom-bar-container',
          }}
          onProgress={(swiper) => {
            if (progressRef.current) {
              const move = swiper.progress * (progressRef.current.offsetWidth - 80);
              progressRef.current.style.setProperty('--progress-left', `${move}px`);
            }
          }}
          className="overflow-visible!"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="w-full! max-w-[320px] md:max-w-107.5!">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="container mx-auto mt-8 px-4 md:px-0">
        <div className="flex items-center justify-between border-gray-200">
          <div className="w-full max-w-56.25 h-0.5 bg-gray-200 relative overflow-hidden">
            <div ref={progressRef} className="custom-bar-container absolute! inset-0" />
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              colorTheme="pistachio"
              isIconOnly
              className="prev-prod w-12 h-12"
              aria-label="Previous product"
              iconLeft={<ArrowLeft size={18} />}
            />

            <Button
              variant="primary"
              colorTheme="pistachio"
              isIconOnly
              className="next-prod w-12 h-12"
              aria-label="Next product"
              iconRight={<ArrowRight size={18} />}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-bar-container.swiper-pagination-progressbar {
          background: transparent !important;
        }

        .custom-bar-container .swiper-pagination-progressbar-fill {
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