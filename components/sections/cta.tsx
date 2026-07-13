import Link from "next/link";

import { RevealText } from "@/components/motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CtaProps extends React.HTMLAttributes<HTMLElement> {
  heading?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function Cta({
  className,
  heading = "JUMP INTO\nTHE ARENA",
  description = "Do you have the skills to complete the world’s first arena golf gauntlet and become a Swingrusher?",
  ctaLabel = "Contact Us",
  ctaHref,
  ...props
}: CtaProps) {
  return (
    <section
      className={cn(
        "relative left-1/2 right-1/2 -mx-[50vw] flex min-h-[28.4375rem] w-screen flex-col items-center justify-center bg-brand px-[0.96rem] text-center",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex flex-col items-center gap-[0.834rem]">
          <RevealText
            as="h2"
            text={heading}
            className="box-border max-w-[calc(100vw-2rem)] whitespace-pre-line px-[0.08em] font-display text-[clamp(3.25rem,15.5vw,4rem)] leading-[0.86] text-brand-dark [text-wrap:balance]"
          />
          <p className="max-w-[16.85rem] font-body text-[1.0625rem] leading-[1.3] tracking-body text-brand-dark">
            {description}
          </p>
        </div>
        {ctaHref ? (
          <Link href={ctaHref} className={buttonVariants({ size: "cta" })}>
            {ctaLabel}
          </Link>
        ) : (
          <Button size="cta">{ctaLabel}</Button>
        )}
      </div>
    </section>
  );
}
