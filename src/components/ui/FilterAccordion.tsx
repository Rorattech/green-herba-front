"use client";

import { useState, ReactNode } from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from "@/src/utils/cn";

interface FilterAccordionProps {
    title: string;
    children: ReactNode;
    colorTheme?: 'light' | 'dark';
    defaultOpen?: boolean;
}

export const FilterAccordion = ({
    title,
    children,
    colorTheme = 'light',
    defaultOpen = false
}: FilterAccordionProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={cn(
            "border-b transition-colors duration-200",
            colorTheme === 'light' ? "border-gray-100" : "border-green-600/30"
        )}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between group cursor-pointer"
            >
                <span className={cn(
                    "text-sub-m font-normal uppercase tracking-widest transition-colors",
                    colorTheme === 'light' ? "text-green-800" : "text-green-100"
                )}>
                    {title}
                </span>

                <div className={cn(
                    "transition-colors",
                    colorTheme === 'light' ? "text-green-800" : "text-green-100"
                )}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </div>
            </button>

            <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-[500px] pb-8 opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="flex flex-col gap-4">
                    {children}
                </div>
            </div>
        </div>
    );
};