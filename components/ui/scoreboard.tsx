"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

import { cn } from "@/lib/utils";

const REEL_LENGTH = 16;
const RESHUFFLE_MS = 8000;
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Seeded PRNG (mulberry32) so reels are deterministic across SSR/client
// renders — Math.random() here would cause hydration mismatches.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function reelSeed(row: number, slot: number, cycle: number) {
  return (
    (Math.imul(row + 1, 0x9e3779b1) ^
      Math.imul(slot + 1, 0x85ebca6b) ^
      Math.imul(cycle + 1, 0xc2b2ae35)) >>>
    0
  );
}

/**
 * Reel column for one slot: random glyphs ending on the target letter.
 * Cycle 0 starts blank (board "powers on"); later cycles start on the
 * target letter so the 8s re-shuffle remount is seamless (no flick).
 */
function buildReel(
  target: string,
  row: number,
  slot: number,
  cycle: number,
): string[] {
  const rand = mulberry32(reelSeed(row, slot, cycle));
  const chars: string[] = [];
  for (let i = 0; i < REEL_LENGTH; i++) {
    let c = CHARSET[Math.floor(rand() * CHARSET.length)];
    while (i > 0 && c === chars[i - 1]) {
      c = CHARSET[Math.floor(rand() * CHARSET.length)];
    }
    chars.push(c);
  }
  const resolved = target === " " ? "" : target;
  chars[REEL_LENGTH - 1] = resolved;
  chars[0] = cycle === 0 ? "" : resolved;
  return chars;
}

// Board -> rows -> slots cascade. Row-level stagger keeps the number of
// simultaneously blurred reels bounded on mobile.
const boardVariants: Variants = {
  rest: {},
  spin: { transition: { staggerChildren: 0.15 } },
};

const rowVariants: Variants = {
  rest: {},
  spin: { transition: { delayChildren: 0.2, staggerChildren: 0.08 } },
};

const reelVariants: Variants = {
  rest: { y: "0%", filter: "blur(0px)" },
  spin: {
    // Land the last glyph centered in the slot.
    y: `-${((REEL_LENGTH - 1) / REEL_LENGTH) * 100}%`,
    filter: ["blur(0px)", "blur(6px)", "blur(0px)"],
    transition: {
      y: { duration: 1.2, ease: [0.85, 0, 0.15, 1] },
      filter: { duration: 1.2, times: [0, 0.5, 1], ease: "linear" },
    },
  },
};

// Tile metrics sampled from the Figma asset (126x267px tiles at 0.322 scale).
const slotClass =
  "relative h-[5.375rem] w-10 shrink-0 overflow-hidden rounded-[0.5625rem] bg-[#3f3f3f]";
const glyphClass =
  "flex h-[5.375rem] items-center justify-center font-nav text-[4rem] leading-none text-white";
const foldLineClass =
  "pointer-events-none absolute inset-x-0 top-1/2 h-[0.09375rem] -translate-y-1/2 bg-black/60";

export interface ScoreboardProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: string[];
}

export function Scoreboard({ rows, className, ...props }: ScoreboardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  // Sticky trigger: once the board has entered the viewport it stays "played".
  const played = useInView(ref, { amount: 0.35, once: true });
  const shouldReduceMotion = useReducedMotion();
  const [cycle, setCycle] = useState(0);

  // Airport-board re-shuffle while visible.
  useEffect(() => {
    if (!inView || shouldReduceMotion) return;
    const id = setInterval(() => setCycle((c) => c + 1), RESHUFFLE_MS);
    return () => clearInterval(id);
  }, [inView, shouldReduceMotion]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={rows.join(", ")}
      className={cn("w-full overflow-hidden", className)}
      {...props}
    >
      {shouldReduceMotion ? (
        <div aria-hidden className="flex flex-col gap-[0.28125rem]">
          {rows.map((row) => (
            <div key={row} className="flex w-max gap-0.5">
              {Array.from(row).map((char, slotIndex) => (
                <div key={slotIndex} className={slotClass}>
                  <span className={glyphClass}>
                    {char === " " ? "" : char}
                  </span>
                  <span className={foldLineClass} />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          key={cycle}
          aria-hidden
          className="flex flex-col gap-[0.28125rem]"
          variants={boardVariants}
          initial="rest"
          animate={played ? "spin" : "rest"}
        >
          {rows.map((row, rowIndex) => (
            <ScoreboardRow
              key={row}
              row={row}
              rowIndex={rowIndex}
              cycle={cycle}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

interface ScoreboardRowProps {
  row: string;
  rowIndex: number;
  cycle: number;
}

function ScoreboardRow({ row, rowIndex, cycle }: ScoreboardRowProps) {
  return (
    <motion.div className="flex w-max gap-0.5" variants={rowVariants}>
      {Array.from(row).map((char, slotIndex) => (
        <LetterSlot
          key={slotIndex}
          target={char}
          rowIndex={rowIndex}
          slotIndex={slotIndex}
          cycle={cycle}
        />
      ))}
    </motion.div>
  );
}

interface LetterSlotProps {
  target: string;
  rowIndex: number;
  slotIndex: number;
  cycle: number;
}

function LetterSlot({ target, rowIndex, slotIndex, cycle }: LetterSlotProps) {
  const reel = useMemo(
    () => buildReel(target, rowIndex, slotIndex, cycle),
    [target, rowIndex, slotIndex, cycle],
  );

  return (
    <div className={slotClass}>
      <motion.div
        className="absolute inset-x-0 top-0 flex flex-col will-change-transform"
        variants={reelVariants}
      >
        {reel.map((char, i) => (
          <span key={i} className={glyphClass}>
            {char}
          </span>
        ))}
      </motion.div>
      <span className={foldLineClass} />
    </div>
  );
}
