"use client";

import {
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";

import { cn } from "@/lib/utils";

const SESSION_ENTER_VISIBILITY = 0.65;
const SESSION_EXIT_VISIBILITY = 0.35;
const MIN_SETTLE_MS = 840;
const MAX_SETTLE_MS = 2040;
const MIN_FLIP_MS = 51;
const MAX_FLIP_MS = 66;
const SETTLE_JITTER_MS = 48;
const STEP_SCHEDULING_BUDGET_MS = 20;
const FLAP_DECK = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const MOTION_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];
const MOTION_EASE_IN: [number, number, number, number] = [0.76, 0, 0.24, 1];
const expandTransition: Transition = { duration: 0.5, ease: MOTION_EASE };
const collapseTransition: Transition = {
  duration: 0.38,
  ease: MOTION_EASE_IN,
};

type SplitFlapDensity = "display" | "compact";

// Display metrics preserve the Home board. Compact metrics reproduce the
// denser station-board rows used by the Challenges page.
const slotClasses: Record<SplitFlapDensity, string> = {
  display:
    "relative h-[5.375rem] w-10 shrink-0 overflow-hidden rounded-[0.5625rem] bg-[#3f3f3f] [perspective:1000px]",
  compact:
    "relative h-[2.625rem] min-w-0 overflow-hidden rounded-[0.25rem] bg-[#3f3f3f] [perspective:600px]",
};
const glyphClasses: Record<SplitFlapDensity, string> = {
  display:
    "absolute inset-x-0 flex h-[5.375rem] items-center justify-center font-nav text-[4rem] leading-none",
  compact:
    "absolute inset-x-0 flex h-[2.625rem] items-center justify-center font-nav text-[clamp(1.625rem,8.3vw,2.125rem)] leading-none",
};
const halfClass =
  "pointer-events-none absolute inset-x-0 h-1/2 overflow-hidden bg-[#3f3f3f]";
const faceClass =
  "pointer-events-none absolute inset-0 overflow-hidden bg-[#3f3f3f] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]";
const foldLineClasses: Record<SplitFlapDensity, string> = {
  display:
    "pointer-events-none absolute inset-x-0 top-1/2 z-20 h-[0.09375rem] -translate-y-1/2 bg-black/60",
  compact:
    "pointer-events-none absolute inset-x-0 top-1/2 z-20 h-px -translate-y-1/2 bg-black/70",
};

interface FlapPlan {
  startIndex: number;
  stepDurationMs: number;
  totalSteps: number;
}

