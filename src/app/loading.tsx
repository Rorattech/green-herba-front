import Image from "next/image";
import MainLayout from "@/src/layouts/MainLayout";
import Hero from "@/src/components/hero/Hero";
import HomeCategories from "@/src/components/home-categories/HomeCategories";
import HomeTestimonials from "@/src/components/home-testimonials/HomeTestimonials";
import SectionHeader from "@/src/components/section-header/SectionHeader";
import ProductCardSkeleton from "@/src/components/product-card/ProductCardSkeleton";
import { Button } from "@/src/components/ui/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Loading() {
  return (
    <MainLayout>
      <Hero />

      {/* Top Products - mesma estrutura do carousel (Swiper), sangra à direita */}
      <section className="py-10 md:py-14 overflow-hidden">
        <div className="container mx-auto px-4 md:px-0">
          <SectionHeader title="Top Produtos" buttonText="Ver todos" buttonLink="/products" />
        </div>
        <div className="container mx-auto px-4 md:px-0 overflow-visible">
          <div className="flex gap-6 overflow-visible">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-full max-w-[320px] md:max-w-107.5 shrink-0"
              >
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        </div>
        <div className="container mx-auto mt-8 px-4 md:px-0">
          <div className="flex items-center justify-between border-gray-200">
            <div className="w-full max-w-56.25 h-0.5 bg-gray-200 relative overflow-hidden" />
            <div className="flex gap-3">
              <Button
                variant="primary"
                colorTheme="pistachio"
                isIconOnly
                className="prev-prod w-12 h-12"
                aria-label="Produto anterior"
                iconLeft={<ArrowLeft size={18} />}
              />
              <Button
                variant="primary"
                colorTheme="pistachio"
                isIconOnly
                className="next-prod w-12 h-12"
                aria-label="Próximo produto"
                iconRight={<ArrowRight size={18} />}
              />
            </div>
          </div>
        </div>
      </section>

      <HomeCategories />
      <HomeTestimonials />

      {/* Todos os produtos - mesma grid + ad no meio (como AllProducts) */}
      <section className="py-10 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-0">
          <SectionHeader title="Todos os produtos" buttonText="Ver todos" buttonLink="/products" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
            {[...Array(2)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
            <div className="relative col-span-2 aspect-square md:aspect-auto h-full min-h-[280px] md:min-h-100 overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1498671546682-94a232c26d17?q=80&w=800"
                alt="Promoção Green Herba Pharma"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 flex flex-col justify-center p-6 md:p-10">
                <h3 className="text-green-100 font-heading text-h3 mb-2 md:mb-4 leading-tight">
                  Produtos essenciais
                </h3>
                <p className="text-green-100 text-body-m font-body font-medium max-w-full md:max-w-[500px]">
                  Nossas fórmulas diárias mais populares, projetadas para apoiar a saúde cotidiana.
                </p>
              </div>
            </div>
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
