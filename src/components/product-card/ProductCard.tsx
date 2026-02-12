"use client";

import Image from 'next/image';
import { Star } from 'lucide-react';
import { Product } from '@/src/types/product';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import Link from 'next/link';
import { useCart } from '@/src/contexts/CartContext';
import { useCartDrawer } from '@/src/contexts/CartDrawerContext';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { openDrawer } = useCartDrawer();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    openDrawer();
  };

  return (
    <Link
      href={`/product/${product.slug ?? product.id}`}
      className="group flex flex-col bg-transparent w-full h-full"
    >
      {/* Container da Imagem */}
      <div className="relative aspect-square lg:aspect-4/5 w-full bg-gray-100 mb-4 flex items-center justify-center overflow-hidden shrink-0">
        {product.badgeLabel && (
          <div className="absolute top-6 right-6 z-10">
            <Badge variant={product.badgeVariant}>
              {product.badgeLabel}
            </Badge>
          </div>
        )}
        <div className="relative w-4/5 h-4/5">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Área de Conteúdo */}
      <div className="flex flex-col flex-1 items-center text-center px-2">
        {/* Ajuste aqui: 
            1. 'line-clamp-2' para limitar linhas.
            2. 'leading-tight' para um espaçamento entre linhas melhor.
            3. 'py-1' para evitar que o overflow do line-clamp corte a base das letras.
        */}
        <h3 className="text-h6 text-green-800 leading-tight line-clamp-2 py-0.5 px-2">
          {product.name}
        </h3>

        {/* Avaliação */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className="fill-warning text-warning"
              />
            ))}
          </div>
          <span className="text-body-s font-medium text-green-600">
            ({product.reviewsCount || 123})
          </span>
        </div>

        {/* Rodapé: Preço e Botão */}
        <div className="mt-auto w-full flex flex-col items-center pt-2">
          <div className="flex items-center gap-1 mb-4">
            <span className="text-body-m font-medium text-green-800">
              R${product.price}
            </span>
            {product.oldPrice && (
              <span className="text-error line-through text-body-m font-medium">
                R${product.oldPrice}
              </span>
            )}
          </div>

          <Button
            variant="primary"
            colorTheme="pistachio"
            className="w-full"
            onClick={handleAddToCart}
          >
            Add to cart
          </Button>
        </div>
      </div>
    </Link>
  );
}