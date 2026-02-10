import Image from 'next/image';
import { Play } from 'lucide-react';

interface TestimonialProps {
  name: string;
  quote: string;
  image: string;
}

export const TestimonialCard = ({ name, quote, image }: TestimonialProps) => (
  <div className="flex flex-col gap-4 group cursor-pointer">
    <div className="relative aspect-9/16 w-full overflow-hidden bg-gray-200">
      <Image 
        src={image} 
        alt={`Depoimento de ${name}`}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
        <div className="w-[88px] h-[88px] rounded-full bg-transparent backdrop-blur-xs flex items-center justify-center border border-white/40 transition-transform group-hover:scale-110">
          <Play className="text-green-100 fill-white" size={32} />
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-1">
      <h4 className="font-body text-body-l text-green-800 font-bold tracking-tight mb-1">
        {quote}
      </h4>
      <p className="text-sub-m font-normal text-green-600 uppercase tracking-wide">
        {name}
      </p>
    </div>
  </div>
);