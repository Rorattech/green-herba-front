import Image from 'next/image';
import { Button } from '../ui/Button';

interface CategoryCardProps {
  title: string;
  image: string;
}

export const CategoryCard = ({ title, image }: CategoryCardProps) => (
  <div className="relative aspect-square overflow-hidden group cursor-pointer">
    <Image 
      src={image} 
      alt={title}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      priority={true}
    />

    <div className="absolute inset-0 bg-black/20 transition-colors duration-300" />
    <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
      <h3 className="text-green-100 text-h3 font-heading leading-tight">
        {title}
      </h3>
      
      
      <Button 
        variant="primary" 
        colorTheme="white"
        className="w-fit"
      >
        Ver todos
      </Button>
    </div>
  </div>
);