type VisibilityPhase = "final" | "prepared" | "running";

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
    // intended 0.84–2.04 second window, not just the summed animation durations.
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
  const [session, setSession] = useState<{
    phase: VisibilityPhase;
    sessionId: number;
  }>({ phase: "final", sessionId: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let hasObserved = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const isFirstObservation = !hasObserved;
        hasObserved = true;

        setSession((currentSession) => {
          if (isFirstObservation) {
            if (entry.intersectionRatio >= SESSION_ENTER_VISIBILITY) {
              return {
                phase: "running",
                sessionId: currentSession.sessionId + 1,
              };
            }

            if (entry.intersectionRatio === 0) {
              return {
                phase: "prepared",
                sessionId: currentSession.sessionId + 1,
              };
            }
          }

          let nextPhase = currentSession.phase;

          if (
            entry.intersectionRatio < SESSION_EXIT_VISIBILITY &&
            nextPhase === "running"
          ) {
            nextPhase = "final";
          }

          if (
            entry.intersectionRatio === 0 &&
            nextPhase === "final"
          ) {
            return {
              phase: "prepared",
              sessionId: currentSession.sessionId + 1,
            };
          }

          if (
            entry.intersectionRatio >= SESSION_ENTER_VISIBILITY &&
            nextPhase === "prepared"
          ) {
            return { ...currentSession, phase: "running" };
          }

          if (
            entry.intersectionRatio >= SESSION_ENTER_VISIBILITY &&
            nextPhase === "final" &&
            currentSession.sessionId === 0
          ) {
            return {
              phase: "running",
              sessionId: currentSession.sessionId + 1,
            };
          }

          if (nextPhase !== currentSession.phase) {
            return { ...currentSession, phase: nextPhase };
          }

          return currentSession;
        });
      },
      {
        threshold: [
          0,
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

function useInitialVisibilitySession(ref: RefObject<Element | null>) {
  const hasStartedRef = useRef(false);
  const [session, setSession] = useState<{
    phase: VisibilityPhase;
    sessionId: number;
  }>({ phase: "final", sessionId: 0 });

  useEffect(() => {
    const finishSessionWhenHidden = () => {
      if (document.visibilityState !== "hidden") return;

      setSession((currentSession) =>
        currentSession.phase === "running"
          ? { ...currentSession, phase: "final" }
          : currentSession,
      );
    };

    document.addEventListener(
      "visibilitychange",
      finishSessionWhenHidden,
    );

    return () =>
      document.removeEventListener(
        "visibilitychange",
        finishSessionWhenHidden,
      );
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          !entry ||
          document.visibilityState !== "visible" ||
          entry.intersectionRatio < SESSION_ENTER_VISIBILITY
        ) {
          return;
        }

        setSession((currentSession) => {
          if (hasStartedRef.current || currentSession.sessionId > 0) {
            return currentSession;
          }

          hasStartedRef.current = true;

          return {
            phase: "running",
            sessionId: currentSession.sessionId + 1,
          };
        });
      },
      { threshold: [SESSION_ENTER_VISIBILITY] },
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

interface StaticCharacterProps {
  character: string;
  density?: SplitFlapDensity;
  textClassName?: string;
}

function StaticCharacter({
  character,
  density = "display",
  textClassName = "text-white",
}: StaticCharacterProps) {
  const resolvedCharacter = normalizeCharacter(character);

  return (
    <div className={slotClasses[density]}>
      <span
        className={cn(glyphClasses[density], "top-0", textClassName)}
      >
        {resolvedCharacter}
      </span>
      <span className={foldLineClasses[density]} />
    </div>
  );
}

interface SplitFlapCharacterProps {
  target: string;
  plan: FlapPlan;
  isRunning: boolean;
  density?: SplitFlapDensity;
  textClassName?: string;
}

const SplitFlapCharacter = memo(function SplitFlapCharacter({
  target,
  plan,
  isRunning,
  density = "display",
  textClassName = "text-white",
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
    if (!isRunning || !flap || isComplete) return;

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
  }, [
    isComplete,
    isRunning,
    plan.stepDurationMs,
    plan.totalSteps,
    stepIndex,
  ]);

  if (isComplete || plan.totalSteps === 0) {
    return (
      <StaticCharacter
        character={target}
        density={density}
        textClassName={textClassName}
      />
    );
  }

  return (
    <div className={slotClasses[density]}>
      <span className={cn(halfClass, "top-0")}>
        <span
          className={cn(
            glyphClasses[density],
            "top-0",
            textClassName,
          )}
        >
          {nextCharacter}
        </span>
      </span>

      <span className={cn(halfClass, "bottom-0")}>
        <span
          className={cn(
            glyphClasses[density],
            "bottom-0",
            textClassName,
          )}
        >
          {currentCharacter}
        </span>
      </span>

      <span
        key={stepIndex}
        ref={flapRef}
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/2 origin-bottom [transform-style:preserve-3d]"
      >
        <span className={faceClass}>
          <span
            className={cn(
              glyphClasses[density],
              "top-0",
              textClassName,
            )}
          >
            {currentCharacter}
          </span>
        </span>

        <span className={cn(faceClass, "[transform:rotateX(180deg)]")}>
          <span
            className={cn(
              glyphClasses[density],
              "bottom-0",
              textClassName,
            )}
          >
            {nextCharacter}
          </span>
        </span>
      </span>

      <span className={foldLineClasses[density]} />
    </div>
  );
});

interface ClockedSplitFlapCharacterProps {
  target: string;
  plan: FlapPlan;
  isRunning: boolean;
  elapsedMs: number;
  density?: SplitFlapDensity;
  textClassName?: string;
}

// The compact engine turns the scheduling gap from the original per-step
// React loop into an explicit visual hold, preserving the approved cadence
// without making completion time depend on the device.
function getClockedCycleDuration(plan: FlapPlan) {
  return plan.stepDurationMs + STEP_SCHEDULING_BUDGET_MS;
}

function getClockedStepIndex(plan: FlapPlan, elapsedMs: number) {
  const cycleDurationMs = getClockedCycleDuration(plan);

  return Math.min(
    Math.floor(elapsedMs / cycleDurationMs),
    plan.totalSteps,
  );
}

function getClockedPlanDuration(plan: FlapPlan) {
  return getClockedCycleDuration(plan) * plan.totalSteps;
}

const ClockedSplitFlapCharacter = memo(
  function ClockedSplitFlapCharacter({
    target,
    plan,
    isRunning,
    elapsedMs,
    density = "compact",
    textClassName = "text-white",
  }: ClockedSplitFlapCharacterProps) {
    const flapRef = useRef<HTMLSpanElement>(null);
    const cycleDurationMs = getClockedCycleDuration(plan);
    const stepIndex = getClockedStepIndex(plan, elapsedMs);
    const isComplete = stepIndex >= plan.totalSteps;
    const currentDeckIndex =
      (plan.startIndex + stepIndex) % FLAP_DECK.length;
    const nextDeckIndex = (currentDeckIndex + 1) % FLAP_DECK.length;
    const currentCharacter = normalizeCharacter(
      FLAP_DECK[currentDeckIndex],
    );
    const nextCharacter = normalizeCharacter(FLAP_DECK[nextDeckIndex]);

    useLayoutEffect(() => {
      const flap = flapRef.current;
      if (!isRunning || !flap || plan.totalSteps === 0) return;

      const flipEndOffset = plan.stepDurationMs / cycleDurationMs;
      const animation = flap.animate(
        [
          { transform: "rotateX(0deg)", offset: 0 },
          {
            transform: "rotateX(-180deg)",
            offset: flipEndOffset,
          },
          { transform: "rotateX(-180deg)", offset: 1 },
        ],
        {
          duration: cycleDurationMs,
          iterations: plan.totalSteps,
          easing: "linear",
          fill: "both",
        },
      );

      return () => animation.cancel();
    }, [
      cycleDurationMs,
      isRunning,
      plan.stepDurationMs,
      plan.totalSteps,
    ]);

    if (isComplete || plan.totalSteps === 0) {
      return (
        <StaticCharacter
          character={target}
          density={density}
          textClassName={textClassName}
        />
      );
    }

    return (
      <div className={slotClasses[density]}>
        <span className={cn(halfClass, "top-0")}>
          <span
            className={cn(
              glyphClasses[density],
              "top-0",
              textClassName,
            )}
          >
            {nextCharacter}
          </span>
        </span>

        <span className={cn(halfClass, "bottom-0")}>
          <span
            className={cn(
              glyphClasses[density],
              "bottom-0",
              textClassName,
            )}
          >
            {currentCharacter}
          </span>
        </span>

        <span
          ref={flapRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/2 origin-bottom [transform-style:preserve-3d]"
        >
          <span className={faceClass}>
            <span
              className={cn(
                glyphClasses[density],
                "top-0",
                textClassName,
              )}
            >
              {currentCharacter}
            </span>
          </span>

          <span className={cn(faceClass, "[transform:rotateX(180deg)]")}>
            <span
              className={cn(
                glyphClasses[density],
                "bottom-0",
                textClassName,
              )}
            >
              {nextCharacter}
            </span>
          </span>
        </span>

        <span className={foldLineClasses[density]} />
      </div>
    );
  },
  (previous, next) =>
    previous.target === next.target &&
    previous.plan === next.plan &&
    previous.isRunning === next.isRunning &&
    previous.density === next.density &&
    previous.textClassName === next.textClassName &&
    getClockedStepIndex(previous.plan, previous.elapsedMs) ===
      getClockedStepIndex(next.plan, next.elapsedMs),
);

interface SplitFlapRowProps {
  row: string;
  plans: readonly FlapPlan[];
  isRunning: boolean;
  elapsedMs?: number;
  density?: SplitFlapDensity;
  textClassName?: string;
}

function SplitFlapRow({
  row,
  plans,
  isRunning,
  elapsedMs,
  density = "display",
  textClassName = "text-white",
}: SplitFlapRowProps) {
  const isCompact = density === "compact";

  return (
    <div
      className={cn(
        isCompact
          ? "grid w-full gap-[0.09375rem]"
          : "flex w-max gap-0.5",
      )}
      style={
        isCompact
          ? {
              gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
            }
          : undefined
      }
    >
      {Array.from(row).map((character, slotIndex) =>
        elapsedMs === undefined ? (
          <SplitFlapCharacter
            key={slotIndex}
            target={character}
            plan={plans[slotIndex]}
            isRunning={isRunning}
            density={density}
            textClassName={textClassName}
          />
        ) : (
          <ClockedSplitFlapCharacter
            key={slotIndex}
            target={character}
            plan={plans[slotIndex]}
            isRunning={isRunning}
            elapsedMs={elapsedMs}
            density={density}
            textClassName={textClassName}
          />
        ),
      )}
    </div>
  );
}

function useClockedTimeline(
  isRunning: boolean,
  runId: number,
  maxDurationMs: number,
) {
  const [timeline, setTimeline] = useState({
    runId: -1,
    hasStarted: false,
    elapsedMs: 0,
  });

  useEffect(() => {
    if (!isRunning) return;

    let animationFrameId = 0;
    let startedAt: number | null = null;

    const updateTimeline = (timestamp: number) => {
      if (startedAt === null) {
        startedAt = timestamp;
        setTimeline({
          runId,
          hasStarted: true,
          elapsedMs: 0,
        });
        animationFrameId = requestAnimationFrame(updateTimeline);
        return;
      }

      const elapsedMs = Math.min(
        timestamp - startedAt,
        maxDurationMs,
      );
      setTimeline({
        runId,
        hasStarted: true,
        elapsedMs,
      });

      if (elapsedMs < maxDurationMs) {
        animationFrameId = requestAnimationFrame(updateTimeline);
      }
    };

    animationFrameId = requestAnimationFrame(updateTimeline);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, maxDurationMs, runId]);

  if (!isRunning || timeline.runId !== runId) {
    return { hasStarted: false, elapsedMs: 0 };
  }

  return timeline;
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
              density="display"
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
  const { phase, sessionId } = useVisibilitySession(ref);
  const { isVisible: isDocumentVisible, resumeId } =
    useDocumentVisibility();
  const shouldReduceMotion = useReducedMotion();
  const shouldRenderScramble =
    phase !== "final" &&
    isDocumentVisible &&
    !shouldReduceMotion;
  const isScrambleRunning =
    phase === "running" &&
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
      {shouldRenderScramble ? (
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
              isRunning={isScrambleRunning}
            />
          ))}
        </div>
      ) : (
        <StaticBoard rows={rows} />
      )}
    </div>
  );
}

