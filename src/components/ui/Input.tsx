"use client";

import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
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
  iconLeft?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  colorTheme = 'light',
  iconRight,
  iconLeft,
  className,
  id,
  ...props
}, ref) => {
  const inputVariants = {
    light: "bg-gray-100 border-gray-200 text-green-800 placeholder:text-gray-400 focus:border-green-700",
    dark: "bg-green-800/20 border-green-600/30 text-green-100 placeholder:text-green-400/50 focus:border-green-500",
  };

  return (
    <div className="relative w-full group">
      {label && (
        <label htmlFor={id} className={cn(
          "block mb-1.5 text-body-s font-medium uppercase tracking-wider",
          colorTheme === 'light' ? "text-gray-400" : "text-green-400/70"
        )}>
          {label}
        </label>
      )}
      <div className="relative">
        {iconLeft && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            {iconLeft}
          </div>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "w-full px-6 py-4 rounded-full text-body-m font-medium outline-none border transition-all duration-200",
            inputVariants[colorTheme],
            error ? "border-error" : "",
            iconLeft && "pl-12",
            iconRight && "pr-12",
            className
          )}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
            {iconRight}
          </div>
        )}
      </div>
    </div>
  );
});

Input.displayName = "Input";