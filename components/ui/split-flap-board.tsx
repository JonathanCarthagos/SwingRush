"use client";

import {
  createContext,
  memo,
  useCallback,
  useContext,
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
const NAV_FALL_MS = 60;
const NAV_HOLD_MS = 15;
const NAV_SETTLE_BASE_MS = 900;
const NAV_SETTLE_PER_COLUMN_MS = 45;
const NAV_SETTLE_JITTER_MS = 40;
const NAV_MIN_FLIPS = 12;
const NAV_MAX_FLIPS = 24;
const NAV_FALL_CURVE: [number, number, number, number] = [0.5, 0, 0.75, 0.6];
const NAV_FALL_EASING = `cubic-bezier(${NAV_FALL_CURVE.join(", ")})`;
const NAV_BOUNCE_MS = 90;
const NAV_BOUNCE_EASING = "cubic-bezier(0.23, 1, 0.32, 1)";
const NAV_SHADE_PEAK = 0.35;
const PREPARE_ROOT_MARGIN = "0px 0px 100% 0px";
// Same seed the clocked boards used for their first started session.
const CLOCKED_RUN_ID = Math.imul(2, 0x9e3779b1) >>> 0;
const FLAP_DECK = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789>v";

const MOTION_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];
const MOTION_EASE_IN: [number, number, number, number] = [0.76, 0, 0.24, 1];
const expandTransition: Transition = { duration: 0.5, ease: MOTION_EASE };
const collapseTransition: Transition = {
  duration: 0.38,
  ease: MOTION_EASE_IN,
};

type SplitFlapDensity = "display" | "compact" | "navigation";

// Display metrics preserve the Home board. Compact metrics reproduce the
// denser station-board rows used by the Challenges page.
const slotClasses: Record<SplitFlapDensity, string> = {
  display:
    "relative h-[var(--split-flap-display-slot-height,5.375rem)] w-[var(--split-flap-display-slot-width,2.5rem)] shrink-0 overflow-hidden rounded-[0.5625rem] bg-[#3f3f3f] [perspective:1000px]",
  compact:
    "relative h-[2.625rem] min-w-0 overflow-hidden rounded-[0.25rem] bg-[#3f3f3f] [perspective:600px]",
  navigation:
    "relative h-[var(--split-flap-navigation-row-height,4.684rem)] min-w-0 overflow-hidden rounded-[0.25rem] bg-[#3f3f3f] [perspective:800px]",
};
const glyphClasses: Record<SplitFlapDensity, string> = {
  display:
    "absolute inset-x-0 flex h-[var(--split-flap-display-slot-height,5.375rem)] items-center justify-center font-nav text-[length:var(--split-flap-display-glyph-size,4rem)] leading-none",
  compact:
    "absolute inset-x-0 flex h-[2.625rem] items-center justify-center font-nav text-[clamp(1.625rem,8.3vw,2.125rem)] leading-none",
  navigation:
    "absolute inset-x-0 flex h-[var(--split-flap-navigation-row-height,4.684rem)] items-center justify-center font-nav text-[length:var(--split-flap-navigation-glyph-size,3.5rem)] leading-none",
};
const halfClass =
  "pointer-events-none absolute inset-x-0 h-1/2 overflow-hidden bg-[#3f3f3f]";
const faceClass =
  "pointer-events-none absolute inset-0 overflow-hidden bg-[#3f3f3f] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]";
const flapShadeClass =
  "pointer-events-none absolute inset-0 bg-black opacity-0";
const foldLineClasses: Record<SplitFlapDensity, string> = {
  display:
    "pointer-events-none absolute inset-x-0 top-1/2 z-20 h-[0.09375rem] -translate-y-1/2 bg-black/60",
  compact:
    "pointer-events-none absolute inset-x-0 top-1/2 z-20 h-px -translate-y-1/2 bg-black/70",
  navigation:
    "pointer-events-none absolute inset-x-0 top-1/2 z-20 h-px -translate-y-1/2 bg-black/70",
};

