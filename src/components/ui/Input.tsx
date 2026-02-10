import { InputHTMLAttributes, ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  colorTheme?: 'light' | 'dark';
  iconRight?: ReactNode;
}

export const Input = ({
  label,
  error,
  colorTheme = 'light',
  iconRight,
  className,
  id,
  ...props
}: InputProps) => {
  
  // Estilos base vinculados ao text-body-m (Inter Tight)
  const containerClasses = "relative w-full group";
  
  const inputVariants = {
    light: "bg-gray-100 border-gray-300 text-black placeholder:text-gray-400 focus:border-green-700",
    dark: "bg-green-800/20 border-green-600/30 text-green-100 placeholder:text-green-400/50 focus:border-green-500",
  };

  const stateClasses = error 
    ? "border-error focus:border-error" 
    : "border transition-colors duration-200";

  return (
    <div className={containerClasses}>
      {label && (
        <label 
          htmlFor={id} 
          className={cn(
            "block mb-1.5 text-body-s font-medium uppercase tracking-wider",
            colorTheme === 'light' ? "text-gray-400" : "text-green-400/70"
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          className={cn(
            "w-full px-6 py-4 rounded-full text-body-m font-medium outline-hidden",
            inputVariants[colorTheme],
            stateClasses,
            iconRight && "pr-12",
            className
          )}
          {...props}
        />
        {iconRight && (
          <div className={cn(
            "absolute right-6 top-1/2 -translate-y-1/2",
            colorTheme === 'light' ? "text-gray-400" : "text-green-400"
          )}>
            {iconRight}
          </div>
        )}
      </div>
    </div>
  );
};