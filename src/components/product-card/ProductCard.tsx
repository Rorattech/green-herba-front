import Image from 'next/image';
import { Star } from 'lucide-react';
import { Product } from '@/src/types/product';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col items-center bg-transparent w-full">
      <div className="relative aspect-4/5 w-full bg-gray-200 mb-3 flex items-center justify-center overflow-hidden">
        {product.discount && (
          <span className="absolute top-4 right-4 bg-[#f02d1b] text-white text-[11px] px-2.5 py-1.5 rounded-full z-10">
            -{product.discount}%
          </span>
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

      <h3 className="font-heading text-heading-md text-green-700 mb-2">
        {product.name}
      </h3>
      
      <div className="flex items-center gap-0.5 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            fill="#eab308" 
            className="text-[#eab308]" 
          />
        ))}
        <span className="text-body-xs text-gray-300 ml-1.5 font-light">
          ({product.reviewsCount || 123} reviews)
        </span>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-body-md font-bold text-green-700">R${product.price}</span>
        <span className="text-[#f02d1b] line-through text-body-sm font-medium">R${product.oldPrice}</span>
      </div>

      <button className="w-full bg-green-200 text-green-700 py-4 rounded-full font-medium text-body-md hover:bg-green-700 hover:text-white transition-all duration-300">
        Comprar
      </button>
    </div>
  );
}