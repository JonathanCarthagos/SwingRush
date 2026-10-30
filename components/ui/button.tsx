import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

// Instant brand fill on hover. Desktop background overrides (e.g. hero glass)
// stay behind the hovered state because the breakpoint+hover utility wins.
const BRAND_HOVER_FILL =
  "hover:border-brand hover:bg-brand focus-visible:border-brand focus-visible:bg-brand min-[1280px]:hover:border-brand min-[1280px]:hover:bg-brand min-[1280px]:focus-visible:border-brand min-[1280px]:focus-visible:bg-brand";
const BRAND_HOVER_TEXT_WHITE =
  "hover:text-white focus-visible:text-white";
const BRAND_HOVER_TEXT_DEEP =
  "hover:text-brand-deep focus-visible:text-brand-deep";

const buttonVariants = cva(
  "inline-flex h-[2.375rem] items-center justify-center rounded-none px-5 py-0 font-body text-[1.0625rem] font-medium uppercase leading-[1.1] tracking-[0.08em] [transition:color_220ms_cubic-bezier(0.23,1,0.32,1),background-color_220ms_cubic-bezier(0.23,1,0.32,1),border-color_220ms_cubic-bezier(0.23,1,0.32,1),transform_160ms_cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        outline: `border border-brand bg-transparent text-brand ${BRAND_HOVER_FILL} ${BRAND_HOVER_TEXT_DEEP}`,
        "outline-white": `border border-white bg-transparent text-white ${BRAND_HOVER_FILL} ${BRAND_HOVER_TEXT_DEEP}`,
        solid: "bg-brand text-white",
        inverse: `bg-white text-brand ${BRAND_HOVER_FILL} ${BRAND_HOVER_TEXT_WHITE}`,
        dark: "bg-brand-deep text-brand",
        "on-brand": "bg-brand text-brand-deep",
        glass: `bg-white/20 text-white ${BRAND_HOVER_FILL} ${BRAND_HOVER_TEXT_WHITE}`,
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
