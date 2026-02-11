"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";

interface SectionHeaderProps {
  title: string;
  buttonText: string;
  buttonLink?: string;
  onButtonClick?: () => void;
}

export default function SectionHeader({ title, buttonText, buttonLink, onButtonClick }: SectionHeaderProps) {
  const router = useRouter();

  const handleClick = () => {
    if (buttonLink) router.push(buttonLink);
    onButtonClick?.();
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-8">
      <h2 className="text-h3 md:text-h2 text-green-800">
        {title}
      </h2>

      <Button 
        variant="primary" 
        colorTheme="green" 
        onClick={handleClick}
      >
        {buttonText}
      </Button>
    </div>
  );
}