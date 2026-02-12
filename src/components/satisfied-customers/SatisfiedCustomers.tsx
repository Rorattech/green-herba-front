import { Star } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SatisfiedCustomersProps {
  variant?: 'hero' | 'content';
  className?: string;
}

export const SatisfiedCustomers = ({
  variant = 'hero',
  className
}: SatisfiedCustomersProps) => {

  const starStyles = variant === 'hero'
    ? "fill-white text-white"
    : "fill-warning text-warning";

  const textStyles = variant === 'hero'
    ? "text-white"
    : "text-green-800";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={starStyles}
          />
        ))}
      </div>

      <span className={cn("text-body-m font-medium", textStyles)}>
        1M+ de clientes satisfeitos
      </span>
    </div>
  );
};