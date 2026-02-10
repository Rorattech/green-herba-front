interface SectionHeaderProps {
  title: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export default function SectionHeader({ title, buttonText, onButtonClick }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 md:px-0 mb-8">
      <h2 className="text-4xl font-serif text-[#1a3014]">{title}</h2>
      <button 
        onClick={onButtonClick}
        className="bg-[#1a3014] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2a4522] transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}