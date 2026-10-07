"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import {
  SplitFlapAccordionBoard,
  SplitFlapNavigationBoard,
  type SplitFlapAccordionItem,
  type SplitFlapNavigationItem,
  type SplitFlapSelectionSource,
} from "@/components/ui/split-flap-board";
import { CHALLENGES_PAGE_CONTENT } from "@/data/challenges";
import { cn } from "@/lib/utils";
import type { ChallengeItem } from "@/types/challenges";

const DESKTOP_CHALLENGES_QUERY = "(min-width: 1280px)";

function bezierComponent(t: number, p1: number, p2: number) {
  const c = 3 * p1;
  const b = 3 * (p2 - p1) - c;
  const a = 1 - c - b;
  return ((a * t + b) * t + c) * t;
}

function bezierSlope(t: number, p1: number, p2: number) {
  const c = 3 * p1;
  const b = 3 * (p2 - p1) - c;
  const a = 1 - c - b;
  return (3 * a * t + 2 * b) * t + c;
}

/** cubic-bezier(0.23, 1, 0.32, 1) */
function easeOutStrong(progress: number) {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;

  const x1 = 0.23;
  const y1 = 1;
  const x2 = 0.32;
  const y2 = 1;
  let t = progress;
  for (let i = 0; i < 8; i += 1) {
    const slope = bezierSlope(t, x1, x2);
    if (Math.abs(slope) < 1e-6) break;
    t = Math.min(
      1,
      Math.max(0, t - (bezierComponent(t, x1, x2) - progress) / slope),
    );
  }
  return bezierComponent(t, y1, y2);
}

function animateScrollTo(
  tokenRef: { current: number },
  destination: () => number,
  reduce: boolean,
  onDone?: () => void,
) {
  const token = tokenRef.current + 1;
  tokenRef.current = token;
  const finish = () => {
    if (tokenRef.current !== token) return;
    onDone?.();
  };

  if (reduce) {
    window.scrollTo(0, destination());
    window.setTimeout(finish, 50);
    return;
  }

  const start = window.scrollY;
  const initialDistance = destination() - start;
  if (Math.abs(initialDistance) < 1) {
    finish();
    return;
  }

  const duration = Math.min(
    900,
    Math.max(450, Math.abs(initialDistance) * 0.35),
  );
  const startTime = performance.now() - 16;
  const step = (now: number) => {
    if (tokenRef.current !== token) return;
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = easeOutStrong(progress);
    const nextDestination = destination();
    window.scrollTo(0, start + (nextDestination - start) * eased);
    if (progress < 1) {
      window.requestAnimationFrame(step);
      return;
    }
    window.scrollTo(0, destination());
    finish();
  };
  step(performance.now());
}

export interface ChallengesPageSectionProps
  extends React.HTMLAttributes<HTMLElement> {
  emptyState?: string;
  items?: readonly ChallengeItem[];
}

function challengeIndexFromHash(hash: string, itemCount: number) {
  const match = /^#(\d{1,2})$/.exec(hash);
  if (!match) return null;

  const index = Number(match[1]) - 1;
  if (index < 0 || index >= itemCount) return null;
  return index;
}

