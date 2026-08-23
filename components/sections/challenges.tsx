"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";

import { DisplayHeading } from "@/components/ui/display-heading";
import { SplitFlapBoard } from "@/components/ui/split-flap-board";
import { HOME_PAGE_CONTENT } from "@/data/home";
import { cn } from "@/lib/utils";
import type { HomeStory } from "@/types/home";

// Mirror the easing/duration conventions from nav.tsx.
const MOTION_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];
const MOTION_EASE_IN: [number, number, number, number] = [0.76, 0, 0.24, 1];

const expandTransition: Transition = { duration: 0.5, ease: MOTION_EASE };
const collapseTransition: Transition = { duration: 0.38, ease: MOTION_EASE_IN };

const SCOREBOARD_ROWS = ["SKILL DIVISIONS", "AMATEUR DIVISION", "ELITE DIVISION"];

const SCOREBOARD_FRAME = { aspect: "aspect-[370/296]", objectPosition: "center" };

// The media frames come from the design, not from the CMS, so editors never
// have to reason about aspect ratios.
const STORY_FRAMES = [
  { aspect: "aspect-[370/356]", objectPosition: "center" },
  { aspect: "aspect-[370/363]", objectPosition: "center bottom" },
  { aspect: "aspect-[370/296]", objectPosition: "center" },
  { aspect: "aspect-[370/363]", objectPosition: "center bottom" },
];

// Tablet uses the assets' intrinsic proportions so the complete composition
// remains visible. Mobile and desktop keep their approved design frames.
const TABLET_STORY_ASPECTS = [
  "min-[768px]:aspect-[704/602]",
  "min-[768px]:aspect-[695/682]",
  "min-[768px]:aspect-auto",
  "min-[768px]:aspect-[695/682]",
];

function frameFor(story: HomeStory, index: number) {
  if (story.media === "scoreboard") return SCOREBOARD_FRAME;
  return STORY_FRAMES[index] ?? STORY_FRAMES[STORY_FRAMES.length - 1];
}

export interface ChallengesProps extends React.HTMLAttributes<HTMLElement> {
  stories?: readonly HomeStory[];
}

export function Challenges({
  className,
  stories = HOME_PAGE_CONTENT.stories,
  ...props
}: ChallengesProps) {
  // Exclusive accordion: only one card can be open at a time (null = all closed).
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className={cn(
        "flex w-full flex-col gap-[3.75rem] px-gutter-x pb-16 pt-10 min-[768px]:mx-auto min-[768px]:max-w-tablet-content min-[768px]:gap-challenge-tablet-section-gap min-[768px]:px-tablet-gutter min-[768px]:pb-challenge-tablet-pb min-[768px]:pt-challenge-tablet-pt min-[1280px]:max-w-desktop-content min-[1280px]:gap-[9.375rem] min-[1280px]:px-0 min-[1280px]:pb-[10.875rem] min-[1280px]:pt-[10.3125rem]",
        className,
      )}
      {...props}
    >
      {stories.map((story, index) => (
        <ChallengeCard
          key={story.id}
          story={story}
          index={index}
          isOpen={openIndex === index}
          onToggle={() =>
            setOpenIndex((current) => (current === index ? null : index))
          }
          reduce={shouldReduceMotion ?? false}
        />
      ))}
    </section>
  );
}

interface ChallengeCardProps {
  story: HomeStory;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  reduce: boolean;
}

