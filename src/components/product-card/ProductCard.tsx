"use client";

import Image from 'next/image';
import { Star } from 'lucide-react';
import { Product } from '@/src/types/product';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import Link from 'next/link';
import { useCart } from '@/src/contexts/CartContext';
import { useCartDrawer } from '@/src/contexts/CartDrawerContext';
import { formatCurrency } from '@/src/utils/format';

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

      <div className="flex flex-col flex-1 items-center text-center px-2">
        <h3 className="text-h6 text-green-800 leading-tight line-clamp-2 py-0.5 px-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => {
              const rating = product.rating ?? 0;
              const isFilled = i < Math.floor(rating);
              return (
                <Star
                  key={i}
                  size={12}
                  className={
                    isFilled
                      ? "fill-warning text-warning"
                      : "text-gray-300"
                  }
                />
              );
            })}
          </div>
          <span className="text-body-s font-medium text-green-600">
            ({product.reviewsCount ?? 0})
          </span>
        </div>

        <div className="mt-auto w-full flex flex-col items-center pt-2">
          <div className="flex items-center gap-1 mb-4">
            <span className="text-body-m font-medium text-green-800">
              {product.priceFormatted}
            </span>
            {product.oldPrice && product.oldPrice !== "0" && (
              <span className="text-error line-through text-body-m font-medium">
                {formatCurrency(parseFloat(product.oldPrice))}
              </span>
            )}
          </div>

          <Button
            variant="primary"
            colorTheme="pistachio"
            className="w-full"
            onClick={handleAddToCart}
          >
            <span className="lg:hidden">Adicionar</span>
            <span className="hidden lg:inline">Adicionar ao carrinho</span>
          </Button>
        </div>
      </div>
    </Link>
  );
}