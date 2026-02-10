import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  colorTheme?: 'light' | 'dark';
  onPageChange: (page: number) => void;
}

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  colorTheme = 'light', 
  onPageChange 
}: PaginationProps) => {
  
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const baseBtn = "w-10 h-10 flex items-center justify-center rounded-sm text-body-m font-medium transition-colors cursor-pointer";
  
  const activeClasses = colorTheme === 'light' 
    ? "bg-green-200 text-green-700" 
    : "bg-green-600/40 text-green-100";

  const inactiveClasses = colorTheme === 'light'
    ? "text-gray-400 hover:text-green-700"
    : "text-green-100/60 hover:text-green-100";

  return (
    <div className="flex items-center justify-center gap-2">
      <button 
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(inactiveClasses, "disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer")}
      >
        <ChevronLeft size={20} />
      </button>
      
      {/* Mapeamento dinâmico das páginas */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            baseBtn, 
            page === currentPage ? activeClasses : inactiveClasses
          )}
        >
          {page}
        </button>
      ))}

      <button 
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(inactiveClasses, "disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer")}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};