interface FlapPlan {
  startIndex: number;
  stepDurationMs: number;
  totalSteps: number;
  holdMs?: number;
  delayMs?: number;
  easing?: string;
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

function createNavigationRowPlans(row: string, rowIndex: number) {
  const random = createSeededRandom(getRowSeed(rowIndex, CLOCKED_RUN_ID));
  const cycleMs = NAV_FALL_MS + NAV_HOLD_MS;

  return Array.from(row).map((target, slotIndex) => {
    const targetIndex = FLAP_DECK.indexOf(target);
    const jitter = (random() * 2 - 1) * NAV_SETTLE_JITTER_MS;

    if (targetIndex === -1) {
      return {
        startIndex: 0,
        stepDurationMs: NAV_FALL_MS,
        totalSteps: 0,
        holdMs: NAV_HOLD_MS,
        easing: NAV_FALL_EASING,
      } satisfies FlapPlan;
    }

    const settleMs =
      NAV_SETTLE_BASE_MS + slotIndex * NAV_SETTLE_PER_COLUMN_MS + jitter;
    const totalSteps = clamp(
      Math.round(settleMs / cycleMs),
      NAV_MIN_FLIPS,
      NAV_MAX_FLIPS,
    );
    const startIndex =
      (targetIndex - (totalSteps % FLAP_DECK.length) + FLAP_DECK.length) %
      FLAP_DECK.length;

    return {
      startIndex,
      stepDurationMs: NAV_FALL_MS,
      totalSteps,
      holdMs: NAV_HOLD_MS,
      easing: NAV_FALL_EASING,
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

function usePreparedVisibilitySession(ref: RefObject<Element | null>) {
  const [phase, setPhase] = useState<VisibilityPhase>("final");
  const preparedRef = useRef(false);
  const runningRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let prepareFrame = 0;
    let enterFrame = 0;

    const commitPrepared = () => {
      setPhase((currentPhase) =>
        currentPhase === "running" ? currentPhase : "prepared",
      );
    };

    const prepare = () => {
      if (preparedRef.current || runningRef.current) return;
      preparedRef.current = true;
      prepareFrame = requestAnimationFrame(commitPrepared);
    };

    const run = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      cancelAnimationFrame(prepareFrame);
      preparedRef.current = true;
      commitPrepared();
      enterFrame = requestAnimationFrame(() => {
        setPhase("running");
      });
    };

    const prepareObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        prepare();
      },
      { rootMargin: PREPARE_ROOT_MARGIN, threshold: 0 },
    );

    const enterObserver = new IntersectionObserver(
      ([entry]) => {
        if (
          !entry ||
          entry.intersectionRatio < SESSION_ENTER_VISIBILITY
        ) {
          return;
        }

        run();
      },
      { threshold: [SESSION_ENTER_VISIBILITY] },
    );

    prepareObserver.observe(element);
    enterObserver.observe(element);

    return () => {
      cancelAnimationFrame(prepareFrame);
      cancelAnimationFrame(enterFrame);
      prepareObserver.disconnect();
      enterObserver.disconnect();
    };
  }, [ref]);

  return phase;
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
  density?: SplitFlapDensity;
  textClassName?: string;
}

interface FlapGlyphNodes {
  topNext: HTMLSpanElement;
  bottomCurrent: HTMLSpanElement;
  flapCurrent: HTMLSpanElement;
  flapNext: HTMLSpanElement;
  flap: HTMLSpanElement;
  frontShade: HTMLSpanElement;
  backShade: HTMLSpanElement;
}

interface FlapDriver {
  plan: FlapPlan;
  nodes: FlapGlyphNodes;
  step: number;
  prepared: boolean;
  animation: Animation | null;
  shades: Animation[];
  bounce: Animation | null;
}

function cancelDriverAnimations(driver: FlapDriver) {
  driver.animation?.cancel();
  driver.animation = null;
  for (const shade of driver.shades) shade.cancel();
  driver.shades = [];
  driver.bounce?.cancel();
  driver.bounce = null;
}

function getHoldMs(plan: FlapPlan) {
  return plan.holdMs ?? STEP_SCHEDULING_BUDGET_MS;
}

