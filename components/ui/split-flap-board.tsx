"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const RESHUFFLE_MS = 8000;
const SESSION_ENTER_VISIBILITY = 0.65;
const SESSION_EXIT_VISIBILITY = 0.35;
const ROW_STAGGER_SECONDS = 0.08;
const CHARACTER_STAGGER_SECONDS = 0.06;
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const FLAP_SPRING = {
  type: "spring",
  stiffness: 150,
  damping: 15,
  mass: 1.2,
} as const;

// Tile metrics sampled from the Figma asset (126x267px tiles at 0.322 scale).
const slotClass =
  "relative h-[5.375rem] w-10 shrink-0 overflow-hidden rounded-[0.5625rem] bg-[#3f3f3f] [perspective:1000px]";
const glyphClass =
  "absolute inset-x-0 flex h-[5.375rem] items-center justify-center font-nav text-[4rem] leading-none text-white";
const halfClass =
  "pointer-events-none absolute inset-x-0 h-1/2 overflow-hidden bg-[#3f3f3f]";
const faceClass =
  "pointer-events-none absolute inset-0 overflow-hidden bg-[#3f3f3f] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]";
const foldLineClass =
  "pointer-events-none absolute inset-x-0 top-1/2 z-20 h-[0.09375rem] -translate-y-1/2 bg-black/60";

function normalizeCharacter(character: string) {
  return character === " " ? "" : character;
}

function useVisibilitySession(ref: RefObject<Element | null>) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        setIsActive((currentState) => {
          if (entry.intersectionRatio >= SESSION_ENTER_VISIBILITY) return true;
          if (entry.intersectionRatio < SESSION_EXIT_VISIBILITY) return false;
          return currentState;
        });
      },
      {
        threshold: [
          SESSION_EXIT_VISIBILITY,
          SESSION_ENTER_VISIBILITY,
        ],
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return isActive;
}

function getIntermediateCharacter(
  target: string,
  rowIndex: number,
  slotIndex: number,
  cycle: number,
) {
  if (target === " ") return "";

  const seed =
    (Math.imul(rowIndex + 1, 0x9e3779b1) ^
      Math.imul(slotIndex + 1, 0x85ebca6b) ^
      Math.imul(cycle + 1, 0xc2b2ae35)) >>>
    0;
  const initialIndex = seed % CHARSET.length;

  for (let offset = 0; offset < CHARSET.length; offset += 1) {
    const candidate = CHARSET[(initialIndex + offset) % CHARSET.length];
    if (candidate !== target) return candidate;
  }

  return "";
}

interface FlipStep {
  current: string;
  next: string;
}

function buildFlipSteps(target: string, intermediate: string, cycle: number) {
  const resolvedTarget = normalizeCharacter(target);

  if (!resolvedTarget) {
    return [{ current: "", next: "" }] satisfies FlipStep[];
  }

  if (cycle === 0) {
    return [
      { current: "", next: intermediate },
      { current: intermediate, next: resolvedTarget },
    ] satisfies FlipStep[];
  }

  return [
    { current: resolvedTarget, next: intermediate },
    { current: intermediate, next: resolvedTarget },
  ] satisfies FlipStep[];
}

function StaticCharacter({ character }: { character: string }) {
  const resolvedCharacter = normalizeCharacter(character);

  return (
    <div className={slotClass}>
      <span className={cn(glyphClass, "top-0")}>{resolvedCharacter}</span>
      <span className={foldLineClass} />
    </div>
  );
}

interface SplitFlapCharacterProps {
  target: string;
  intermediate: string;
  rowIndex: number;
  slotIndex: number;
  cycle: number;
  active: boolean;
}

