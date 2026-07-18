import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-body tracking-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid:
          "bg-brand-dark text-white hover:bg-brand-dark/90 focus-visible:ring-brand-dark",
        outline:
          "border border-brand-dark text-brand-dark bg-transparent hover:bg-brand-dark/5 focus-visible:ring-brand-dark",
        ghost:
          "text-brand-dark bg-transparent hover:bg-brand-dark/10 focus-visible:ring-brand-dark",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-12 px-6 text-lg",
        cta: "h-[2.125rem] px-5 py-1.5 text-[1.0625rem] font-medium",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { buttonVariants };
