import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'primary';
}

export const Badge = ({ children, variant = 'neutral' }: BadgeProps) => {
  const baseClasses = "inline-flex items-center px-4 py-2 rounded-full text-body-m font-medium whitespace-nowrap";

  const variantStyles = {
    neutral: "bg-gray-100 text-green-700",
    primary: "bg-green-700 text-green-100",
    success: "bg-green-200 text-green-700",
    error: "bg-error text-green-100",
    warning: "bg-warning text-green-100",
  };

  return (
    <span className={cn(baseClasses, variantStyles[variant])}>
      {children}
    </span>
  );
};