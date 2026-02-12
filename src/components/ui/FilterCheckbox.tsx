import { cn } from "@/src/utils/cn";
import { ReactNode } from "react";

type FilterCheckboxProps =
    | {
          label: string | ReactNode;
          id: string;
          colorTheme?: 'light' | 'dark';
          variant?: 'checkbox';
          name?: never;
          checked?: boolean;
          onChange?: () => void;
      }
    | {
          label: string | ReactNode;
          id: string;
          colorTheme?: 'light' | 'dark';
          variant: 'radio';
          name: string;
          checked?: boolean;
          onChange?: () => void;
      };

export const FilterCheckbox = ({
    label,
    id,
    colorTheme = 'light',
    variant = 'checkbox',
    name,
    checked,
    onChange,
}: FilterCheckboxProps) => {
    const isRadio = variant === 'radio';

    const isChecked = Boolean(checked);
    
    return (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
                <input
                    type={isRadio ? 'radio' : 'checkbox'}
                    id={id}
                    name={isRadio ? name : undefined}
                    checked={isChecked}
                    onChange={onChange}
                    className={cn(
                        "peer appearance-none w-5 h-5 border transition-all cursor-pointer",
                        isRadio ? "rounded-full" : "rounded-sm",
                        colorTheme === 'light'
                            ? isChecked 
                                ? "border-green-700 bg-green-700"
                                : "border-gray-300 bg-white"
                            : isChecked
                                ? "border-green-500 bg-green-500"
                                : "border-green-600 bg-transparent"
                    )}
                />
                {isRadio ? (
                    <span className={cn(
                        "absolute w-2 h-2 rounded-full bg-white pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                        isChecked ? "block" : "hidden"
                    )} />
                ) : (
                    <svg className={cn(
                        "absolute w-3.5 h-3.5 text-white pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                        isChecked ? "block" : "hidden"
                    )} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
            <span className={cn(
                "text-body-m font-medium transition-colors",
                colorTheme === 'light' ? "text-green-800" : "text-green-100"
            )}>
                {label}
            </span>
        </label>
    );
};