"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";

import type { LocationHeroMedia } from "@/types/location-detail";

export interface LocationVideoHeroProps {
  media: LocationHeroMedia;
}

export function LocationVideoHero({ media }: LocationVideoHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label={media.ariaLabel}
      className="relative h-[20.4rem] w-full overflow-hidden bg-black"
      data-nav-hero=""
    >
      <div className="absolute inset-x-0 bottom-0 top-[3.625rem] overflow-hidden bg-black">
        {shouldReduceMotion ? (
          <Image
            src={media.posterSrc}
            alt=""
            fill
            priority
            sizes="(max-width: 479px) 100vw, 0px"
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

      <span
        aria-hidden="true"
        data-nav-hero-boundary=""
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5"
      />
    </section>
  );
}
