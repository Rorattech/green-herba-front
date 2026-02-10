import { Lightbulb } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NoteProps {
  title: string;
  description: string;
  className?: string;
}

export const Note = ({ title, description, className }: NoteProps) => {
  return (
    <div className={cn(
      "w-full p-10 bg-white rounded-sm shadow-sm flex flex-col gap-6 border border-gray-100",
      className
    )}>
      <div className="text-black">
        <Lightbulb size={32} strokeWidth={1.5} />
      </div>

      <div className="flex flex-col gap-2">
        <h5 className="text-h5 font-heading text-black leading-tight">
          {title}
        </h5>

        <p className="text-body-m font-body font-medium text-black">
          {description}
        </p>
      </div>
    </div>
  );
};