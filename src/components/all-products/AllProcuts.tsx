"use client";
import { Product } from '@/src/types/product';
import SectionHeader from '../section-header/SectionHeader';
import ProductCard from '../product-card/ProductCard';
import Image from 'next/image';

interface AllProductsProps {
  products: Product[];
}

export default function AllProducts({ products }: AllProductsProps) {
  const firstRow = products.slice(0, 2);
  const remainingProducts = products.slice(2);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-0">
        <SectionHeader title="Todos os produtos" buttonText="Ver todos" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {firstRow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          <div className="relative col-span-1 sm:col-span-2 aspect-video sm:aspect-auto h-full min-h-100 overflow-hidden group">
            <Image 
              src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800" 
              alt="Promoção Terra Health"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 flex flex-col justify-center p-10">
              <h3 className="text-white font-heading text-heading-lg mb-4 max-w-70">
                Todos os produtos
              </h3>
              <p className="text-white/90 text-body-sm max-w-[320px] mb-6">
                Nossas fórmulas diárias mais populares, projetadas para apoiar a saúde cotidiana.
              </p>
              <span className="text-white font-bold text-body-xs underline underline-offset-4 cursor-pointer uppercase tracking-widest">
                Saiba mais
              </span>
            </div>
          </div>

          {remainingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}