const SplitFlapCharacter = memo(function SplitFlapCharacter({
  target,
  intermediate,
  rowIndex,
  slotIndex,
  cycle,
  active,
}: SplitFlapCharacterProps) {
  const steps = useMemo(
    () => buildFlipSteps(target, intermediate, cycle),
    [cycle, intermediate, target],
  );
  const [progress, setProgress] = useState({ cycle, stepIndex: 0 });
  const stepIndex = progress.cycle === cycle ? progress.stepIndex : 0;
  const step = steps[stepIndex];
  const isSpace = target === " ";
  const staggerDelay =
    stepIndex === 0
      ? rowIndex * ROW_STAGGER_SECONDS +
        slotIndex * CHARACTER_STAGGER_SECONDS
      : 0;

  const handleAnimationComplete = useCallback(() => {
    if (!active || stepIndex >= steps.length - 1) return;

    setProgress({ cycle, stepIndex: stepIndex + 1 });
  }, [active, cycle, stepIndex, steps.length]);

  if (!step) return null;

  return (
    <div className={slotClass}>
      {isSpace ? (
        <span className={foldLineClass} />
      ) : (
        <>
          <span className={cn(halfClass, "top-0")}>
            <span className={cn(glyphClass, "top-0")}>{step.next}</span>
          </span>

          <span className={cn(halfClass, "bottom-0")}>
            <span className={cn(glyphClass, "bottom-0")}>{step.current}</span>
          </span>

          <motion.span
            key={`${cycle}-${stepIndex}`}
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/2 origin-bottom [transform-style:preserve-3d]"
            initial={{ rotateX: 0 }}
            animate={{ rotateX: active ? -180 : 0 }}
            transition={{ ...FLAP_SPRING, delay: staggerDelay }}
            onAnimationComplete={handleAnimationComplete}
          >
            <span className={faceClass}>
              <span className={cn(glyphClass, "top-0")}>{step.current}</span>
            </span>

            <span className={cn(faceClass, "[transform:rotateX(180deg)]")}>
              <span className={cn(glyphClass, "bottom-0")}>{step.next}</span>
            </span>
          </motion.span>

          <span className={foldLineClass} />
        </>
      )}
    </div>
  );
});

interface SplitFlapRowProps {
  row: string;
  rowIndex: number;
  cycle: number;
  active: boolean;
}

function SplitFlapRow({
  row,
  rowIndex,
  cycle,
  active,
}: SplitFlapRowProps) {
  return (
    <div className="flex w-max gap-0.5">
      {Array.from(row).map((character, slotIndex) => (
        <SplitFlapCharacter
          key={`${rowIndex}-${slotIndex}`}
          target={character}
          intermediate={getIntermediateCharacter(
            character,
            rowIndex,
            slotIndex,
            cycle,
          )}
          rowIndex={rowIndex}
          slotIndex={slotIndex}
          cycle={cycle}
          active={active}
        />
      ))}
    </div>
  );
}

export interface SplitFlapBoardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  rows: readonly string[];
}

export function SplitFlapBoard({
  rows,
  className,
  ...props
}: SplitFlapBoardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const played = useInView(ref, {
    amount: SESSION_ENTER_VISIBILITY,
    once: true,
  });
  const isAnimationSessionActive = useVisibilitySession(ref);
  const shouldReduceMotion = useReducedMotion();
  const lastCycleStartedAtRef = useRef<number | null>(null);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const [cycle, setCycle] = useState(0);

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
    if (
      played &&
      !shouldReduceMotion &&
      lastCycleStartedAtRef.current === null
    ) {
      lastCycleStartedAtRef.current = Date.now();
    }
  }, [played, shouldReduceMotion]);

  useEffect(() => {
    if (
      !played ||
      !isAnimationSessionActive ||
      !isDocumentVisible ||
      shouldReduceMotion
    ) {
      return;
    }

    const lastCycleStartedAt = lastCycleStartedAtRef.current;
    if (lastCycleStartedAt === null) return;

    const elapsedSinceLastCycle = Date.now() - lastCycleStartedAt;
    const remainingCooldown = Math.max(
      0,
      RESHUFFLE_MS - elapsedSinceLastCycle,
    );

    const timeoutId = window.setTimeout(() => {
      lastCycleStartedAtRef.current = Date.now();
      setCycle((currentCycle) => currentCycle + 1);
    }, remainingCooldown);

    return () => window.clearTimeout(timeoutId);
  }, [
    cycle,
    isAnimationSessionActive,
    isDocumentVisible,
    played,
    shouldReduceMotion,
  ]);

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
          {rows.map((row, rowIndex) => (
            <div key={`${row}-${rowIndex}`} className="flex w-max gap-0.5">
              {Array.from(row).map((character, slotIndex) => (
                <StaticCharacter
                  key={`${rowIndex}-${slotIndex}`}
                  character={character}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div
          aria-hidden
          className="flex flex-col gap-[0.28125rem]"
        >
          {rows.map((row, rowIndex) => (
            <SplitFlapRow
              key={`${row}-${rowIndex}`}
              row={row}
              rowIndex={rowIndex}
              cycle={cycle}
              active={played}
            />
          ))}
        </div>
      )}
    </div>
  );
}
