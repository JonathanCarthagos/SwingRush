import Link from "next/link";

import { DisplayHeading } from "@/components/ui/display-heading";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CtaVariant = "brand" | "inverted";

const CTA_VARIANTS: Record<
  CtaVariant,
  {
    heading: string;
    sectionClassName: string;
    headingClassName: string;
    bodyClassName: string;
    buttonClassName?: string;
  }
> = {
  brand: {
    heading: "JUMP INTO\nTHE ARENA",
    sectionClassName: "bg-brand",
    headingClassName: "text-brand-dark",
    bodyClassName: "text-brand-dark",
  },
  inverted: {
    heading: "SWING IN\nTHE ARENA",
    sectionClassName: "bg-brand-dark",
    headingClassName: "text-brand",
    bodyClassName: "text-brand",
    buttonClassName: "bg-brand text-brand-dark hover:bg-brand/90 focus-visible:ring-brand",
  },
};

export interface CtaProps extends React.HTMLAttributes<HTMLElement> {
  variant?: CtaVariant;
  heading?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function Cta({
  className,
  variant = "brand",
  heading,
  description = "Do you have the skills to complete the world’s first arena golf gauntlet and become a Swingrusher?",
  ctaLabel = "Contact Us",
  ctaHref,
  ...props
}: CtaProps) {
  const styles = CTA_VARIANTS[variant];
  const resolvedHeading = heading ?? styles.heading;

  return (
    <section
      className={cn(
        "relative left-1/2 right-1/2 -mx-[50vw] flex min-h-[28.4375rem] w-screen flex-col items-center justify-center px-[0.96rem] text-center",
        styles.sectionClassName,
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex flex-col items-center gap-[0.834rem]">
          <DisplayHeading
            as="h2"
            text={resolvedHeading}
            className={cn(
              "box-border max-w-[calc(100vw-2rem)] whitespace-pre-line px-[0.08em] font-display text-[clamp(3.25rem,15.5vw,4rem)] leading-[0.86] [text-wrap:balance]",
              styles.headingClassName,
            )}
          />
          <p
            className={cn(
              "max-w-[16.85rem] font-body text-[1.0625rem] leading-[1.3] tracking-body",
              styles.bodyClassName,
            )}
          >
            {description}
          </p>
        </div>
        {ctaHref ? (
          <Link
            href={ctaHref}
            className={buttonVariants({
              size: "cta",
              className: styles.buttonClassName,
            })}
          >
            {ctaLabel}
          </Link>
        ) : (
          <Button size="cta" className={styles.buttonClassName}>
            {ctaLabel}
          </Button>
        )}
      </div>
    </section>
  );
}
