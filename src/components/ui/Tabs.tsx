import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  variant?: 'pill' | 'underline';
  colorTheme?: 'light' | 'dark';
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs = ({ 
  items, 
  variant = 'pill', 
  colorTheme = 'light', 
  activeTab, 
  onChange 
}: TabsProps) => {
  
  return (
    <div className="w-full">
      <div className="flex overflow-x-auto no-scrollbar pb-1">
        <nav className={cn(
          "flex items-center min-w-max",
          variant === 'pill' ? "gap-2" : "gap-8"
        )}>
          {items.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={cn(
                  "relative transition-all duration-200 cursor-pointer text-body-m font-body font-medium whitespace-nowrap",
                  
                  variant === 'pill' && [
                    "px-6 py-2 rounded-full",
                    isActive 
                      ? (colorTheme === 'light' ? "bg-green-200 text-green-700" : "bg-white text-green-700")
                      : (colorTheme === 'light' ? "text-gray-400 hover:text-green-700" : "text-green-100/60 hover:text-green-100")
                  ],

                  // Estilo UNDERLINE
                  variant === 'underline' && [
                    "pb-2 border-b-2",
                    isActive
                      ? "border-green-700 text-green-700"
                      : "border-transparent text-gray-400 hover:text-green-700"
                  ]
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};