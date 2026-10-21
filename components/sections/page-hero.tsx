import Image from "next/image";

import { DisplayHeading } from "@/components/ui/display-heading";
import { heroLineEm, heroWords, pageHeroHeading } from "@/lib/hero-title";
import { PAGE_HERO_FRAME_CLASS } from "@/lib/layout/hero-shell";
import { cn } from "@/lib/utils";

export interface PageHeroImage {
  mobile: string;
  desktop: string;
}

export type PageHeroTone = "dark" | "deep";

const TONE_SCREEN_CLASS: Record<PageHeroTone, string> = {
  dark: "bg-brand-dark",
  deep: "bg-brand-deep",
};

export interface PageHeroProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: string;
  image: PageHeroImage;
  /**
   * Applies the brand duotone (screen + multiply) over a raw photo.
   * Omit it when the image is already graded, or the tint is applied twice.
   */
  tone?: PageHeroTone;
  /** Breaks the title after its first word below 768px; it stays on one line from tablet up. */
  stackTitleOnMobile?: boolean;
  imageClassName?: string;
}

export function PageHero({
  title,
  image,
  tone,
  stackTitleOnMobile = false,
  imageClassName = "object-center",
  className,
  ...props
}: PageHeroProps) {
  const words = heroWords(title);

  return (
    <section
      className={cn(
        // Sits below the solid header: the offsets mirror the header height in nav.tsx.
        // Tablet height is proportional to the 1680 frame, capped at 45svh so landscape tablets still show the content below.
        PAGE_HERO_FRAME_CLASS,
        className,
      )}
      {...props}
    >
      <div aria-hidden="true" className="absolute inset-0 isolate">
        <Image
          src={image.mobile}
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
          className={cn("object-cover min-[768px]:hidden", imageClassName)}
        />
        <Image
          src={image.desktop}
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
          className={cn("hidden object-cover min-[768px]:block", imageClassName)}
        />
        {tone ? (
          <>
            <div className={cn("absolute inset-0 mix-blend-screen", TONE_SCREEN_CLASS[tone])} />
            <div className="absolute inset-0 bg-brand mix-blend-multiply" />
          </>
        ) : null}
      </div>

      <DisplayHeading
        as="h1"
        text={pageHeroHeading(words, stackTitleOnMobile)}
        lineClassName="min-[768px]:inline min-[768px]:not-last:after:content-['\00a0']"
        style={{ "--page-hero-title-em": heroLineEm(words) } as React.CSSProperties}
        className="relative z-10 box-border w-full min-w-0 max-w-full px-[0.08em] text-center font-display text-[clamp(3.25rem,calc((100vw-2rem)/4.55),5.7rem)] uppercase leading-[0.84] text-white min-[768px]:text-[min(12.5rem,max(4rem,calc(100vw*200/1680)),calc((100vw-3rem)/var(--page-hero-title-em)))] min-[768px]:leading-[0.84] min-[768px]:whitespace-nowrap"
      />
    </section>
  );
}
