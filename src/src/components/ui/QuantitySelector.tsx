import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityProps {
  colorTheme?: 'light' | 'dark';
}

export const QuantitySelector = ({ colorTheme = 'light' }: QuantityProps) => {
  const [count, setCount] = useState(1);

  const themeClasses = colorTheme === 'light' 
    ? "bg-gray-100 border-gray-300 text-green-700" 
    : "bg-green-800/20 border-green-600/30 text-green-100";

  return (
    <div className={`inline-flex items-center gap-6 px-6 py-3 rounded-full border ${themeClasses}`}>
      <button 
        onClick={() => setCount(Math.max(1, count - 1))}
        className="hover:opacity-60 transition-opacity cursor-pointer"
      >
        <Minus size={16} />
      </button>
      
      <span className="text-body-m font-medium min-w-[1ch] text-center">
        {count}
      </span>
      
      <button 
        onClick={() => setCount(count + 1)}
        className="hover:opacity-60 transition-opacity cursor-pointer"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};