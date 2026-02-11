import { cn } from "@/src/utils/cn";
import { ReactNode } from "react";

interface FilterCheckboxProps {
    label: string | ReactNode;
    id: string;
    colorTheme?: 'light' | 'dark';
}

export const FilterCheckbox = ({ label, id, colorTheme = 'light' }: FilterCheckboxProps) => (
    <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative flex items-center">
            <input
                type="checkbox"
                id={id}
                className={cn(
                    "peer appearance-none w-5 h-5 border rounded-sm transition-all cursor-pointer",
                    colorTheme === 'light'
                        ? "border-gray-300 bg-white checked:bg-green-700 checked:border-green-700"
                        : "border-green-600 bg-transparent checked:bg-green-500 checked:border-green-500"
                )}
            />
            <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none hidden peer-checked:block left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <span className={cn(
            "text-body-m font-medium transition-colors",
            colorTheme === 'light' ? "text-green-800" : "text-green-100"
        )}>
            {label}
        </span>
    </label>
);