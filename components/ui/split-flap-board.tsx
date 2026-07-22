"use client";

import {
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const SESSION_ENTER_VISIBILITY = 0.65;
const SESSION_EXIT_VISIBILITY = 0.35;
const MIN_SETTLE_MS = 1400;
const MAX_SETTLE_MS = 3400;
const MIN_FLIP_MS = 85;
const MAX_FLIP_MS = 110;
const SETTLE_JITTER_MS = 80;
const STEP_SCHEDULING_BUDGET_MS = 20;
const FLAP_DECK = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

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

interface FlapPlan {
  startIndex: number;
  stepDurationMs: number;
  totalSteps: number;
}

function normalizeCharacter(character: string) {
  return character === " " ? "" : character;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function getRowSeed(rowIndex: number, runId: number) {
  return (
    Math.imul(rowIndex + 1, 0x9e3779b1) ^
    Math.imul(runId + 1, 0x85ebca6b)
  ) >>> 0;
}

function createRowPlans(row: string, rowIndex: number, runId: number) {
  const characters = Array.from(row);
  const random = createSeededRandom(getRowSeed(rowIndex, runId));
  const shuffledSlotIndices = characters.map((_, slotIndex) => slotIndex);

  for (let index = shuffledSlotIndices.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffledSlotIndices[index], shuffledSlotIndices[swapIndex]] = [
      shuffledSlotIndices[swapIndex],
      shuffledSlotIndices[index],
    ];
  }

  const completionRankBySlot = new Map<number, number>();
  shuffledSlotIndices.forEach((slotIndex, rank) => {
    completionRankBySlot.set(slotIndex, rank);
  });

  return characters.map((target, slotIndex) => {
    const targetIndex = FLAP_DECK.indexOf(target);

    if (targetIndex === -1) {
      return {
        startIndex: 0,
        stepDurationMs: MIN_FLIP_MS,
        totalSteps: 0,
      } satisfies FlapPlan;
    }

    const completionRank = completionRankBySlot.get(slotIndex) ?? 0;
    const completionProgress =
      characters.length <= 1
        ? 0.5
        : completionRank / (characters.length - 1);
    const baseSettleMs =
      MIN_SETTLE_MS +
      completionProgress * (MAX_SETTLE_MS - MIN_SETTLE_MS);
    const settleMs = clamp(
      baseSettleMs + (random() * 2 - 1) * SETTLE_JITTER_MS,
      MIN_SETTLE_MS,
      MAX_SETTLE_MS,
    );
    const stepDurationMs = Math.round(
      MIN_FLIP_MS + random() * (MAX_FLIP_MS - MIN_FLIP_MS),
    );
    // React commits the next pair of glyphs between consecutive WAAPI flips.
    // Budget that scheduling frame so the observed finish stays inside the
    // intended 1.4–3.4 second window, not just the summed animation durations.
    const observedStepDurationMs =
      stepDurationMs + STEP_SCHEDULING_BUDGET_MS;
    const minSteps = Math.ceil(MIN_SETTLE_MS / observedStepDurationMs);
    const maxSteps = Math.floor(MAX_SETTLE_MS / observedStepDurationMs);
    const totalSteps = clamp(
      Math.round(settleMs / observedStepDurationMs),
      minSteps,
      maxSteps,
    );
    const startIndex =
      (targetIndex - (totalSteps % FLAP_DECK.length) + FLAP_DECK.length) %
      FLAP_DECK.length;

    return {
      startIndex,
      stepDurationMs,
      totalSteps,
    } satisfies FlapPlan;
  });
}

function useVisibilitySession(ref: RefObject<Element | null>) {
  const [session, setSession] = useState({ isActive: false, sessionId: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        setSession((currentSession) => {
          if (
            entry.intersectionRatio >= SESSION_ENTER_VISIBILITY &&
            !currentSession.isActive
          ) {
            return {
              isActive: true,
              sessionId: currentSession.sessionId + 1,
            };
          }

          if (
            entry.intersectionRatio < SESSION_EXIT_VISIBILITY &&
            currentSession.isActive
          ) {
            return { ...currentSession, isActive: false };
          }

          return currentSession;
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

  return session;
}

function useDocumentVisibility() {
  const [visibility, setVisibility] = useState({
    isVisible: true,
    resumeId: 0,
  });

  useEffect(() => {
    const updateDocumentVisibility = () => {
      const isVisible = document.visibilityState === "visible";

      setVisibility((currentVisibility) => {
        if (currentVisibility.isVisible === isVisible) {
          return currentVisibility;
        }

        return {
          isVisible,
          resumeId:
            currentVisibility.resumeId + (isVisible ? 1 : 0),
        };
      });
    };

    updateDocumentVisibility();
    document.addEventListener("visibilitychange", updateDocumentVisibility);

    return () =>
      document.removeEventListener(
        "visibilitychange",
        updateDocumentVisibility,
      );
  }, []);

  return visibility;
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
  plan: FlapPlan;
}

const SplitFlapCharacter = memo(function SplitFlapCharacter({
  target,
  plan,
}: SplitFlapCharacterProps) {
  const flapRef = useRef<HTMLSpanElement>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const isComplete = stepIndex >= plan.totalSteps;
  const currentDeckIndex =
    (plan.startIndex + stepIndex) % FLAP_DECK.length;
  const nextDeckIndex = (currentDeckIndex + 1) % FLAP_DECK.length;
  const currentCharacter = normalizeCharacter(FLAP_DECK[currentDeckIndex]);
  const nextCharacter = normalizeCharacter(FLAP_DECK[nextDeckIndex]);

  useLayoutEffect(() => {
    const flap = flapRef.current;
    if (!flap || isComplete) return;

    const animation = flap.animate(
      [
        { transform: "rotateX(0deg)" },
        { transform: "rotateX(-180deg)" },
      ],
      {
        duration: plan.stepDurationMs,
        easing: "linear",
        fill: "both",
      },
    );

    animation.onfinish = () => {
      setStepIndex((currentStep) =>
        Math.min(currentStep + 1, plan.totalSteps),
      );
    };

    return () => {
      animation.onfinish = null;
      animation.cancel();
    };
  }, [isComplete, plan.stepDurationMs, plan.totalSteps, stepIndex]);

  if (isComplete || plan.totalSteps === 0) {
    return <StaticCharacter character={target} />;
  }

  return (
    <div className={slotClass}>
      <span className={cn(halfClass, "top-0")}>
        <span className={cn(glyphClass, "top-0")}>{nextCharacter}</span>
      </span>

      <span className={cn(halfClass, "bottom-0")}>
        <span className={cn(glyphClass, "bottom-0")}>
          {currentCharacter}
        </span>
      </span>

      <span
        key={stepIndex}
        ref={flapRef}
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/2 origin-bottom [transform-style:preserve-3d]"
      >
        <span className={faceClass}>
          <span className={cn(glyphClass, "top-0")}>{currentCharacter}</span>
        </span>

        <span className={cn(faceClass, "[transform:rotateX(180deg)]")}>
          <span className={cn(glyphClass, "bottom-0")}>{nextCharacter}</span>
        </span>
      </span>

      <span className={foldLineClass} />
    </div>
  );
});

interface SplitFlapRowProps {
  row: string;
  plans: readonly FlapPlan[];
}

function SplitFlapRow({ row, plans }: SplitFlapRowProps) {
  return (
    <div className="flex w-max gap-0.5">
      {Array.from(row).map((character, slotIndex) => (
        <SplitFlapCharacter
          key={slotIndex}
          target={character}
          plan={plans[slotIndex]}
        />
      ))}
    </div>
  );
}

function StaticBoard({ rows }: { rows: readonly string[] }) {
  return (
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
  const { isActive: isAnimationSessionActive, sessionId } =
    useVisibilitySession(ref);
  const { isVisible: isDocumentVisible, resumeId } =
    useDocumentVisibility();
  const shouldReduceMotion = useReducedMotion();
  const canAnimate =
    isAnimationSessionActive &&
    isDocumentVisible &&
    !shouldReduceMotion;
  const runId =
    (Math.imul(sessionId + 1, 0x9e3779b1) ^
      Math.imul(resumeId + 1, 0x85ebca6b)) >>>
    0;
  const plansByRow = useMemo(
    () =>
      rows.map((row, rowIndex) => createRowPlans(row, rowIndex, runId)),
    [rows, runId],
  );
  const rowsKey = rows.join("\u0000");

  return (
    <div
      ref={ref}
      role="img"
      aria-label={rows.join(", ")}
      className={cn("w-full overflow-hidden", className)}
      {...props}
    >
      {canAnimate ? (
        <div
          key={`${runId}-${rowsKey}`}
          aria-hidden
          className="flex flex-col gap-[0.28125rem]"
        >
          {rows.map((row, rowIndex) => (
            <SplitFlapRow
              key={`${row}-${rowIndex}`}
              row={row}
              plans={plansByRow[rowIndex]}
            />
          ))}
        </div>
      ) : (
        <StaticBoard rows={rows} />
      )}
    </div>
  );
}
