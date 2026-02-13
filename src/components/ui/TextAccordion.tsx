"use client";

import { useState, ReactNode } from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from "@/src/utils/cn";

interface TextAccordionProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
}

export const TextAccordion = ({
    title,
    children,
    defaultOpen = false
}: TextAccordionProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-100 transition-colors duration-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 flex items-center justify-between group cursor-pointer"
            >
                <span className="text-body-s text-left font-normal text-green-800 uppercase tracking-widest">
                    {title}
                </span>

                <div className="text-green-800">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </div>
            </button>

            <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-[1000px] pb-6 opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="text-body-m text-green-800/70 leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
};