import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-none px-5 py-[9px] font-body text-[1.0625rem] font-medium uppercase leading-[1.1] tracking-[0.08em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current active:scale-[0.97] motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        outline: "border border-brand bg-transparent text-brand",
        "outline-white": "border border-white bg-transparent text-white",
        solid: "bg-brand text-white",
        inverse: "bg-white text-brand",
        dark: "bg-brand-deep text-brand",
        "on-brand": "bg-brand text-brand-deep",
        glass: "bg-white/20 text-white",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, className }))}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { buttonVariants };
