import Image from "next/image";

import { DisplayHeading } from "@/components/ui/display-heading";
import { CHALLENGES_PAGE_CONTENT } from "@/data/challenges";
import { cn } from "@/lib/utils";

const DESKTOP_HERO_IMAGE = "/images/challenges/hero-desktop.jpg";
const MOBILE_HERO_IMAGE = "/images/challenges/hero-mobile.jpg";

export interface ChallengesHeroProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
}

function stackedTitle(title: string) {
  const trimmed = title.trim();
  const breakAt = trimmed.indexOf(" ");

  if (breakAt === -1) return trimmed;

  return `${trimmed.slice(0, breakAt)}\n${trimmed.slice(breakAt + 1).trim()}`;
}

export function ChallengesHero({
  className,
  title = CHALLENGES_PAGE_CONTENT.title,
  ...props
}: ChallengesHeroProps) {
  return (
    <section
      className={cn("relative h-svh overflow-hidden bg-brand text-white", className)}
      {...props}
      data-nav-hero=""
    >
      <div aria-hidden="true" className="absolute inset-0 isolate">
        <Image
          src={MOBILE_HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center min-[768px]:hidden"
        />
        <Image
          src={DESKTOP_HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-[68%_72%] min-[768px]:block"
        />
        <div className="absolute inset-0 bg-brand-dark mix-blend-screen" />
        <div className="absolute inset-0 bg-brand mix-blend-multiply" />
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
        <DisplayHeading
          as="h1"
          text={stackedTitle(title)}
          className="box-border max-w-full px-[0.08em] font-display text-[4rem] leading-[3.375rem] text-white min-[1280px]:hidden"
        />
        <DisplayHeading
          as="h1"
          text={title.replace(/\s+/g, " ")}
          className="box-border hidden max-w-none px-[0.08em] font-display leading-[0.84] text-white min-[1280px]:block min-[1280px]:text-[clamp(9.5rem,calc(-0.1rem+12vw),12.5rem)]"
        />
      </div>

      <span
        aria-hidden="true"
        data-nav-hero-boundary=""
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5"
      />
    </section>
  );
}
