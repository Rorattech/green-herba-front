import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  colorTheme?: 'light' | 'dark';
}

export const Breadcrumb = ({ items, colorTheme = 'dark' }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-2">
              <Link
                href={item.href}
                className={cn(
                  "text-body-m font-medium transition-colors hover:opacity-70",
                  colorTheme === 'dark' 
                    ? (isLast ? "text-green-700" : "text-gray-400") 
                    : (isLast ? "text-green-100" : "text-green-100/60")
                )}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </Link>
              
              {!isLast && (
                <span className={cn(
                  "text-body-m font-medium",
                  colorTheme === 'dark' ? "text-gray-300" : "text-green-100/40"
                )}>
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};