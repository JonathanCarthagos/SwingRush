"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";

import { cn } from "@/lib/utils";

import { IN_VIEW_VIEWPORT, OUT_CUBIC } from "./motion-tokens";

type RevealTextTag = "h1" | "h2" | "h3";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const lineVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const wordVariants: Variants = {
  hidden: {
    transform: "translate3d(0, 125%, 0) rotate(5deg)",
  },
  visible: {
    transform: "translate3d(0, 0%, 0) rotate(0deg)",
    transition: {
      duration: 1.2,
      ease: OUT_CUBIC,
    },
  },
};

export interface RevealTextProps
  extends Omit<HTMLMotionProps<"h1">, "children"> {
  as: RevealTextTag;
  text: string;
  lineClassName?: string;
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
  wordClassName,
  ...props
}: RevealTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const lines = splitLines(text);
  const content = lines.map((line, lineIndex) => {
    const words = line.split(/\s+/).filter(Boolean);

    return (
      <motion.span
        key={`${line}-${lineIndex}`}
        className={cn("block", lineClassName)}
        aria-hidden
        variants={shouldReduceMotion ? undefined : lineVariants}
      >
        {words.map((word, wordIndex) => (
          <span
            key={`${line}-${word}-${wordIndex}`}
            className="inline-block overflow-hidden px-[0.12em] py-[0.18em] -mx-[0.12em] -my-[0.18em] align-bottom"
          >
            <motion.span
              className={cn("inline-block will-change-transform", wordClassName)}
              variants={
                shouldReduceMotion
                  ? {
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { duration: 0.2, ease: OUT_CUBIC },
                      },
                    }
                  : wordVariants
              }
            >
              {word}
            </motion.span>
            {wordIndex < words.length - 1 ? "\u00a0" : null}
          </span>
        ))}
      </motion.span>
    );
  });

  const sharedProps = {
    className,
    "aria-label": text.replace(/\s+/g, " ").trim(),
    initial: "hidden",
    whileInView: "visible",
    viewport: IN_VIEW_VIEWPORT,
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
