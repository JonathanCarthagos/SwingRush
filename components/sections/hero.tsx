"use client";

import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  videoSrc?: string;
  poster?: string;
  heading?: string;
}

export function Hero({
  className,
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
          preload="auto"
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover [object-position:50%_44%]"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      <h1 className="relative z-10 whitespace-pre-line text-center font-display text-hero leading-[0.84] text-white">
        {heading}
      </h1>
    </section>
  );
}
