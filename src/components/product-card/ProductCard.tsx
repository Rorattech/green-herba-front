import Image from 'next/image';
import { Star } from 'lucide-react';
import { Product } from '@/src/types/product';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug ?? product.id}`} className="group flex flex-col items-center bg-transparent w-full">
      <div className="relative aspect-square lg:aspect-4/5 w-full bg-gray-100 mb-4 flex items-center justify-center overflow-hidden">
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
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      <h3 className="text-h6 text-green-800 mb-2">
        {product.name}
      </h3>

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
          ({product.reviewsCount || 123} reviews)
        </span>
      </div>

      <div className="flex items-center gap-1 mb-4">
        <span className="text-body-m font-medium text-green-800">R${product.price}</span>
        <span className="text-error line-through text-body-m font-medium">R${product.oldPrice}</span>
      </div>

      <Button variant="primary" colorTheme="pistachio" className="w-full">
        Add to cart
      </Button>
    </Link>
  );
}