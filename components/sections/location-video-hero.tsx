"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";

import { DisplayHeading } from "@/components/ui/display-heading";
import type { LocationHeroMedia } from "@/types/location-detail";

export interface LocationVideoHeroProps {
  media: LocationHeroMedia;
  title: string;
}

export function LocationVideoHero({ media, title }: LocationVideoHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label={media.ariaLabel}
      className="relative h-[20.4rem] w-full overflow-hidden bg-black min-[1280px]:h-[41.125rem]"
      data-nav-hero=""
    >
      <div className="absolute inset-x-0 bottom-0 top-[3.625rem] overflow-hidden bg-black min-[1280px]:top-24">
        {shouldReduceMotion ? (
          <Image
            src={media.posterSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover [object-position:50%_44%]"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={media.posterSrc}
            aria-hidden="true"
            className="h-full w-full object-cover [object-position:50%_44%]"
          >
            <source src={media.webmSrc} type="video/webm" />
            <source src={media.mp4Src} type="video/mp4" />
          </video>
        )}
      </div>

      <div className="absolute inset-0 z-10 hidden items-center justify-center min-[1280px]:flex">
        <DisplayHeading
          as="h1"
          text={title}
          className="box-border max-w-none whitespace-nowrap px-[0.08em] text-center font-display text-[12.5rem] uppercase leading-[0.845] text-white"
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
