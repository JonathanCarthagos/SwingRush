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
      className={cn("flex flex-col gap-[3.75rem] pb-16 pt-10", className)}
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

  return (
    <article className="flex flex-col gap-6">
      {story.media === "scoreboard" ? (
        <div
          className={cn(
            "flex w-full items-center overflow-hidden",
            frame.aspect,
          )}
        >
          <SplitFlapBoard rows={SCOREBOARD_ROWS} />
        </div>
      ) : (
        <div className={cn("relative w-full overflow-hidden", frame.aspect)}>
          <Image
            src={story.image?.src ?? ""}
            alt={story.image?.alt ?? ""}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: frame.objectPosition }}
          />
        </div>
      )}

      <div className="flex w-full flex-col text-white">
        <div className="flex flex-col gap-[0.834rem]">
          <DisplayHeading
            as="h3"
            text={story.title}
            className="box-border max-w-[calc(100vw-2rem)] whitespace-pre-line px-[0.08em] font-display text-[clamp(2.625rem,11.25vw,3.125rem)] uppercase leading-[0.88] [text-wrap:balance]"
          />
          <p className="max-w-[18.1rem] font-body text-[1.0625rem] font-medium leading-[1.1] tracking-body">
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
              <p className="max-w-[18.72rem] pt-4 font-body text-[1.0625rem] leading-[1.3] tracking-body">
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
          className="mt-4 w-fit font-body text-[1.0625rem] font-medium leading-[1.1] tracking-body underline underline-offset-[0.1875rem]"
        >
          Learn More
        </button>
      </div>
    </article>
  );
}