export interface SplitFlapAccordionItem {
  id: string;
  label: string;
  accessibleLabel: string;
  panel: ReactNode;
}

export interface SplitFlapAccordionBoardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onToggle"> {
  items: readonly SplitFlapAccordionItem[];
  openItemId: string | null;
  onToggle: (itemId: string) => void;
}

export function SplitFlapAccordionBoard({
  items,
  openItemId,
  onToggle,
  className,
  ...props
}: SplitFlapAccordionBoardProps) {
  const visibilityRef = useRef<HTMLDivElement>(null);
  const { isVisible: isDocumentVisible } = useDocumentVisibility();
  const { phase, sessionId } =
    useInitialVisibilitySession(visibilityRef);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const shouldRenderScramble =
    phase !== "final" && isDocumentVisible && !shouldReduceMotion;
  const isScrambleRunning =
    phase === "running" && isDocumentVisible && !shouldReduceMotion;
  const runId = Math.imul(sessionId + 1, 0x9e3779b1) >>> 0;
  const rowsKey = items.map((item) => item.label).join("\u0000");
  const rows = useMemo(() => rowsKey.split("\u0000"), [rowsKey]);
  const plansByRow = useMemo(
    () =>
      rows.map((row, rowIndex) => createRowPlans(row, rowIndex, runId)),
    [rows, runId],
  );
  const maxDurationMs = useMemo(
    () =>
      Math.max(
        0,
        ...plansByRow.flatMap((plans) =>
          plans.map(getClockedPlanDuration),
        ),
      ),
    [plansByRow],
  );
  const timeline = useClockedTimeline(
    isScrambleRunning,
    runId,
    maxDurationMs,
  );
  const closedBoardHeight = `calc(${items.length} * 2.75rem + ${Math.max(
    items.length - 1,
    0,
  )} * 0.28125rem)`;

  return (
    <div
      className={cn("relative w-full", className)}
      {...props}
    >
      <div
        ref={visibilityRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{ height: closedBoardHeight }}
      />

      <div className="relative flex flex-col gap-[0.28125rem]">
        {items.map((item, rowIndex) => {
          const isOpen = openItemId === item.id;
          const contentId = `split-flap-panel-${item.id}`;
          const triggerId = `split-flap-trigger-${item.id}`;
          const textClassName = isOpen
            ? "text-brand transition-colors duration-200 motion-reduce:transition-none"
            : "text-white transition-colors duration-200 motion-reduce:transition-none";

          return (
            <article key={item.id}>
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={contentId}
                aria-label={item.accessibleLabel}
                onClick={() => onToggle(item.id)}
                className="block min-h-11 w-full touch-manipulation rounded-[0.25rem] py-px text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <div
                  key={`${runId}-${item.id}`}
                  aria-hidden="true"
                >
                  {shouldRenderScramble ? (
                    <SplitFlapRow
                      row={item.label}
                      plans={plansByRow[rowIndex]}
                      isRunning={
                        isScrambleRunning && timeline.hasStarted
                      }
                      elapsedMs={timeline.elapsedMs}
                      density="compact"
                      textClassName={textClassName}
                    />
                  ) : (
                    <div
                      className="grid w-full gap-[0.09375rem]"
                      style={{
                        gridTemplateColumns: `repeat(${item.label.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {Array.from(item.label).map(
                        (character, slotIndex) => (
                          <StaticCharacter
                            key={`${item.id}-${slotIndex}`}
                            character={character}
                            density="compact"
                            textClassName={textClassName}
                          />
                        ),
                      )}
                    </div>
                  )}
                </div>
              </button>

              {shouldReduceMotion ? (
                isOpen ? (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={triggerId}
                  >
                    {item.panel}
                  </div>
                ) : null
              ) : (
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      id={contentId}
                      role="region"
                      aria-labelledby={triggerId}
                      className="overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: collapseTransition,
                      }}
                      transition={expandTransition}
                    >
                      {item.panel}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
