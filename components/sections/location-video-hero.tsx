"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

import { DisplayHeading } from "@/components/ui/display-heading";
import { heroLineEm, heroWords } from "@/lib/hero-title";
import { LOCATION_HERO_NAV_VAR_CLASS } from "@/lib/layout/hero-shell";
import { cn } from "@/lib/utils";
import type { LocationHeroMedia } from "@/types/location-detail";

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export interface LocationVideoHeroProps {
  media: LocationHeroMedia;
  title: string;
  /** The desktop city title over the video. Pages that set the title below the video turn it off. */
  showTitle?: boolean;
  className?: string;
}

export function LocationVideoHero({
  media,
  title,
  showTitle = true,
  className,
}: LocationVideoHeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const stillRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const reducedQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const video = videoRef.current;

    // Reduced motion renders only the still: give it the poster for the current breakpoint.
    if (!video) {
      const applyStill = () => {
        const still = stillRef.current;
        const nextPoster = desktopQuery.matches
          ? media.posterSrc
          : media.mobilePosterSrc;
        if (still && still.getAttribute("src") !== nextPoster) {
          still.src = nextPoster;
        }
      };

      applyStill();
      desktopQuery.addEventListener("change", applyStill);
      return () => desktopQuery.removeEventListener("change", applyStill);
    }

    const sources = video.querySelectorAll("source");
    const webmSource = sources[0];
    const mp4Source = sources[1];

    let cancelPendingPlay = () => {};

    const applySource = () => {
      const desktop = desktopQuery.matches;
      const nextVariant = desktop ? "desktop" : "mobile";
      const nextWebm = desktop ? media.webmSrc : media.mobileWebmSrc;
      const nextMp4 = desktop ? media.mp4Src : media.mobileMp4Src;
      const nextPoster = desktop ? media.posterSrc : media.mobilePosterSrc;

      if (reducedQuery.matches) {
        const still = stillRef.current;
        if (still && still.getAttribute("src") !== nextPoster) {
          still.src = nextPoster;
        }
        video.pause();
        return;
      }

      const sourceChanged = video.dataset.variant !== nextVariant;
      video.dataset.variant = nextVariant;

      if (webmSource) webmSource.src = nextWebm;
      if (mp4Source) mp4Source.src = nextMp4;
      video.poster = nextPoster;

      const playOrPause = () => {
        void video.play().catch(() => undefined);
      };

      cancelPendingPlay();

      if (!sourceChanged) {
        playOrPause();
        return;
      }

      video.addEventListener("loadeddata", playOrPause, { once: true });
      cancelPendingPlay = () =>
        video.removeEventListener("loadeddata", playOrPause);
      video.load();
    };

    applySource();
    desktopQuery.addEventListener("change", applySource);
    reducedQuery.addEventListener("change", applySource);
    window.addEventListener("resize", applySource);

    return () => {
      cancelPendingPlay();
      desktopQuery.removeEventListener("change", applySource);
      reducedQuery.removeEventListener("change", applySource);
      window.removeEventListener("resize", applySource);
    };
  }, [
    shouldReduceMotion,
    media.mobileMp4Src,
    media.mobilePosterSrc,
    media.mobileWebmSrc,
    media.mp4Src,
    media.posterSrc,
    media.webmSrc,
  ]);

  return (
    <section
      aria-label={media.ariaLabel}
      className={cn(
        "relative h-[20.4rem] w-full overflow-hidden bg-black min-[1280px]:h-[41.125rem]",
        // Tablet: the header height plus the whole 16:9 frame (width × 9/16), never taller than the screen,
        // so the clip is not cropped top and bottom.
        LOCATION_HERO_NAV_VAR_CLASS,
        "min-[768px]:h-[calc(var(--location-hero-nav)_+_min(56.25vw,100svh_-_var(--location-hero-nav)))]",
        className,
      )}
    >
      {/* Starts below the solid header: the inset follows the header height at every breakpoint. */}
      <div className="absolute inset-x-0 bottom-0 top-nav-offset overflow-hidden bg-black min-[768px]:top-[var(--location-hero-nav)] min-[1280px]:top-24">
        {shouldReduceMotion ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={stillRef}
            alt=""
            aria-hidden
            className="h-full w-full object-cover [object-position:50%_44%]"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="h-full w-full object-cover [object-position:50%_44%]"
          >
            <source src={media.webmSrc} type="video/webm" />
            <source src={media.mp4Src} type="video/mp4" />
          </video>
        )}
      </div>

      {showTitle ? (
        <div className="absolute inset-0 z-10 hidden items-center justify-center min-[1280px]:flex">
          <DisplayHeading
            as="h1"
            text={heroWords(title)}
            style={{ "--page-hero-title-em": heroLineEm(title) } as React.CSSProperties}
            className="box-border w-full min-w-0 max-w-full whitespace-nowrap px-[0.08em] text-center font-display text-[min(12.5rem,calc((100vw-3rem)/var(--page-hero-title-em)))] uppercase leading-[0.845] text-white"
          />
        </div>
      ) : null}
    </section>
  );
}
