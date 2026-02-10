import { Button } from "../ui/Button";

interface SectionHeaderProps {
  title: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export default function SectionHeader({ title, buttonText, onButtonClick }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-8">
      <h2 className="text-h3 md:text-h2 text-green-800">
        {title}
      </h2>

      <Button 
        variant="primary" 
        colorTheme="green" 
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>
    </div>
  );
}