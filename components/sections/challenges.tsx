"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";

import { cn } from "@/lib/utils";

// Mirror the easing/duration conventions from nav.tsx.
const MOTION_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];
const MOTION_EASE_IN: [number, number, number, number] = [0.76, 0, 0.24, 1];

const expandTransition: Transition = { duration: 0.5, ease: MOTION_EASE };
const collapseTransition: Transition = { duration: 0.38, ease: MOTION_EASE_IN };

interface Challenge {
  title: string;
  subtitle: string;
  body: string;
  image: string;
  imageAlt: string;
  /** Aspect ratio of the image frame in the Figma design. */
  aspect: string;
  objectPosition: string;
}

const CHALLENGES: Challenge[] = [
  {
    title: "Ten one-of-a-kind skills challenges",
    subtitle: "Abilities will be put to the test one skill at a time",
    body: "One by one, you must navigate a gauntlet of ten golf challenges. Each will test a specific skill to see if you have what it takes to stand in the winners circle and be crowned a Swingrusher.",
    image: "/images/challenge-skills.avif",
    imageAlt: "Isometric golf green challenge with Big Breaker backdrop",
    aspect: "aspect-[370/356]",
    objectPosition: "center",
  },
  {
    title: "It’s crunch time",
    subtitle: "The clock is ticking until you cross the finish line",
    body: "No more scorekeeping or stroke counting. Time is your new scorecard and it is a race to the finish. Your challenge is to complete all skills checkpoints and cross the finish line. The fastest times will top the leaderboard as the most clutch Swingrushers to enter the arena.",
    image: "/images/crunch.avif",
    imageAlt: "Player racing the leaderboard clock",
    aspect: "aspect-[370/363]",
    objectPosition: "center bottom",
  },
  {
    title: "Skill divisions are the new handicap",
    subtitle:
      "Whether you are an elite golfer or a weekend warrior, we have a division for you",
    body: "The elite division will increase the difficulty at each challenge while upping the stakes for those who top its leaderboard. The open division will challenge the average recreational golfer to see who has what it takes to be crowned a Swingrusher by crossing the finish line in under 60 minutes.",
    image: "/images/challenge-divisions.avif",
    imageAlt: "Split-flap board showing skill, open and elite divisions",
    aspect: "aspect-[370/296]",
    objectPosition: "center",
  },
  {
    title: "Compete as a\nsingle or a team",
    subtitle: "Take all the glory yourself or share it with your friends",
    body: "Choose between a single player or a team format. Either way, challenge yourself and your golf abilities in whichever format suits you best.",
    image: "/images/team.avif",
    imageAlt: "Golfer competing in the arena",
    aspect: "aspect-[370/363]",
    objectPosition: "center bottom",
  },
];

export type ChallengesProps = React.HTMLAttributes<HTMLElement>;

export function Challenges({ className, ...props }: ChallengesProps) {
  // Exclusive accordion: only one card can be open at a time (null = all closed).
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className={cn("flex flex-col gap-[3.75rem] pb-16 pt-10", className)}
      {...props}
    >
      {CHALLENGES.map((item, index) => (
        <ChallengeCard
          key={item.title}
          item={item}
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
  item: Challenge;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  reduce: boolean;
}

function ChallengeCard({
  item,
  index,
  isOpen,
  onToggle,
  reduce,
}: ChallengeCardProps) {
  const bodyId = `challenge-body-${index}`;

  return (
    <article className="flex flex-col gap-6">
      <div className={cn("relative w-full overflow-hidden", item.aspect)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: item.objectPosition }}
        />
      </div>

      <div className="flex w-full flex-col text-white">
        <div className="flex flex-col gap-[0.834rem]">
          <h3 className="whitespace-pre-line font-display text-[3.125rem] uppercase leading-[0.84]">
            {item.title}
          </h3>
          <p className="max-w-[18.1rem] font-body text-[1.0625rem] font-medium leading-[1.1] tracking-body">
            {item.subtitle}
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
                {item.body}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={bodyId}
          whileTap={reduce ? undefined : { scale: 0.96 }}
          className="mt-4 w-fit font-body text-[1.0625rem] font-medium leading-[1.1] tracking-body underline underline-offset-[0.1875rem]"
        >
          Learn More
        </motion.button>
      </div>
    </article>
  );
}
