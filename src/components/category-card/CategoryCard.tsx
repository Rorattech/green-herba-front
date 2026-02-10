import Image from 'next/image';

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

    <div className="absolute inset-0 bg-black/20 group-hover:bg-green-700/30 transition-colors duration-300" />
    <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
      <h3 className="text-white text-heading-lg font-heading leading-tight">
        {title}
      </h3>
      
      <button className="w-fit bg-white text-green-700 px-8 py-3 rounded-full text-body-sm hover:bg-green-200 hover:cursor-pointer transition-colors shadow-sm">
        Ver todos
      </button>
    </div>
  </div>
);