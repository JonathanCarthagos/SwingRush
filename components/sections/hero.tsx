"use client";

import {
  motion,
  useAnimationControls,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { DisplayHeading } from "@/components/ui/display-heading";
import { cn } from "@/lib/utils";

const CUE_INITIAL_DELAY_MS = 2000;
const CUE_INTERVAL_MS = 15000;
const CUE_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];
const CUE_REST_STATE = {
  opacity: 1,
  transform: "translate3d(0, 0, 0)",
} as const;

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  webmSrc?: string;
  videoSrc?: string;
  poster?: string;
  heading?: string;
}

interface HeroScrollCueProps {
  reduce: boolean | null;
}

function HeroScrollCue({ reduce }: HeroScrollCueProps) {
  const cueRef = useRef<HTMLAnchorElement>(null);
  const isInView = useInView(cueRef, { amount: 0.5 });
  const controls = useAnimationControls();
  const nextPulseAtRef = useRef<number | null>(null);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);

  useEffect(() => {
    const updateDocumentVisibility = () => {
      setIsDocumentVisible(document.visibilityState === "visible");
    };

    updateDocumentVisibility();
    document.addEventListener("visibilitychange", updateDocumentVisibility);

    return () =>
      document.removeEventListener(
        "visibilitychange",
        updateDocumentVisibility,
      );
  }, []);

  useEffect(() => {
    if (!reduce && isInView && isDocumentVisible) return;

    controls.stop();
    controls.set(CUE_REST_STATE);
  }, [controls, isDocumentVisible, isInView, reduce]);

  useEffect(() => {
    if (reduce || !isInView || !isDocumentVisible) return;

    let timeoutId: number;

    const scheduleNextPulse = () => {
      const now = Date.now();

      if (nextPulseAtRef.current === null) {
        nextPulseAtRef.current = now + CUE_INITIAL_DELAY_MS;
      }

      const remainingDelay = Math.max(0, nextPulseAtRef.current - now);

      timeoutId = window.setTimeout(() => {
        const pulseStartedAt = Date.now();
        nextPulseAtRef.current = pulseStartedAt + CUE_INTERVAL_MS;

        void controls.start({
          opacity: [1, 1, 0.72, 0.9, 1],
          transform: [
            "translate3d(0, 0, 0)",
            "translate3d(0, -2px, 0)",
            "translate3d(0, 10px, 0)",
            "translate3d(0, 2px, 0)",
            "translate3d(0, 0, 0)",
          ],
          transition: {
            duration: 1.2,
            ease: CUE_EASE,
            times: [0, 0.22, 0.56, 0.8, 1],
          },
        });

        scheduleNextPulse();
      }, remainingDelay);
    };

    scheduleNextPulse();
    return () => window.clearTimeout(timeoutId);
  }, [controls, isDocumentVisible, isInView, reduce]);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 z-10 flex justify-center",
        "bottom-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.75rem))]",
      )}
    >
      <a
        ref={cueRef}
        href="#arena"
        aria-label="Scroll to next section"
        className="pointer-events-auto relative inline-flex size-12 items-center justify-center rounded-full text-white opacity-95 outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        <motion.span
          aria-hidden="true"
          className="relative z-10 flex items-center justify-center"
          initial={false}
          animate={controls}
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
        </motion.span>
      </a>
    </div>
  );
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
      data-nav-hero=""
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

      <HeroScrollCue reduce={shouldReduceMotion} />

      <span
        aria-hidden="true"
        data-nav-hero-boundary=""
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5"
      />
    </section>
  );
}
