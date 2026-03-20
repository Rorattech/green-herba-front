"use client";
import { Product } from '@/src/types/product';
import SectionHeader from '../section-header/SectionHeader';
import ProductCard from '../product-card/ProductCard';
import Image from 'next/image';

interface AllProductsProps {
  products: Product[];
  productsLoadFailed?: boolean;
}

export default function AllProducts({ products, productsLoadFailed = false }: AllProductsProps) {
  const hasNoProducts = products.length === 0;
  const firstRow = products.slice(0, 2);
  const remainingProducts = products.slice(2, 6);

  return (
    <section className="py-10 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeader title="Todos os produtos" buttonText="Ver todos" buttonLink="/products" />
        {hasNoProducts ? (
          <div className="py-16 text-center">
            <p className="text-body-m text-green-800/70">
              {productsLoadFailed
                ? 'Não foi possível carregar os produtos. Tente novamente mais tarde.'
                : 'Nenhum produto encontrado.'}
            </p>
            <p className="text-body-s text-gray-500 mt-2">
              {productsLoadFailed ? 'Verifique sua conexão e atualize a página.' : 'Tente novamente mais tarde.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
            {firstRow.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            <div className="relative col-span-2 aspect-square md:aspect-auto h-full min-h-70 md:min-h-100 overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1498671546682-94a232c26d17?q=80&w=800"
                alt="Promoção Green Herba Pharma"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 flex flex-col justify-center p-6 md:p-10">
                <h3 className="text-green-100 font-heading text-h3 mb-2 md:mb-4 leading-tight">
                  Base para o cuidado diário.
                </h3>
                <p className="text-green-100 text-body-m font-body font-medium max-w-full md:max-w-125">
                  Nossas formulações mais procuradas para integrar cuidado e equilíbrio à sua rotina.
                </p>
              </div>
            </div>

            {remainingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}