"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type ViewportOptions,
  type Variants,
} from "framer-motion";

import { cn } from "@/lib/utils";

type RevealTextTag = "h1" | "h2" | "h3";

const TEXT_REVEAL_VIEWPORT = {
  once: true,
  amount: 0.45,
  margin: "-6% 0px",
} satisfies ViewportOptions;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const lineVariants: Variants = {
  hidden: {},
  visible: {},
};

const wipeVariants: Variants = {
  hidden: {
    transform: "scaleX(1)",
    opacity: 1,
  },
  visible: {
    transform: "scaleX(0)",
    opacity: 0,
    transition: {
      transform: {
        duration: 1.18,
        ease: [0.16, 1, 0.3, 1],
      },
      opacity: {
        duration: 0.22,
        ease: "linear",
        delay: 0.96,
      },
    },
  },
};

export interface RevealTextProps
  extends Omit<HTMLMotionProps<"h1">, "children"> {
  as: RevealTextTag;
  text: string;
  lineClassName?: string;
  wipeClassName?: string;
  wordClassName?: string;
}

function splitLines(text: string) {
  return text.split(/\r?\n/).map((line) => line.trim());
}

export function RevealText({
  as,
  text,
  className,
  lineClassName,
  wipeClassName,
  wordClassName,
  ...props
}: RevealTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const lines = splitLines(text);
  const content = lines.map((line, lineIndex) => (
    <motion.span
      key={`${line}-${lineIndex}`}
      className={cn("block", lineClassName)}
      aria-hidden
      variants={shouldReduceMotion ? undefined : lineVariants}
    >
      <span className="relative inline-block align-bottom">
        <span className={cn("relative z-0", wordClassName)}>{line}</span>
        <motion.span
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-x-[0.14em] -inset-y-[0.12em] z-10 origin-right bg-black will-change-transform motion-reduce:hidden",
            wipeClassName,
          )}
          variants={shouldReduceMotion ? undefined : wipeVariants}
        />
      </span>
    </motion.span>
  ));

  const sharedProps = {
    className: className ? `notranslate ${className}` : "notranslate",
    "aria-label": text.replace(/\s+/g, " ").trim(),
    translate: "no",
    initial: shouldReduceMotion ? false : "hidden",
    whileInView: shouldReduceMotion ? undefined : "visible",
    viewport: shouldReduceMotion ? undefined : TEXT_REVEAL_VIEWPORT,
    variants: shouldReduceMotion ? undefined : containerVariants,
    ...props,
  } satisfies Omit<HTMLMotionProps<"h1">, "children">;

  if (as === "h1") {
    return <motion.h1 {...sharedProps}>{content}</motion.h1>;
  }

  if (as === "h2") {
    return <motion.h2 {...sharedProps}>{content}</motion.h2>;
  }

  return (
    <motion.h3 {...sharedProps}>
      {content}
    </motion.h3>
  );
}
