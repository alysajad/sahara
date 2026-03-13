import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00cc68]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#131517] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[#00cc68] text-[#131517] hover:bg-[#00ff82] font-semibold",
        destructive:
          "bg-[#f04b4b]/20 text-[#f04b4b] border border-[#f04b4b]/30 hover:bg-[#f04b4b]/30",
        outline:
          "border border-white/[0.1] bg-transparent text-white hover:bg-white/[0.06] hover:border-white/[0.2]",
        secondary:
          "bg-white/[0.06] text-white hover:bg-white/[0.1]",
        ghost: "text-[#a4a4a4] hover:text-white hover:bg-white/[0.06]",
        link: "text-[#00cc68] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
