"use client";

import { useReducedMotion } from "framer-motion";
import type { MouseEvent } from "react";

import { RevealText } from "@/components/motion";
import { getCurrentLenis } from "@/components/motion/smooth-scroll-layout";
import { cn } from "@/lib/utils";

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  webmSrc?: string;
  videoSrc?: string;
  poster?: string;
  heading?: string;
}

export function Hero({
  className,
  webmSrc = "/videos/Sizzzle%20one.webm",
  videoSrc = "/videos/Sizzzle%20one.mp4",
  poster = "/images/hero-poster.jpg",
  heading = "READY\nSET\nGOLF",
  ...props
}: HeroProps) {
  const shouldReduceMotion = useReducedMotion();

  function getNavOffset() {
    return document.querySelector("header")?.getBoundingClientRect().height ?? 0;
  }

  function clearHash() {
    const { pathname, search } = window.location;
    window.history.replaceState(null, "", `${pathname}${search}`);
  }

  function handleScrollCueClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    const arenaSection = document.getElementById("arena");

    if (!arenaSection) return;

    const navOffset = getNavOffset();
    const lenis = getCurrentLenis();

    clearHash();

    if (shouldReduceMotion || !lenis) {
      const top =
        arenaSection.getBoundingClientRect().top + window.scrollY - navOffset;

      window.scrollTo({
        top: Math.max(0, top),
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });

      return;
    }

    lenis.scrollTo(arenaSection, {
      offset: -navOffset,
      duration: 1.1,
      easing: (value) => 1 - Math.pow(1 - value, 3),
      onStart: clearHash,
      onComplete: clearHash,
    });
  }

  return (
    <section
      className={cn(
        "relative left-1/2 right-1/2 -mx-[50vw] flex h-svh w-screen items-center justify-center overflow-hidden bg-black",
        className,
      )}
      {...props}
    >
      {shouldReduceMotion ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover [object-position:50%_44%]"
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover [object-position:50%_44%]"
        >
          <source src={webmSrc} type="video/webm" />
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      <RevealText
        as="h1"
        text={heading}
        className="relative z-10 box-border max-w-[calc(100vw-2rem)] whitespace-pre-line px-[0.08em] text-center font-display text-hero leading-[0.84] text-white"
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 z-10 flex justify-center",
          "bottom-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.75rem))]",
        )}
      >
        <a
          href="#arena"
          data-ready="true"
          aria-label="Scroll to next section"
          onClick={handleScrollCueClick}
          className={cn(
            "hero-scroll-cue group pointer-events-auto relative inline-flex size-12 items-center justify-center rounded-full text-white opacity-95 outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
            shouldReduceMotion && "motion-reduce:opacity-100",
          )}
        >
          <span
            aria-hidden="true"
            className="hero-scroll-cue__halo absolute inset-0 rounded-full"
          />
          <span
            aria-hidden="true"
            className="hero-scroll-cue__icon-wrap relative z-10 flex items-center justify-center"
          >
            <svg
              viewBox="0 0 53 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="hero-scroll-cue__icon block w-[2.85rem] overflow-visible"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M2 2L26.5 25L51 2"
                stroke="currentColor"
                strokeWidth="1.65"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
}
