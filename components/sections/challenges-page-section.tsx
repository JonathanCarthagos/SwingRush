"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  useMemo,
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

const PANEL_EASE: [number, number, number, number] = [
  0.23, 1, 0.32, 1,
];

interface PanelMotionContext {
  animate: boolean;
  direction: -1 | 1;
  reduce: boolean;
}

const panelVariants: Variants = {
  initial: ({ animate, direction, reduce }: PanelMotionContext) => ({
    opacity: animate ? 0 : 1,
    filter: animate && !reduce ? "blur(2px)" : "blur(0px)",
    transform:
      animate && !reduce
        ? `translateY(${direction * 8}px)`
        : "translateY(0px)",
  }),
  animate: ({ animate, reduce }: PanelMotionContext) => ({
    opacity: 1,
    filter: "blur(0px)",
    transform: "translateY(0px)",
    transition: {
      duration: animate ? (reduce ? 0.12 : 0.2) : 0,
      ease: PANEL_EASE,
    },
  }),
  exit: ({ animate, direction, reduce }: PanelMotionContext) => ({
    opacity: animate ? 0 : 1,
    filter: animate && !reduce ? "blur(2px)" : "blur(0px)",
    transform:
      animate && !reduce
        ? `translateY(${direction * -6}px)`
        : "translateY(0px)",
    transition: {
      duration: animate ? 0.12 : 0,
      ease: PANEL_EASE,
    },
  }),
};

export interface ChallengesPageSectionProps
  extends React.HTMLAttributes<HTMLElement> {
  introduction?: string;
  emptyState?: string;
  items?: readonly ChallengeItem[];
}

export function ChallengesPageSection({
  introduction = CHALLENGES_PAGE_CONTENT.introduction,
  emptyState = CHALLENGES_PAGE_CONTENT.emptyState,
  items = CHALLENGES_PAGE_CONTENT.items,
  className,
  ...props
}: ChallengesPageSectionProps) {
  const [openItemId, setOpenItemId] = useState<string | null>(null);
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
        "bg-black px-4 pb-16 text-white min-[1280px]:px-0 min-[1280px]:pb-0",
        className,
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-[25.125rem] pt-10 min-[1280px]:hidden">
        <p className="max-w-[23.125rem] font-body text-[1.0625rem] leading-[1.3] tracking-body">
          {introduction}
        </p>

        {boardItems.length > 0 ? (
          <SplitFlapAccordionBoard
            items={boardItems}
            openItemId={openItemId}
            onToggle={(itemId) =>
              setOpenItemId((current) =>
                current === itemId ? null : itemId,
              )
            }
            className="mt-8"
          />
        ) : (
          <p className="mt-8 font-body text-[1.0625rem] leading-[1.3] tracking-body">
            {emptyState}
          </p>
        )}
      </div>

      <DesktopChallenges
        introduction={introduction}
        emptyState={emptyState}
        items={items}
      />
    </section>
  );
}

interface DesktopChallengesProps {
  introduction: string;
  emptyState: string;
  items: readonly ChallengeItem[];
}

function DesktopChallenges({
  introduction,
  emptyState,
  items,
}: DesktopChallengesProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [selection, setSelection] = useState<{
    activeItemId: string | null;
    animate: boolean;
    direction: -1 | 1;
  }>({
    activeItemId: items[0]?.id ?? null,
    animate: false,
    direction: 1,
  });

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
  const resolvedActiveIndex = Math.max(
    0,
    items.findIndex((item) => item.id === selection.activeItemId),
  );
  const activeItem = items[resolvedActiveIndex] ?? null;

  const selectItem = (
    itemId: string,
    source: SplitFlapSelectionSource,
  ) => {
    const nextIndex = items.findIndex((item) => item.id === itemId);
    if (nextIndex < 0 || nextIndex === resolvedActiveIndex) return;

    setSelection({
      activeItemId: itemId,
      animate: source === "pointer",
      direction: nextIndex > resolvedActiveIndex ? 1 : -1,
    });
  };

  const motionContext: PanelMotionContext = {
    animate: selection.animate,
    direction: selection.direction,
    reduce: shouldReduceMotion,
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
      className="mx-auto hidden w-full max-w-[105rem] px-desktop-gutter pb-[9.125rem] pt-10 min-[1280px]:block"
    >
      <header className="flex w-full max-w-[46.625rem] flex-col">
        <p className="font-body text-[1.875rem] leading-[1.3] tracking-body">
          {introduction}
        </p>
      </header>

      {items.length > 0 ? (
        <div className="mt-[2.3125rem] grid w-full grid-cols-[minmax(0,40.874%)_minmax(0,35.733%)] items-start gap-x-[18.188%]">
          <aside className="min-w-0">
            <SplitFlapNavigationBoard
              items={navigationItems}
              activeItemId={activeItem?.id ?? null}
              animateSelection={selection.animate}
              onSelect={selectItem}
              className="w-full"
              style={navigationStyle}
            />
          </aside>

          <div className="min-h-[clamp(42rem,48.5vw,49rem)] min-w-0">
            <AnimatePresence
              initial={false}
              mode="wait"
              custom={motionContext}
            >
              {activeItem && (
                <motion.div
                  key={activeItem.id}
                  id={`desktop-challenge-panel-${activeItem.id}`}
                  role="tabpanel"
                  aria-labelledby={`desktop-challenge-tab-${activeItem.id}`}
                  tabIndex={0}
                  custom={motionContext}
                  variants={panelVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  <DesktopChallengePanel item={activeItem} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <p className="mt-16 font-body text-[1.875rem] leading-[1.3] tracking-body">
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
          sizes="(min-width: 1680px) 556px, (min-width: 1280px) 36vw, 0px"
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
        <div className="min-w-0">
          <ChallengeDatum label="Club" value={item.club} />
          <ChallengeDatum label="Shot" value={item.shot} />
          <ChallengeDatum label="Distance" value={item.distance} />
        </div>

        <div className="min-w-0 space-y-5">
          <ChallengeDatum
            label="Target Height"
            value={`OPEN = ${item.targetHeight.open}\nELITE = ${item.targetHeight.elite}`}
          />
          <ChallengeDatum label="Time Limit" value={item.timeLimit} />
        </div>

        <ChallengeDatum
          label="Description"
          value={item.description}
          className="col-span-2"
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
