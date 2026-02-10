import { cn } from "@/src/utils/cn";
import { InputHTMLAttributes } from "react";

interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
    colorTheme?: 'light' | 'dark';
  }
  
  export const TextArea = ({ error, colorTheme = 'light', className, ...props }: TextAreaProps) => {
    return (
      <textarea
        className={cn(
          "w-full px-6 py-4 rounded-2xl text-body-m font-medium outline-hidden min-h-[120px] resize-none border transition-colors",
          colorTheme === 'light' 
            ? "bg-gray-100 border-gray-300 text-black focus:border-green-700" 
            : "bg-green-800/20 border-green-600/30 text-green-100 focus:border-green-500",
          error ? "border-error" : "",
          className
        )}
        {...props}
      />
    );
  };