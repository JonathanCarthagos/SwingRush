import Image from "next/image";

import { DisplayHeading } from "@/components/ui/display-heading";
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

function stackedTitle(title: string, stack: boolean) {
  const trimmed = title.trim().replace(/\s+/g, " ");
  const breakAt = trimmed.indexOf(" ");

  if (!stack) return trimmed;

  if (breakAt === -1) return trimmed;

  return `${trimmed.slice(0, breakAt)}\n${trimmed.slice(breakAt + 1)}`;
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
  return (
    <section
      className={cn(
        // Sits below the solid header: the offsets mirror the header height in nav.tsx.
        "relative mt-nav-offset flex h-[16.75rem] items-center justify-center overflow-hidden bg-brand px-4 text-center text-white",
        "min-[768px]:mt-[clamp(3.375rem,calc(-0.5625rem+8.203125vw),6rem)] min-[768px]:h-[clamp(20rem,calc(100vw*658/1680),41.125rem)]",
        "min-[1280px]:mt-24",
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
        align="center"
        text={stackedTitle(title, stackTitleOnMobile)}
        lineClassName="min-[768px]:inline min-[768px]:not-last:after:content-['\00a0']"
        className="relative z-10 box-border max-w-full font-display text-[4rem] uppercase leading-[3.375rem] text-white min-[768px]:whitespace-nowrap min-[768px]:text-[clamp(4rem,calc(100vw*200/1680),12.5rem)] min-[768px]:leading-[0.84]"
      />
    </section>
  );
}
