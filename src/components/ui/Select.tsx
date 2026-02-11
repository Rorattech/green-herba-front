import { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    colorTheme?: 'light' | 'dark';
}

export const Select = ({
    label,
    colorTheme = 'light',
    className,
    children,
    id,
    ...props
}: SelectProps) => {

    const containerClasses = "relative w-full group";

    const selectVariants = {
        light: "bg-white border-gray-200 text-green-800 focus:border-green-700",
        dark: "bg-green-800/20 border-green-600/30 text-green-100 focus:border-green-500",
    };

    return (
        <div className={containerClasses}>
            <div className={cn(
                "absolute top-2.5 left-4 z-10 pointer-events-none text-[10px] font-bold uppercase tracking-wider",
                colorTheme === 'light' ? "text-gray-400" : "text-green-400/70"
            )}>
                {label}
            </div>

            <div className="relative">
                <select
                    id={id}
                    className={cn(
                        "w-full pl-4 pr-10 pt-7 pb-2.5 rounded-lg text-body-s font-medium appearance-none outline-none cursor-pointer border transition-colors duration-200",
                        selectVariants[colorTheme],
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>

                <div className={cn(
                    "absolute right-4 bottom-3 pointer-events-none",
                    colorTheme === 'light' ? "text-green-800" : "text-green-400"
                )}>
                    <ChevronDown size={16} />
                </div>
            </div>
        </div>
    );
};