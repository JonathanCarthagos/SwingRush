"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type MotionStyle,
} from "framer-motion";

import { IN_VIEW_VIEWPORT, OUT_CUBIC } from "./motion-tokens";

export interface RevealMediaProps
  extends Omit<HTMLMotionProps<"img">, "alt" | "className" | "src" | "style"> {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  imgStyle?: MotionStyle;
}

export function RevealMedia({
  src,
  alt,
  className,
  imgClassName,
  imgStyle,
  ...imgProps
}: RevealMediaProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        shouldReduceMotion ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" }
      }
      whileInView={
        shouldReduceMotion ? { opacity: 1 } : { clipPath: "inset(0% 0 0 0)" }
      }
      viewport={IN_VIEW_VIEWPORT}
      transition={{ duration: shouldReduceMotion ? 0.2 : 1.2, ease: OUT_CUBIC }}
    >
      <motion.img
        src={src}
        alt={alt}
        className={imgClassName}
        style={imgStyle}
        initial={
          shouldReduceMotion ? undefined : { transform: "scale(1.3)" }
        }
        whileInView={{ transform: "scale(1)" }}
        viewport={IN_VIEW_VIEWPORT}
        transition={{ duration: shouldReduceMotion ? 0 : 1.6, ease: OUT_CUBIC }}
        {...imgProps}
      />
    </motion.div>
  );
}
