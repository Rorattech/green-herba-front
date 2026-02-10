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
    <section className="py-10 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-0">
        <SectionHeader title="Todos os produtos" buttonText="Ver todos" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
          {firstRow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          <div className="relative col-span-2 aspect-square md:aspect-auto h-full min-h-[280px] md:min-h-100 overflow-hidden group">
            <Image 
              src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800" 
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

          {remainingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}