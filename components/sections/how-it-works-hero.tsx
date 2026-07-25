"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";

import { DisplayHeading } from "@/components/ui/display-heading";
import { cn } from "@/lib/utils";

const subscribeToHydration = () => () => undefined;
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export interface HowItWorksHeroProps
  extends React.HTMLAttributes<HTMLElement> {
  webmSrc?: string;
  videoSrc?: string;
  poster?: string;
}

export function HowItWorksHero({
  className,
  webmSrc = "/videos/Sizzzle%20one.webm",
  videoSrc = "/videos/Sizzzle%20one.mp4",
  poster = "/images/hero-poster.jpg",
  ...props
}: HowItWorksHeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  const shouldPlayVideo = isHydrated && !shouldReduceMotion;

  return (
    <section
      className={cn(
        "relative min-h-svh w-full overflow-hidden bg-black text-white",
        className,
      )}
      {...props}
      data-nav-hero=""
    >
      <div className="relative h-[clamp(24rem,64svh,33.5rem)] overflow-hidden bg-black">
        <Image
          src={poster}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover [object-position:50%_44%]"
        />

        {shouldPlayVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover [object-position:50%_44%]"
          >
            <source src={webmSrc} type="video/webm" />
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25"
        />

        <div className="absolute inset-0 flex items-center justify-center px-gutter-x pt-nav-offset">
          <DisplayHeading
            as="h1"
            text="HOW IT WORKS"
            className="box-border max-w-[calc(100vw-2rem)] whitespace-nowrap px-[0.08em] text-center font-display text-[clamp(3.75rem,17.5vw,5.25rem)] leading-[0.86] text-white"
          />
        </div>
      </div>

      <div className="relative z-10 mx-gutter-x -mt-[3.25rem] flex min-h-[16.5rem] items-center justify-center bg-brand px-4 py-10 text-center">
        <div className="flex flex-col items-center gap-[0.834rem]">
          <DisplayHeading
            as="h2"
            text={"THE ARENA\nGOLF GAUNTLET"}
            className="box-border max-w-[calc(100vw-4rem)] whitespace-pre-line px-[0.08em] font-display text-[clamp(3rem,14.5vw,3.75rem)] leading-[0.86] text-white [text-wrap:balance]"
          />
          <p className="max-w-[18rem] font-body text-[1.0625rem] leading-[1.3] tracking-body text-white">
            Do you have the skills to complete each golf challenge as fast as
            you can and become a Swingrusher?
          </p>
        </div>
      </div>

      <span
        aria-hidden="true"
        data-nav-hero-boundary=""
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5"
      />
    </section>
  );
}
