"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

import { DisplayHeading } from "@/components/ui/display-heading";
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
    const video = videoRef.current;
    if (!video) return;

    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const reducedQuery = window.matchMedia(REDUCED_MOTION_QUERY);
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
        className,
      )}
    >
      {/* Starts below the solid header: the inset follows the header height at every breakpoint. */}
      <div className="absolute inset-x-0 bottom-0 top-nav-offset overflow-hidden bg-black min-[768px]:top-[clamp(3.375rem,calc(-0.5625rem+8.203125vw),6rem)] min-[1280px]:top-24">
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
            text={title}
            className="box-border max-w-none whitespace-nowrap px-[0.08em] text-center font-display text-[12.5rem] uppercase leading-[0.845] text-white"
          />
        </div>
      ) : null}
    </section>
  );
}
