import { ReactNode } from 'react';
import { Tag as TagIcon, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TagProps {
  children: ReactNode;
  variant?: 'gray' | 'outline' | 'success' | 'error';
  onClose?: () => void;
  showIcon?: boolean;
}

export const Tag = ({ 
  children, 
  variant = 'gray', 
  onClose, 
  showIcon = true 
}: TagProps) => {
  const baseClasses = "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-body-m font-medium whitespace-nowrap transition-all";

  const variantStyles = {
    gray: "bg-gray-300 text-green-700",
    outline: "border border-green-700 text-green-700 bg-transparent",
    success: "bg-success text-green-100",
    error: "bg-error text-green-100",
  };

  return (
    <span className={cn(baseClasses, variantStyles[variant])}>
      {showIcon && <TagIcon size={16} className="shrink-0" />}
      
      {children}
      
      {onClose && (
        <button 
          onClick={onClose}
          className="hover:opacity-60 cursor-pointer p-0.5"
        >
          <X size={16} />
        </button>
      )}
    </span>
  );
};