export function ChallengesPageSection({
  emptyState = CHALLENGES_PAGE_CONTENT.emptyState,
  items = CHALLENGES_PAGE_CONTENT.items,
  className,
  ...props
}: ChallengesPageSectionProps) {
  const boardSettledRef = useRef(false);
  const arrivalTokenRef = useRef(0);
  const arriveRef = useRef<(itemId: string) => void>(() => {});
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [requestedItemId, setRequestedItemId] = useState<string | null>(null);
  const [requestRevealed, setRequestRevealed] = useState(false);
  const revealRequestedChallenge = useCallback(() => {
    boardSettledRef.current = true;
    setRequestRevealed(true);
  }, []);

  useLayoutEffect(() => {
    const applyHash = () => {
      const index = challengeIndexFromHash(window.location.hash, items.length);
      const nextId = index === null ? null : items[index].id;
      setRequestedItemId(nextId);
      setRequestRevealed(boardSettledRef.current);
      if (!nextId) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduce) {
        const desktop = window.matchMedia(DESKTOP_CHALLENGES_QUERY).matches;
        const target = desktop
          ? document.getElementById(`desktop-challenge-panel-${nextId}`)
          : document.getElementById(`split-flap-trigger-${nextId}`);
        if (!target || target.getClientRects().length === 0) return;

        const header = document.querySelector("header");
        const margin = desktop
          ? Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0
          : (header?.getBoundingClientRect().height ?? 0) + 12;
        window.scrollTo(
          0,
          Math.max(
            0,
            target.getBoundingClientRect().top + window.scrollY - margin,
          ),
        );
        return;
      }

      window.scrollTo(0, 0);
      arriveRef.current(nextId);
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [items]);

  useEffect(() => {
    if (!requestRevealed || !requestedItemId) return;
    if (window.matchMedia(DESKTOP_CHALLENGES_QUERY).matches) return;

    setOpenItemId(requestedItemId);
  }, [requestRevealed, requestedItemId]);
  const boardItems = useMemo<SplitFlapAccordionItem[]>(() => {
    const baseLabels = items.map(
      (item) =>
        `${item.number.padStart(2, "0")} ${item.title.toUpperCase()}`,
    );
    const contentColumnCount = Math.max(
      ...baseLabels.map((label) => label.length),
      17,
    );

    return items.map((item, index) => ({
      id: item.id,
      label: `${baseLabels[index].padEnd(contentColumnCount, " ")}${
        openItemId === item.id ? "v" : ">"
      }`,
      accessibleLabel: `${
        openItemId === item.id ? "Close" : "Open"
      } challenge ${item.number}: ${item.title}`,
      panel: <ChallengeDetails item={item} />,
    }));
  }, [items, openItemId]);

  return (
    <section
      className={cn(
        "bg-black px-4 py-16 text-white min-[1280px]:px-0 min-[1280px]:py-0",
        className,
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-[25.125rem] min-[1280px]:hidden">
        {boardItems.length > 0 ? (
          <SplitFlapAccordionBoard
            items={boardItems}
            openItemId={openItemId}
            onToggle={(itemId) =>
              setOpenItemId((current) =>
                current === itemId ? null : itemId,
              )
            }
            onSettled={revealRequestedChallenge}
          />
        ) : (
          <p className="font-body text-[1.0625rem] leading-[1.3] tracking-body">
            {emptyState}
          </p>
        )}
      </div>

      <DesktopChallenges
        emptyState={emptyState}
        items={items}
        requestedItemId={requestedItemId}
        arrivalTokenRef={arrivalTokenRef}
        arriveRef={arriveRef}
        onSettled={revealRequestedChallenge}
      />
    </section>
  );
}

interface DesktopChallengesProps {
  emptyState: string;
  items: readonly ChallengeItem[];
  requestedItemId: string | null;
  arrivalTokenRef: { current: number };
  arriveRef: { current: (itemId: string) => void };
  onSettled: () => void;
}

function DesktopChallenges({
  emptyState,
  items,
  requestedItemId,
  arrivalTokenRef,
  arriveRef,
  onSettled,
}: DesktopChallengesProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const cardRefs = useRef(new Map<string, HTMLElement>());
  const boardRef = useRef<HTMLElement>(null);
  const ignoreSpyRef = useRef(false);
  const requestedItemIdRef = useRef(requestedItemId);
  requestedItemIdRef.current = requestedItemId;
  const [activeItemId, setActiveItemId] = useState<string | null>(
    items[0]?.id ?? null,
  );
  const [animateSelection, setAnimateSelection] = useState(false);

  const navigationItems = useMemo<SplitFlapNavigationItem[]>(
    () =>
      items.map((item) => {
        const boardTitle = item.title
          .toUpperCase()
          .slice(0, 13)
          .padEnd(13, " ");

        return {
          id: item.id,
          label: `${item.number.padStart(2, "0")} ${boardTitle} >`,
          accessibleLabel: `View challenge ${item.number}: ${item.title}`,
          tabId: `desktop-challenge-tab-${item.id}`,
          controlsId: `desktop-challenge-panel-${item.id}`,
        };
      }),
    [items],
  );

  const scrollToItem = useCallback(
    (itemId: string) => {
      const card = cardRefs.current.get(itemId);
      if (!card || card.getClientRects().length === 0) return;
      if (!window.matchMedia(DESKTOP_CHALLENGES_QUERY).matches) return;

      ignoreSpyRef.current = true;
      const margin =
        Number.parseFloat(getComputedStyle(card).scrollMarginTop) || 0;
      animateScrollTo(
        arrivalTokenRef,
        () =>
          Math.max(
            0,
            card.getBoundingClientRect().top + window.scrollY - margin,
          ),
        shouldReduceMotion,
        () => {
          ignoreSpyRef.current = false;
        },
      );
    },
    [arrivalTokenRef, shouldReduceMotion],
  );

  useLayoutEffect(() => {
    arriveRef.current = (itemId: string) => {
      if (!items.some((item) => item.id === itemId)) return;

      if (!window.matchMedia(DESKTOP_CHALLENGES_QUERY).matches) {
        ignoreSpyRef.current = false;
        const trigger = document.getElementById(
          `split-flap-trigger-${itemId}`,
        );
        if (!trigger || trigger.getClientRects().length === 0) return;

        const header = document.querySelector("header");
        const margin = (header?.getBoundingClientRect().height ?? 0) + 12;
        animateScrollTo(arrivalTokenRef, () =>
          Math.max(
            0,
            trigger.getBoundingClientRect().top + window.scrollY - margin,
          ),
          false,
        );
        return;
      }

      setActiveItemId(itemId);
      setAnimateSelection(true);
      scrollToItem(itemId);
    };
  }, [arrivalTokenRef, arriveRef, items, scrollToItem]);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_CHALLENGES_QUERY);
    const syncHash = () => {
      const itemId = requestedItemIdRef.current;
      if (!media.matches || !itemId) return;
      if (!items.some((item) => item.id === itemId)) return;

      setActiveItemId(itemId);
      setAnimateSelection(true);
      scrollToItem(itemId);
    };

    media.addEventListener("change", syncHash);
    return () => media.removeEventListener("change", syncHash);
  }, [items, scrollToItem]);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_CHALLENGES_QUERY);
    let observer: IntersectionObserver | null = null;

    const connect = () => {
      observer?.disconnect();
      observer = null;
      if (!media.matches) return;

      const cards = items
        .map((item) => cardRefs.current.get(item.id))
        .filter((card): card is HTMLElement => card !== undefined);
      if (cards.length === 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          if (ignoreSpyRef.current) return;

          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
            );
          const nextId = visible[0]?.target.getAttribute("data-challenge-id");
          if (!nextId) return;

          setAnimateSelection(false);
          setActiveItemId(nextId);
        },
        {
          rootMargin: "-115.2px 0px -70% 0px",
          threshold: [0, 0.25, 0.5],
        },
      );

      for (const card of cards) observer.observe(card);
    };

    connect();
    media.addEventListener("change", connect);
    return () => {
      media.removeEventListener("change", connect);
      observer?.disconnect();
    };
  }, [items]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const desktop = window.matchMedia(DESKTOP_CHALLENGES_QUERY);
    const onWheel = (event: WheelEvent) => {
      if (!fineHover.matches || !desktop.matches || event.ctrlKey) return;
      event.preventDefault();
    };

    board.addEventListener("wheel", onWheel, { passive: false });
    return () => board.removeEventListener("wheel", onWheel);
  }, [items]);

  const selectItem = (
    itemId: string,
    source: SplitFlapSelectionSource,
  ) => {
    if (!items.some((item) => item.id === itemId)) return;

    setActiveItemId(itemId);
    setAnimateSelection(source === "pointer");
    scrollToItem(itemId);
  };

  const navigationStyle = {
    "--split-flap-navigation-row-height":
      "clamp(3.5rem, min(calc(0.4875rem + 4vw), calc((100svh - 8rem) / 10)), 4.684rem)",
    "--split-flap-navigation-glyph-size":
      "min(calc(var(--split-flap-navigation-row-height) * 0.747), calc(3.7468vw - 0.4364rem), 3.5rem)",
  } as CSSProperties;

  return (
    <div
      data-challenges-desktop
      className="mx-auto hidden w-full max-w-[105rem] px-[clamp(4.375rem,5.476vw,5.75rem)] py-[clamp(7.5rem,8.929vw,9.375rem)] min-[1280px]:block"
    >
      {items.length > 0 ? (
        <div className="grid w-full grid-cols-[minmax(0,43.186%)_minmax(0,37.695%)] items-start gap-x-[19.119%]">
          <aside
            ref={boardRef}
            className="sticky top-[7.2rem] min-w-0 self-start"
          >
            <SplitFlapNavigationBoard
              items={navigationItems}
              activeItemId={activeItemId}
              animateSelection={animateSelection}
              onSelect={selectItem}
              onSettled={onSettled}
              className="w-full"
              style={navigationStyle}
            />
          </aside>

          <div className="flex min-w-0 flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                id={`desktop-challenge-panel-${item.id}`}
                data-challenge-id={item.id}
                ref={(element) => {
                  if (element) cardRefs.current.set(item.id, element);
                  else cardRefs.current.delete(item.id);
                }}
                role="tabpanel"
                aria-labelledby={`desktop-challenge-tab-${item.id}`}
                tabIndex={0}
                className="scroll-mt-[7.2rem] min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                <DesktopChallengePanel item={item} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="font-body text-[1.875rem] leading-[1.3] tracking-body">
          {emptyState}
        </p>
      )}
    </div>
  );
}

