import { cn } from "@/src/utils/cn"


type ButtonVariant = "primary" | "secondary"
type ButtonSize = "md" | "sm"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition cursor-pointer w-fit",
        {
          "bg-green-400 text-white hover:bg-white hover:text-gray-800":
            variant === "primary",

          "bg-green-700 text-white hover:bg-green-500 hover:text-gray-800":
            variant === "secondary",
        },
        {
          "px-5 py-3 text-base": size === "md",
          "px-4 py-2 text-sm": size === "sm",
        },

        className
      )}
      {...props}
    />
  )
}
