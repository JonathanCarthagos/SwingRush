import type { Transition, ViewportOptions } from "framer-motion";

export const OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const;

export const IN_VIEW_VIEWPORT = {
  once: true,
  margin: "-10% 0px",
} satisfies ViewportOptions;

export const REVEAL_TRANSITION = {
  duration: 1.2,
  ease: OUT_CUBIC,
} satisfies Transition;
