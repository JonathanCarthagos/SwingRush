import Link from "next/link";

import { DisplayHeading } from "@/components/ui/display-heading";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CtaVariant = "brand" | "inverted" | "solid";
type CtaButtonVariant = "on-brand" | "outline";

const lockedBandHeight =
  "min-h-[28.75rem] min-[768px]:h-[clamp(28.75rem,calc(15.625rem+27.34375vw),37.5rem)] min-[768px]:min-h-0 min-[1280px]:h-[37.5rem]";

const CTA_VARIANTS: Record<
  CtaVariant,
  {
    heading: string;
    sectionClassName: string;
    contentClassName: string;
    headingClassName: string;
    bodyClassName: string;
    headingWrap: boolean;
    buttonVariant: CtaButtonVariant | null;
    buttonClassName: string;
  }
> = {
  brand: {
    heading: "JUMP INTO\nTHE ARENA",
    sectionClassName: cn("bg-brand", lockedBandHeight),
    contentClassName: "",
    headingClassName: "text-brand-dark",
    bodyClassName: "text-brand-dark",
    headingWrap: false,
    buttonVariant: "on-brand",
    buttonClassName: "",
  },
  inverted: {
    heading: "SWING IN\nTHE ARENA",
    sectionClassName: cn("bg-brand-deep", lockedBandHeight),
    contentClassName: "",
    headingClassName: "text-brand",
    bodyClassName: "text-brand",
    headingWrap: false,
    buttonVariant: "outline",
    buttonClassName:
      "min-[1280px]:h-[2.125rem] min-[1280px]:px-[1.35rem] min-[1280px]:py-0 min-[1280px]:text-[1.25rem] min-[1280px]:leading-[1.1] min-[1280px]:tracking-[0.08em]",
  },
  solid: {
    heading: "CONQUER THE SKILLS GAUNTLET",
    sectionClassName: cn(
      "bg-brand",
      "min-h-[22.3125rem] min-[768px]:h-[clamp(22.3125rem,calc(-0.46875rem+47.4609375vw),37.5rem)] min-[768px]:min-h-0 min-[1280px]:h-[37.5rem]",
    ),
    contentClassName: "min-[768px]:max-w-none",
    headingClassName: "w-full min-w-0 text-white",
    bodyClassName: "text-white",
    headingWrap: true,
    buttonVariant: null,
    buttonClassName: "",
  },
};

export interface CtaProps extends React.HTMLAttributes<HTMLElement> {
  variant?: CtaVariant;
  heading?: string;
  keepBreaks?: boolean;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function Cta({
  className,
  variant = "brand",
  heading,
  keepBreaks = false,
  description = "Do you have the skills to complete the world’s first arena golf gauntlet and become a Swingrusher?",
  ctaLabel = "Contact Us",
  ctaHref,
  ...props
}: CtaProps) {
  const styles = CTA_VARIANTS[variant];
  const resolvedHeading = heading ?? styles.heading;
  const desktopHeading = keepBreaks
    ? resolvedHeading
    : resolvedHeading.replace(/\s+/g, " ");

  return (
    <section
      className={cn(
        "relative flex w-full flex-col items-center justify-center overflow-hidden px-[0.9375rem] text-center min-[768px]:px-tablet-gutter",
        styles.sectionClassName,
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex w-full flex-col items-center gap-4 min-[768px]:max-w-[45.75rem] min-[768px]:gap-[clamp(1rem,calc(0.0625rem+1.953125vw),1.625rem)]",
          styles.contentClassName,
        )}
      >
        <div className="flex w-full flex-col items-center gap-[0.8125rem] min-[768px]:gap-4">
          <DisplayHeading
            as="h2"
            text={resolvedHeading}
            wrap={styles.headingWrap}
            className={cn(
              "box-border max-w-[calc(100vw-2rem)] whitespace-pre-line px-[0.08em] font-display text-[4rem] leading-[3.375rem] [text-wrap:balance] min-[768px]:max-w-[calc(100vw-4rem)] min-[768px]:text-[clamp(4rem,calc(0.625rem+7.03125vw),6.25rem)] min-[768px]:leading-[clamp(3.375rem,calc(0.5154375rem+5.957421875vw),5.281375rem)] min-[1280px]:hidden",
              styles.headingClassName,
            )}
          />
          <DisplayHeading
            as="h2"
            text={desktopHeading}
            wrap={styles.headingWrap}
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
        {styles.buttonVariant ? (
          ctaHref ? (
            <Link
              href={ctaHref}
              className={buttonVariants({
                variant: styles.buttonVariant,
                className: styles.buttonClassName,
              })}
            >
              {ctaLabel}
            </Link>
          ) : (
            <Button
              type="button"
              variant={styles.buttonVariant}
              aria-disabled="true"
              tabIndex={-1}
              className={cn(
                "cursor-default active:scale-100",
                styles.buttonClassName,
              )}
            >
              {ctaLabel}
            </Button>
          )
        ) : null}
      </div>
    </section>
  );
}