function ChallengeCard({
  story,
  index,
  isOpen,
  onToggle,
  reduce,
}: ChallengeCardProps) {
  const bodyId = `challenge-body-${index}`;
  const frame = frameFor(story, index);
  const desktopMediaClass = [
    "min-[1280px]:h-[33.8rem]",
    "min-[1280px]:h-[30.254rem]",
    "min-[1280px]:h-[25.832rem]",
    "min-[1280px]:h-[30.254rem]",
  ][index] ?? "min-[1280px]:h-[30.254rem]";
  const tabletAspectClass =
    TABLET_STORY_ASPECTS[index] ?? TABLET_STORY_ASPECTS.at(-1);

  return (
    <article
      className={cn(
        "flex flex-col gap-6 min-[768px]:gap-challenge-tablet-card-gap min-[1280px]:grid min-[1280px]:grid-cols-[minmax(0,562px)_minmax(0,528px)] min-[1280px]:items-center min-[1280px]:gap-x-[clamp(4rem,10.83vw,11.375rem)] min-[1280px]:gap-y-0",
        index % 2 === 1 &&
          "min-[1280px]:grid-cols-[minmax(0,528px)_minmax(0,494px)] min-[1280px]:justify-end",
      )}
    >
      {story.media === "scoreboard" ? (
        <div
          className={cn(
            "flex w-full items-center overflow-hidden min-[768px]:mx-auto min-[768px]:max-w-challenge-tablet-media min-[768px]:aspect-auto min-[1280px]:mx-0 min-[1280px]:max-w-none",
            frame.aspect,
            desktopMediaClass,
            index % 2 === 1 && "min-[1280px]:order-2",
          )}
        >
          <SplitFlapBoard
            rows={SCOREBOARD_ROWS}
            className="min-[768px]:[--split-flap-display-glyph-size:clamp(4rem,calc(2.125rem_+_3.90625vw),5.25rem)] min-[768px]:[--split-flap-display-slot-height:clamp(5.375rem,calc(2.9375rem_+_5.078125vw),7rem)] min-[768px]:[--split-flap-display-slot-width:clamp(2.5rem,calc(1.375rem_+_2.34375vw),3.25rem)] min-[1280px]:[--split-flap-display-glyph-size:4rem] min-[1280px]:[--split-flap-display-slot-height:5.375rem] min-[1280px]:[--split-flap-display-slot-width:2.5rem]"
          />
        </div>
      ) : (
        <div
          className={cn(
            "relative w-full overflow-hidden min-[768px]:mx-auto min-[768px]:max-w-challenge-tablet-media min-[1280px]:mx-0 min-[1280px]:max-w-none min-[1280px]:aspect-auto",
            frame.aspect,
            tabletAspectClass,
            desktopMediaClass,
            index % 2 === 1 && "min-[1280px]:order-2",
          )}
        >
          <Image
            src={story.image?.src ?? ""}
            alt={story.image?.alt ?? ""}
            fill
            sizes="(min-width: 1280px) 562px, (min-width: 768px) min(56rem, calc(100vw - 4rem)), 100vw"
            className="object-cover min-[768px]:object-contain min-[1280px]:object-cover"
            style={{ objectPosition: frame.objectPosition }}
          />
        </div>
      )}

      <div className="flex w-full flex-col text-left text-white min-[768px]:mx-auto min-[768px]:max-w-challenge-tablet-copy min-[1280px]:mx-0 min-[1280px]:max-w-none min-[1280px]:self-center">
        <div className="flex flex-col gap-[0.834rem] min-[768px]:gap-[0.83375rem]">
          <DisplayHeading
            as="h3"
            text={story.title}
            className="box-border max-w-[calc(100vw-2rem)] whitespace-pre-line px-[0.08em] font-display text-[clamp(2.625rem,11.25vw,3.125rem)] uppercase leading-[0.88] [text-wrap:balance] min-[768px]:max-w-full min-[768px]:text-challenge-title-tablet min-[1280px]:text-[4.6875rem]"
          />
          <p className="max-w-[18.1rem] font-body text-[1.0625rem] font-medium leading-[1.1] tracking-body min-[768px]:max-w-full min-[768px]:text-challenge-copy-tablet min-[768px]:font-normal min-[1280px]:text-[1.5rem]">
            {story.subtitle}
          </p>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="body"
              id={bodyId}
              className="overflow-hidden"
              initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
              exit={
                reduce
                  ? { opacity: 0, transition: { duration: 0.2 } }
                  : { height: 0, opacity: 0, transition: collapseTransition }
              }
              transition={reduce ? { duration: 0.2 } : expandTransition}
            >
              {/* pt-4 keeps the 16px rhythm inside the animated height so the
                  collapse leaves no leftover gap. */}
              <p className="max-w-[18.72rem] pt-4 font-body text-[1.0625rem] leading-[1.3] tracking-body min-[768px]:max-w-full min-[768px]:text-challenge-body-tablet min-[1280px]:text-[1.25rem]">
                {story.body}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={bodyId}
          className="mt-4 w-fit font-body text-[1.0625rem] font-medium leading-[1.1] tracking-body underline underline-offset-[0.1875rem] min-[768px]:mt-6 min-[768px]:min-h-11 min-[768px]:touch-manipulation min-[768px]:text-challenge-copy-tablet min-[1280px]:text-[1.5rem]"
        >
          Learn More
        </button>
      </div>
    </article>
  );
}
