"use client";

import { useReducedMotion } from "framer-motion";

import { RevealText } from "@/components/motion";
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

      <RevealText
        as="h1"
        text={heading}
        className="relative z-10 box-border max-w-[calc(100vw-2rem)] whitespace-pre-line px-[0.08em] text-center font-display text-hero leading-[0.84] text-white"
      />
    </section>
  );
}
