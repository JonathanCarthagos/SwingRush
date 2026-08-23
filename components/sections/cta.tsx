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

const RESPONSIVE_CTA_ACTION_CLASS =
  "min-[768px]:h-[clamp(1.875rem,calc(1.5rem+0.78125vw),2.125rem)] min-[768px]:w-[clamp(6.875rem,calc(5.375rem+3.125vw),7.8875rem)] min-[768px]:rounded-[1.1475rem] min-[768px]:px-[1.35rem] min-[768px]:py-[0.405rem] min-[768px]:text-[clamp(1.0625rem,calc(0.78125rem+0.5859375vw),1.25rem)] min-[768px]:leading-[1.1] min-[768px]:tracking-[0.08em]";

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
        "relative flex min-h-[28.4375rem] w-full flex-col items-center justify-center overflow-hidden px-[0.96rem] text-center min-[768px]:h-tablet-band min-[768px]:min-h-0 min-[768px]:px-tablet-gutter min-[1280px]:h-[37.5rem]",
        styles.sectionClassName,
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-2.5 min-[768px]:w-full min-[768px]:max-w-[45.75rem] min-[768px]:gap-[clamp(1.25rem,2.03125vw,1.625rem)]">
        <div className="flex flex-col items-center gap-[0.834rem] min-[768px]:w-full min-[768px]:gap-4">
          <DisplayHeading
            as="h2"
            text={resolvedHeading}
            className={cn(
              "box-border max-w-[calc(100vw-2rem)] whitespace-pre-line px-[0.08em] font-display text-[clamp(3.25rem,15.5vw,4rem)] leading-[0.86] [text-wrap:balance] min-[768px]:max-w-[calc(100vw-4rem)] min-[768px]:text-[clamp(4.5rem,calc(1.875rem+5.46875vw),6.25rem)] min-[1280px]:hidden",
              styles.headingClassName,
            )}
          />
          <DisplayHeading
            as="h2"
            text={resolvedHeading.replace(/\s+/g, " ")}
            className={cn(
              "hidden px-[0.08em] font-display min-[1280px]:block min-[1280px]:text-[6.25rem] min-[1280px]:leading-[5.281375rem]",
              styles.headingClassName,
            )}
          />
          <p
            className={cn(
              "max-w-[16.85rem] font-body text-[1.0625rem] leading-[1.3] tracking-body min-[768px]:w-full min-[768px]:max-w-[36.662125rem] min-[768px]:text-[clamp(1.0625rem,calc(0.40625rem+1.3671875vw),1.5rem)]",
              styles.bodyClassName,
            )}
          >
            {description}
          </p>
        </div>
        {ctaHref ? (
          <Link
            href={ctaHref}
            className={cn(
              buttonVariants({ size: "cta" }),
              RESPONSIVE_CTA_ACTION_CLASS,
              styles.buttonClassName,
            )}
          >
            {ctaLabel}
          </Link>
        ) : (
          <Button
            type="button"
            size="cta"
            aria-disabled="true"
            tabIndex={-1}
            className={cn(
              RESPONSIVE_CTA_ACTION_CLASS,
              styles.buttonClassName,
              "cursor-default hover:bg-brand active:scale-100",
            )}
          >
            {ctaLabel}
          </Button>
        )}
      </div>
    </section>
  );
}
