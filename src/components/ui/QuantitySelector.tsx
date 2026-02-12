import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityProps {
  colorTheme?: 'light' | 'dark';
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
}

export const QuantitySelector = ({ 
  colorTheme = 'light', 
  value: controlledValue,
  onChange,
  min = 1,
  max
}: QuantityProps) => {
  const [internalValue, setInternalValue] = useState(1);
  
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleDecrease = () => {
    const newValue = Math.max(min, value - 1);
    if (isControlled) {
      onChange?.(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const handleIncrease = () => {
    const newValue = max !== undefined ? Math.min(max, value + 1) : value + 1;
    if (isControlled) {
      onChange?.(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const themeClasses = colorTheme === 'light'
    ? "bg-gray-100 border-gray-300 text-green-700"
    : "bg-green-800/20 border-green-600/30 text-green-100";

  return (
    <div className={`inline-flex items-center gap-4 p-2 rounded-full border ${themeClasses}`}>
      <button
        onClick={handleDecrease}
        disabled={value <= min}
        className="hover:opacity-60 transition-opacity cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Minus size={16} />
      </button>

      <span className="text-body-m font-medium min-w-[1ch] text-center">
        {value}
      </span>

      <button
        onClick={handleIncrease}
        disabled={max !== undefined && value >= max}
        className="hover:opacity-60 transition-opacity cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};