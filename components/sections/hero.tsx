"use client";

import { useReducedMotion } from "framer-motion";

import { DisplayHeading } from "@/components/ui/display-heading";
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

      <DisplayHeading
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
          aria-label="Scroll to next section"
          className="pointer-events-auto relative inline-flex size-12 items-center justify-center rounded-full text-white opacity-95 outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <span
            aria-hidden="true"
            className="relative z-10 flex items-center justify-center"
          >
            <svg
              viewBox="0 0 53 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="block w-[2.85rem] overflow-visible"
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
