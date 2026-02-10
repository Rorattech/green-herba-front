import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  colorTheme?: 'light' | 'dark';
}

export const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  colorTheme = 'dark' 
}: TooltipProps) => {
  
  const containerClasses = "group relative inline-block";
  
  const bubbleClasses = cn(
    "absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200",
    "px-4 py-3 rounded-sm min-w-max max-w-xs text-body-m font-medium shadow-lg",
    
    colorTheme === 'dark' ? "bg-green-700 text-green-100" : "bg-gray-100 text-green-700 border border-gray-200",

    position === 'top' && "-top-2 left-1/2 -translate-x-1/2 -translate-y-full mb-2",
    position === 'bottom' && "-bottom-2 left-1/2 -translate-x-1/2 translate-y-full mt-2",
    position === 'left' && "top-1/2 -left-2 -translate-x-full -translate-y-1/2 mr-2",
    position === 'right' && "top-1/2 -right-2 translate-x-full -translate-y-1/2 ml-2"
  );

  const arrowClasses = cn(
    "absolute w-0 h-0 border-4",
    position === 'top' && "bottom-[-8px] left-1/2 -translate-x-1/2 border-x-transparent border-b-transparent",
    position === 'bottom' && "top-[-8px] left-1/2 -translate-x-1/2 border-x-transparent border-t-transparent",
    position === 'left' && "right-[-8px] top-1/2 -translate-y-1/2 border-y-transparent border-r-transparent",
    position === 'right' && "left-[-8px] top-1/2 -translate-y-1/2 border-y-transparent border-l-transparent",
    colorTheme === 'dark' ? "border-t-green-700" : "border-t-gray-100" // Ajuste dinâmico da cor da seta
  );

  return (
    <div className={containerClasses}>
      {children}
      <div className={bubbleClasses}>
        {content}
        <div className={arrowClasses} />
      </div>
    </div>
  );
};