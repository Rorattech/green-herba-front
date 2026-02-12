"use client";

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

    const selectVariants = {
        light: "bg-gray-100 border-gray-200 text-green-800 focus:border-green-700",
        dark: "bg-green-800/20 border-green-600/30 text-green-100 focus:border-green-500",
    };

    return (
        <div className="relative w-full group">
            <div className={cn(
                "absolute top-2 left-6 z-10 pointer-events-none text-[9px] font-bold uppercase tracking-widest",
                colorTheme === 'light' ? "text-gray-400" : "text-green-400/70"
            )}>
                {label}
            </div>

            <div className="relative">
                <select
                    id={id}
                    className={cn(
                        "w-full pl-6 pr-12 pt-6 pb-2 rounded-full text-body-s font-medium appearance-none outline-none cursor-pointer border transition-all duration-200 h-[58px]", // h-[58px] iguala ao py-4 do input
                        selectVariants[colorTheme],
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>

                <div className={cn(
                    "absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none",
                    colorTheme === 'light' ? "text-green-800" : "text-green-400"
                )}>
                    <ChevronDown size={18} />
                </div>
            </div>
        </div>
    );
};