interface DesktopChallengePanelProps {
  item: ChallengeItem;
}

function DesktopChallengePanel({
  item,
}: DesktopChallengePanelProps) {
  return (
    <article
      data-challenge-panel
      aria-label={`${item.number} ${item.title}`}
      className="min-w-0"
    >
      <div className="relative aspect-[556/512] w-full overflow-hidden bg-black">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(min-width: 1680px) 556px, (min-width: 1280px) 38vw, 0px"
          className="scale-[1.12] object-contain [object-position:46%_50%]"
        />
      </div>

      <DesktopChallengeDetails item={item} />
    </article>
  );
}

function DesktopChallengeDetails({ item }: { item: ChallengeItem }) {
  const textClassName =
    "font-nav text-[clamp(1.125rem,calc(0.325rem+1vw),1.375rem)] uppercase leading-[1.3] tracking-[0.03em]";

  return (
    <dl className={cn("mt-[1.4063rem] text-white", textClassName)}>
      <div className="grid grid-cols-2 gap-x-[1.03125rem]">
        <div className="min-w-0 space-y-[1.75rem]">
          <DesktopChallengeDatum label="Club" value={item.club} />
          <DesktopChallengeDatum label="Shot" value={item.shot} />
          <DesktopChallengeDatum label="Distance" value={item.distance} />
        </div>

        <div className="min-w-0 space-y-[1.75rem]">
          <DesktopChallengeDatum
            label="Target Height"
            value={`OPEN = ${item.targetHeight.open}\nELITE = ${item.targetHeight.elite}`}
            stack
          />
          <DesktopChallengeDatum
            label="Time Limit"
            value={item.timeLimit}
            stack
          />
        </div>
      </div>

      <DesktopChallengeDatum
        label="Description"
        value={item.description}
        className="mt-[1.4063rem]"
        stack
      />
    </dl>
  );
}