// The hold after each flip keeps the approved cadence. The clock writes the
// next pair only when the step index changes, and never on the finished hold:
// that face is already the target letter.
function getClockedCycleDuration(plan: FlapPlan) {
  return plan.stepDurationMs + getHoldMs(plan);
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

function glyphsForStep(plan: FlapPlan, step: number) {
  const currentDeckIndex =
    (plan.startIndex + step) % FLAP_DECK.length;
  const nextDeckIndex = (currentDeckIndex + 1) % FLAP_DECK.length;

  return {
    current: normalizeCharacter(FLAP_DECK[currentDeckIndex] ?? " "),
    next: normalizeCharacter(FLAP_DECK[nextDeckIndex] ?? " "),
  };
}

function writeStep(driver: FlapDriver, step: number) {
  const glyphs = glyphsForStep(driver.plan, step);
  driver.nodes.bottomCurrent.textContent = glyphs.current;
  driver.nodes.flapCurrent.textContent = glyphs.current;
  driver.nodes.topNext.textContent = glyphs.next;
  driver.nodes.flapNext.textContent = glyphs.next;
  driver.step = step;
  driver.prepared = false;
}

function readTimingMs(value: number | CSSNumericValue | null | undefined) {
  if (typeof value === "number") return value;
  if (typeof CSSUnitValue !== "undefined" && value instanceof CSSUnitValue) {
    return value.value;
  }
  return null;
}

function getActiveElapsedMs(animation: Animation) {
  const timing = animation.effect?.getComputedTiming();
  if (!timing) return null;
  const localTime = readTimingMs(timing.localTime);
  if (localTime === null) return null;
  return localTime - (readTimingMs(timing.delay) ?? 0);
}

// Navigation flips swap the hidden faces while the flap rests at -180deg,
// then reveal the next pair once that same animation clock is back at 0deg.
function syncNavigationGlyphs(driver: FlapDriver, elapsedInActive: number) {
  const plan = driver.plan;
  const cycle = getClockedCycleDuration(plan);
  if (cycle <= 0 || plan.totalSteps === 0 || elapsedInActive < 0) return;

  const activeDuration = cycle * plan.totalSteps;
  if (elapsedInActive >= activeDuration) return;

  const cycleIndex = Math.floor(elapsedInActive / cycle);
  const cycleElapsed = elapsedInActive - cycleIndex * cycle;

  if (driver.step < cycleIndex) {
    writeStep(driver, cycleIndex);
  }

  const inHold = cycleElapsed >= plan.stepDurationMs;
  if (
    inHold &&
    cycleIndex < plan.totalSteps - 1 &&
    driver.step === cycleIndex &&
    !driver.prepared
  ) {
    const glyphs = glyphsForStep(plan, cycleIndex + 1);
    driver.nodes.bottomCurrent.textContent = glyphs.current;
    driver.nodes.flapCurrent.textContent = glyphs.current;
    driver.prepared = true;
  }
}

type Point = [number, number];

function lerpPoint(a: Point, b: Point, t: number): Point {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

// Splits a CSS cubic-bezier where its output reaches `targetProgress`, and
// returns both halves renormalized as CSS easings plus the time fraction of
// the split, so two keyframe segments reproduce the original curve.
function splitEasingAtProgress(
  [x1, y1, x2, y2]: [number, number, number, number],
  targetProgress: number,
) {
  const p0: Point = [0, 0];
  const p1: Point = [x1, y1];
  const p2: Point = [x2, y2];
  const p3: Point = [1, 1];
  const yAt = (t: number) =>
    3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3;

  let low = 0;
  let high = 1;
  for (let index = 0; index < 40; index += 1) {
    const mid = (low + high) / 2;
    if (yAt(mid) < targetProgress) low = mid;
    else high = mid;
  }
  const t = (low + high) / 2;

  const p01 = lerpPoint(p0, p1, t);
  const p12 = lerpPoint(p1, p2, t);
  const p23 = lerpPoint(p2, p3, t);
  const p012 = lerpPoint(p01, p12, t);
  const p123 = lerpPoint(p12, p23, t);
  const split = lerpPoint(p012, p123, t);

  const toEasing = (a: Point, b: Point) =>
    `cubic-bezier(${a.map((value) => value.toFixed(4)).join(", ")}, ${b
      .map((value) => value.toFixed(4))
      .join(", ")})`;
  const normalizeFirst = ([x, y]: Point): Point => [x / split[0], y / split[1]];
  const normalizeSecond = ([x, y]: Point): Point => [
    (x - split[0]) / (1 - split[0]),
    (y - split[1]) / (1 - split[1]),
  ];

  return {
    midProgress: split[0],
    firstEasing: toEasing(normalizeFirst(p01), normalizeFirst(p012)),
    secondEasing: toEasing(normalizeSecond(p123), normalizeSecond(p23)),
  };
}

const NAV_FALL_SPLIT = splitEasingAtProgress(NAV_FALL_CURVE, 0.5);

function startFlip(driver: FlapDriver) {
  if (driver.plan.totalSteps === 0 || driver.animation) return;

  const cycleDurationMs = getClockedCycleDuration(driver.plan);
  const flipEndOffset = driver.plan.stepDurationMs / cycleDurationMs;
  const fallEasing = driver.plan.easing;
  const timing: KeyframeAnimationOptions = {
    duration: cycleDurationMs,
    iterations: driver.plan.totalSteps,
    easing: "linear",
    fill: "both",
    ...(driver.plan.delayMs ? { delay: driver.plan.delayMs } : {}),
  };

  if (!fallEasing) {
    driver.animation = driver.nodes.flap.animate(
      [
        { transform: "rotateX(0deg)", offset: 0 },
        { transform: "rotateX(-180deg)", offset: flipEndOffset },
        { transform: "rotateX(-180deg)", offset: 1 },
      ],
      timing,
    );
    return;
  }

  // The fall is split at exactly 90deg so each shade can drop to 0 the moment
  // its face turns away. Chrome does not hide an opacity-animated child with
  // its parent's backface, so the shades cannot rely on backface-visibility.
  const { firstEasing, secondEasing, midProgress } = NAV_FALL_SPLIT;
  const midOffset = flipEndOffset * midProgress;
  const afterMidOffset = midOffset + 0.0001;

  driver.animation = driver.nodes.flap.animate(
    [
      { transform: "rotateX(0deg)", easing: firstEasing },
      { transform: "rotateX(-90deg)", offset: midOffset, easing: secondEasing },
      { transform: "rotateX(-180deg)", offset: flipEndOffset },
      { transform: "rotateX(-180deg)", offset: 1 },
    ],
    timing,
  );

  // Opacity shares each segment's easing, so it stays proportional to the
  // flap angle. Chrome can resolve the exact end as iteration N at progress
  // 0, so the shades never fill forwards and fall back to opacity 0.
  const shadeTiming: KeyframeAnimationOptions = { ...timing, fill: "backwards" };
  driver.shades = [
    driver.nodes.frontShade.animate(
      [
        { opacity: 0, easing: firstEasing },
        { opacity: NAV_SHADE_PEAK, offset: midOffset },
        { opacity: 0, offset: afterMidOffset },
        { opacity: 0, offset: 1 },
      ],
      shadeTiming,
    ),
    driver.nodes.backShade.animate(
      [
        { opacity: 0, offset: 0 },
        { opacity: 0, offset: midOffset },
        { opacity: NAV_SHADE_PEAK, offset: afterMidOffset, easing: secondEasing },
        { opacity: 0, offset: flipEndOffset },
        { opacity: 0, offset: 1 },
      ],
      shadeTiming,
    ),
  ];

  // The settle bounce starts as the last flap lands and holds -180deg past
  // the main animation, covering the same end-of-interval ambiguity.
  const landedAtMs =
    (driver.plan.delayMs ?? 0) +
    cycleDurationMs * driver.plan.totalSteps -
    getHoldMs(driver.plan);
  driver.bounce = driver.nodes.flap.animate(
    [
      { transform: "rotateX(-180deg)" },
      { transform: "rotateX(-172deg)", offset: 0.35 },
      { transform: "rotateX(-180deg)" },
    ],
    {
      duration: NAV_BOUNCE_MS,
      delay: landedAtMs,
      easing: NAV_BOUNCE_EASING,
      fill: "forwards",
    },
  );
}

const FlapClockContext = createContext<
  ((driver: FlapDriver) => () => void) | null
>(null);

function useDomClock(isRunning: boolean, onComplete: () => void) {
  const driversRef = useRef(new Set<FlapDriver>());
  const onCompleteRef = useRef(onComplete);

  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const register = useCallback((driver: FlapDriver) => {
    driversRef.current.add(driver);

    return () => {
      cancelDriverAnimations(driver);
      driversRef.current.delete(driver);
    };
  }, []);

  useLayoutEffect(() => {
    if (!isRunning) return;

    let cancelled = false;
    let frame = 0;
    let startedAt: number | null = null;
    const drivers = driversRef.current;

    const tick = (now: number) => {
      if (cancelled) return;

      if (startedAt === null) {
        startedAt = now;
        for (const driver of drivers) startFlip(driver);
      }

      const elapsedMs = now - startedAt;
      let pending = false;

      for (const driver of drivers) {
        if (driver.plan.totalSteps === 0) continue;
        if (!driver.animation) startFlip(driver);

        if (driver.plan.easing) {
          const animation = driver.animation;
          const activeElapsed = animation
            ? getActiveElapsedMs(animation)
            : null;
          const activeDuration =
            getClockedCycleDuration(driver.plan) * driver.plan.totalSteps;
          const finished =
            animation?.playState === "finished" ||
            (activeElapsed !== null && activeElapsed >= activeDuration);
          if (activeElapsed !== null) syncNavigationGlyphs(driver, activeElapsed);
          if (!finished || driver.bounce?.playState === "running") {
            pending = true;
          }
          continue;
        }

        if (elapsedMs < getClockedPlanDuration(driver.plan)) pending = true;

        const step = getClockedStepIndex(driver.plan, elapsedMs);
        if (step !== driver.step && step < driver.plan.totalSteps) {
          writeStep(driver, step);
        }
      }

      if (pending) {
        frame = requestAnimationFrame(tick);
        return;
      }

      onCompleteRef.current();
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);

      for (const driver of drivers) cancelDriverAnimations(driver);
    };
  }, [isRunning]);

  return register;
}

function useClockedBoardSession(
  ref: RefObject<Element | null>,
  onSettled?: () => void,
) {
  const visibilityPhase = usePreparedVisibilitySession(ref);
  const { isVisible: isDocumentVisible } = useDocumentVisibility();
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [settled, setSettled] = useState(false);
  const visibilityPhaseRef = useRef(visibilityPhase);
  const onSettledRef = useRef(onSettled);
  const notifiedRef = useRef(false);

  useLayoutEffect(() => {
    onSettledRef.current = onSettled;
  });

  useLayoutEffect(() => {
    visibilityPhaseRef.current = visibilityPhase;
  }, [visibilityPhase]);

  useEffect(() => {
    const finishWhenHidden = () => {
      if (document.visibilityState !== "hidden") return;
      if (visibilityPhaseRef.current !== "running") return;
      setSettled(true);
    };

    document.addEventListener("visibilitychange", finishWhenHidden);
    return () =>
      document.removeEventListener("visibilitychange", finishWhenHidden);
  }, []);

  const phase: VisibilityPhase = settled ? "final" : visibilityPhase;
  const shouldRenderScramble = phase !== "final" && !shouldReduceMotion;
  const isScrambleRunning =
    phase === "running" && isDocumentVisible && !shouldReduceMotion;
  const notifySettled = useCallback(() => {
    if (notifiedRef.current) return;
    notifiedRef.current = true;
    onSettledRef.current?.();
  }, []);
  const settle = useCallback(() => {
    setSettled(true);
    notifySettled();
  }, [notifySettled]);

  useEffect(() => {
    if (!shouldReduceMotion || visibilityPhase !== "running") return;
    notifySettled();
  }, [notifySettled, shouldReduceMotion, visibilityPhase]);

  const register = useDomClock(isScrambleRunning, settle);

  return {
    shouldRenderScramble,
    isScrambleRunning,
    register,
    shouldReduceMotion,
  };
}

const ClockedSplitFlapCharacter = memo(
  function ClockedSplitFlapCharacter({
    target,
    plan,
    density = "compact",
    textClassName = "text-white",
  }: ClockedSplitFlapCharacterProps) {
    const register = useContext(FlapClockContext);
    const topNextRef = useRef<HTMLSpanElement>(null);
    const bottomCurrentRef = useRef<HTMLSpanElement>(null);
    const flapCurrentRef = useRef<HTMLSpanElement>(null);
    const flapNextRef = useRef<HTMLSpanElement>(null);
    const flapRef = useRef<HTMLSpanElement>(null);
    const frontShadeRef = useRef<HTMLSpanElement>(null);
    const backShadeRef = useRef<HTMLSpanElement>(null);
    const driverRef = useRef<FlapDriver | null>(null);
    const planRef = useRef(plan);
    const canFlip = plan.totalSteps > 0;
    const initialGlyphs = glyphsForStep(plan, 0);

    useLayoutEffect(() => {
      planRef.current = plan;
    }, [plan]);

    useLayoutEffect(() => {
      if (!canFlip) return;

      const topNext = topNextRef.current;
      const bottomCurrent = bottomCurrentRef.current;
      const flapCurrent = flapCurrentRef.current;
      const flapNext = flapNextRef.current;
      const flap = flapRef.current;
      const frontShade = frontShadeRef.current;
      const backShade = backShadeRef.current;
      if (
        !register ||
        !topNext ||
        !bottomCurrent ||
        !flapCurrent ||
        !flapNext ||
        !flap ||
        !frontShade ||
        !backShade
      ) {
        return;
      }

      const driver: FlapDriver = {
        plan: planRef.current,
        nodes: {
          topNext,
          bottomCurrent,
          flapCurrent,
          flapNext,
          flap,
          frontShade,
          backShade,
        },
        step: 0,
        prepared: false,
        animation: null,
        shades: [],
        bounce: null,
      };
      driverRef.current = driver;
      writeStep(driver, 0);

      const unregister = register(driver);
      return () => {
        unregister();
        if (driverRef.current === driver) driverRef.current = null;
      };
    }, [canFlip, register]);

    useLayoutEffect(() => {
      const driver = driverRef.current;
      if (!driver) return;
      driver.plan = planRef.current;
      if (driver.step >= driver.plan.totalSteps) return;
      const prepared = driver.prepared;
      writeStep(driver, driver.step);
      if (!prepared || driver.step >= driver.plan.totalSteps - 1) return;
      const glyphs = glyphsForStep(driver.plan, driver.step + 1);
      driver.nodes.bottomCurrent.textContent = glyphs.current;
      driver.nodes.flapCurrent.textContent = glyphs.current;
      driver.prepared = true;
    });

    if (plan.totalSteps === 0) {
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
            ref={topNextRef}
            className={cn(
              glyphClasses[density],
              "top-0",
              textClassName,
            )}
          >
            {initialGlyphs.next}
          </span>
        </span>

        <span className={cn(halfClass, "bottom-0")}>
          <span
            ref={bottomCurrentRef}
            className={cn(
              glyphClasses[density],
              "bottom-0",
              textClassName,
            )}
          >
            {initialGlyphs.current}
          </span>
        </span>

        <span
          ref={flapRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/2 origin-bottom [transform-style:preserve-3d]"
        >
          <span className={faceClass}>
            <span
              ref={flapCurrentRef}
              className={cn(
                glyphClasses[density],
                "top-0",
                textClassName,
              )}
            >
              {initialGlyphs.current}
            </span>
            <span ref={frontShadeRef} className={flapShadeClass} />
          </span>

          <span className={cn(faceClass, "[transform:rotateX(180deg)]")}>
            <span
              ref={flapNextRef}
              className={cn(
                glyphClasses[density],
                "bottom-0",
                textClassName,
              )}
            >
              {initialGlyphs.next}
            </span>
            <span ref={backShadeRef} className={flapShadeClass} />
          </span>
        </span>

        <span className={foldLineClasses[density]} />
      </div>
    );
  },
  (previous, next) =>
    previous.target === next.target &&
    previous.plan === next.plan &&
    previous.density === next.density &&
    previous.textClassName === next.textClassName,
);

interface SplitFlapRowProps {
  row: string;
  plans: readonly FlapPlan[];
  isRunning: boolean;
  clocked?: boolean;
  density?: SplitFlapDensity;
  textClassName?: string;
}

function SplitFlapRow({
  row,
  plans,
  isRunning,
  clocked = false,
  density = "display",
  textClassName = "text-white",
}: SplitFlapRowProps) {
  const isGridDensity = density !== "display";

  return (
    <div
      className={cn(
        isGridDensity
          ? "grid w-full gap-[0.09375rem]"
          : "flex w-max gap-0.5",
      )}
      style={
        isGridDensity
          ? {
              gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
            }
          : undefined
      }
    >
      {Array.from(row).map((character, slotIndex) =>
        clocked ? (
          <ClockedSplitFlapCharacter
            key={slotIndex}
            target={character}
            plan={plans[slotIndex]}
            density={density}
            textClassName={textClassName}
          />
        ) : (
          <SplitFlapCharacter
            key={slotIndex}
            target={character}
            plan={plans[slotIndex]}
            isRunning={isRunning}
            density={density}
            textClassName={textClassName}
          />
        ),
      )}
    </div>
  );
}

function ClockedOrStaticRow({
  label,
  plans,
  density,
  textClassName,
  shouldRenderScramble,
  isScrambleRunning,
  rowKey,
  concealStatic = false,
}: {
  label: string;
  plans: readonly FlapPlan[];
  density: SplitFlapDensity;
  textClassName?: string;
  shouldRenderScramble: boolean;
  isScrambleRunning: boolean;
  rowKey: string;
  concealStatic?: boolean;
}) {
  return (
    <div className="grid w-full">
      <div
        className={cn(
          "col-start-1 row-start-1",
          isScrambleRunning && (concealStatic ? "hidden" : "invisible"),
        )}
      >
        <div
          className="grid w-full gap-[0.09375rem]"
          style={{
            gridTemplateColumns: `repeat(${label.length}, minmax(0, 1fr))`,
          }}
        >
          {Array.from(label).map((character, slotIndex) => (
            <StaticCharacter
              key={`${rowKey}-${slotIndex}`}
              character={character}
              density={density}
              textClassName={textClassName}
            />
          ))}
        </div>
      </div>
      {shouldRenderScramble ? (
        <div
          className={cn(
            "col-start-1 row-start-1",
            !isScrambleRunning && "invisible",
          )}
        >
          <SplitFlapRow
            row={label}
            plans={plans}
            isRunning={false}
            clocked
            density={density}
            textClassName={textClassName}
          />
        </div>
      ) : null}
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
  onSettled?: () => void;
}

export function SplitFlapAccordionBoard({
  items,
  openItemId,
  onToggle,
  onSettled,
  className,
  ...props
}: SplitFlapAccordionBoardProps) {
  const visibilityRef = useRef<HTMLDivElement>(null);
  const {
    shouldRenderScramble,
    isScrambleRunning,
    register,
    shouldReduceMotion,
  } = useClockedBoardSession(visibilityRef, onSettled);
  const rowsKey = items.map((item) => item.label).join("\u0000");
  const rows = useMemo(() => rowsKey.split("\u0000"), [rowsKey]);
  const plansByRow = useMemo(
    () =>
      rows.map((row, rowIndex) =>
        createRowPlans(row, rowIndex, CLOCKED_RUN_ID),
      ),
    [rows],
  );
  const closedBoardHeight = `calc(${items.length} * 2.75rem + ${Math.max(
    items.length - 1,
    0,
  )} * 0.28125rem)`;

  return (
    <FlapClockContext.Provider value={register}>
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
                className="block min-h-11 w-full cursor-pointer touch-manipulation rounded-[0.25rem] py-px text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <div aria-hidden="true">
                  <ClockedOrStaticRow
                    label={item.label}
                    plans={plansByRow[rowIndex]}
                    density="compact"
                    textClassName={textClassName}
                    shouldRenderScramble={shouldRenderScramble}
                    isScrambleRunning={isScrambleRunning}
                    rowKey={item.id}
                  />
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
    </FlapClockContext.Provider>
  );
}

export interface SplitFlapNavigationItem {
  id: string;
  label: string;
  accessibleLabel: string;
  tabId: string;
  controlsId: string;
}

export type SplitFlapSelectionSource = "pointer" | "keyboard";

export interface SplitFlapNavigationBoardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  items: readonly SplitFlapNavigationItem[];
  activeItemId: string | null;
  animateSelection?: boolean;
  onSelect: (
    itemId: string,
    source: SplitFlapSelectionSource,
  ) => void;
  onSettled?: () => void;
}

export function SplitFlapNavigationBoard({
  items,
  activeItemId,
  animateSelection = false,
  onSelect,
  onSettled,
  className,
  ...props
}: SplitFlapNavigationBoardProps) {
  const visibilityRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const { shouldRenderScramble, isScrambleRunning, register } =
    useClockedBoardSession(visibilityRef, onSettled);
  const rowsKey = items.map((item) => item.label).join("\u0000");
  const rows = useMemo(() => rowsKey.split("\u0000"), [rowsKey]);
  const plansByRow = useMemo(
    () =>
      rows.map((row, rowIndex) => createNavigationRowPlans(row, rowIndex)),
    [rows],
  );

  const selectFromKeyboard = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    itemIndex: number,
  ) => {
    let targetIndex: number | null = null;

    if (event.key === "ArrowDown") {
      targetIndex = (itemIndex + 1) % items.length;
    } else if (event.key === "ArrowUp") {
      targetIndex = (itemIndex - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      targetIndex = 0;
    } else if (event.key === "End") {
      targetIndex = items.length - 1;
    }

    if (targetIndex === null) return;

    event.preventDefault();
    const targetItem = items[targetIndex];
    tabRefs.current.get(targetItem.id)?.focus();
    onSelect(targetItem.id, "keyboard");
  };

  return (
    <FlapClockContext.Provider value={register}>
    <nav
      role="tablist"
      aria-label="Challenges"
      aria-orientation="vertical"
      className={cn("relative w-full", className)}
      {...props}
    >
      <div
        ref={visibilityRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[var(--split-flap-navigation-row-height,4.684rem)]"
      />

      <div className="relative flex flex-col">
        {items.map((item, rowIndex) => {
          const isActive = activeItemId === item.id;
          const textClassName = isActive
            ? cn(
                "text-brand",
                animateSelection
                  ? "transition-colors duration-[160ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]"
                  : "transition-none",
              )
            : cn(
                "text-white",
                animateSelection
                  ? "transition-colors duration-[160ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]"
                  : "transition-none",
              );

          return (
            <button
              key={item.id}
              ref={(element) => {
                if (element) tabRefs.current.set(item.id, element);
                else tabRefs.current.delete(item.id);
              }}
              type="button"
              id={item.tabId}
              role="tab"
              aria-selected={isActive}
              aria-controls={item.controlsId}
              aria-label={item.accessibleLabel}
              tabIndex={isActive ? 0 : -1}
              onClick={(event) =>
                onSelect(
                  item.id,
                  event.detail === 0 ? "keyboard" : "pointer",
                )
              }
              onKeyDown={(event) =>
                selectFromKeyboard(event, rowIndex)
              }
              className="block w-full cursor-pointer touch-manipulation rounded-[0.25rem] text-left focus-visible:relative focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <div aria-hidden="true">
                <ClockedOrStaticRow
                  label={item.label}
                  plans={plansByRow[rowIndex]}
                  density="navigation"
                  textClassName={textClassName}
                  shouldRenderScramble={shouldRenderScramble}
                  isScrambleRunning={isScrambleRunning}
                  rowKey={item.id}
                  concealStatic
                />
              </div>
            </button>
          );
        })}
      </div>
    </nav>
    </FlapClockContext.Provider>
  );
}
