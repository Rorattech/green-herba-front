import { ReactNode, ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'soft' | 'outline' | 'ghost';
  colorTheme?: 'green' | 'pistachio' | 'gray' | 'white';
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  isIconOnly?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  colorTheme = 'green',
  iconLeft,
  iconRight,
  isIconOnly = false,
  className,
  ...props
}: ButtonProps) => {
  
  // Base: Text Style M/Medium (16px)
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-full font-body text-body-m font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0";
  
  // Tamanhos condicionais: se for IconOnly, não aplicamos padding fixo aqui para não dar conflito
  const sizeClasses = isIconOnly 
    ? "aspect-square p-2" 
    : "px-8 py-4";

  // Mapeamento de Cores
  const variantStyles = {
    primary: {
      green: "bg-green-700 text-green-100 hover:bg-green-800",
      pistachio: "bg-green-200 text-green-700 hover:bg-green-800 hover:text-green-100",
      gray: "bg-gray-300 text-green-700 hover:bg-gray-400",
      white: "bg-white text-green-700 hover:bg-green-200 hover:text-green-100",
    },
    soft: {
      green: "bg-green-100 text-green-700 hover:bg-green-200",
      pistachio: "bg-green-100 text-green-600 hover:bg-green-200",
      gray: "bg-gray-100 text-gray-500 hover:bg-gray-200",
      white: "bg-white/20 text-green-100 hover:bg-white/30 backdrop-blur-sm",
    },
    outline: {
      green: "border border-green-700 text-green-700 hover:bg-green-100",
      pistachio: "border border-green-200 text-green-700 hover:bg-green-50",
      gray: "border border-gray-300 text-gray-700 hover:bg-gray-100",
      white: "border border-white text-green-100 hover:bg-white/10",
    },
    ghost: {
      green: "text-green-700 hover:bg-green-100",
      pistachio: "text-green-600 hover:bg-green-50",
      gray: "text-gray-500 hover:bg-gray-100",
      white: "text-green-100 hover:bg-white/10",
    }
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantStyles[variant][colorTheme],
        sizeClasses,
        className
      )}
      {...props}
    >
      {iconLeft && <span className="shrink-0">{iconLeft}</span>}
      {!isIconOnly && children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
};