interface DesktopChallengeDatumProps {
  label: string;
  value: string;
  stack?: boolean;
  className?: string;
}

function DesktopChallengeDatum({
  label,
  value,
  stack = false,
  className,
}: DesktopChallengeDatumProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="inline font-bold">{label}</dt>
      <dd
        className={cn(
          "whitespace-pre-line break-words",
          stack ? "block" : "ml-[0.35em] inline",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function ChallengeDetails({ item }: { item: ChallengeItem }) {
  return (
    <div className="pb-10 pt-12">
      <div className="relative aspect-[370/320] w-full">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 767px) calc(100vw - 2rem), 0px"
          className="scale-[1.1] object-contain"
        />
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 text-white">
        <div className="min-w-0 space-y-[1.75rem]">
          <ChallengeDatum label="Club" value={item.club} />
          <ChallengeDatum label="Shot" value={item.shot} />
          <ChallengeDatum label="Distance" value={item.distance} />
        </div>

        <div className="min-w-0 space-y-[1.75rem]">
          <ChallengeDatum
            label="Target Height"
            value={`OPEN = ${item.targetHeight.open}\nELITE = ${item.targetHeight.elite}`}
          />
          <ChallengeDatum label="Time Limit" value={item.timeLimit} />
        </div>

        <ChallengeDatum
          label="Description"
          value={item.description}
          className="col-span-2 mt-[1.4063rem]"
        />
      </dl>
    </div>
  );
}

interface ChallengeDatumProps {
  label: string;
  value: string;
  className?: string;
}

function ChallengeDatum({
  label,
  value,
  className,
}: ChallengeDatumProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="font-body text-[0.875rem] font-bold uppercase leading-[1.1]">
        {label}
      </dt>
      <dd className="mt-1 whitespace-pre-line break-words font-nav text-[0.9375rem] uppercase leading-[1.25]">
        {value}
      </dd>
    </div>
  );
}
