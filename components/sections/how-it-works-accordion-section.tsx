"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";

import { cn } from "@/lib/utils";

const MOTION_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];
const MOTION_EASE_IN: [number, number, number, number] = [0.76, 0, 0.24, 1];

const expandTransition: Transition = {
  duration: 0.5,
  ease: MOTION_EASE,
};
const collapseTransition: Transition = {
  duration: 0.38,
  ease: MOTION_EASE_IN,
};

const INTRO_COPY =
  "Swingrush combines the thrill of competing under arena spotlights with the adrenaline of sinking your favorite clutch golf shots. This is your chance to test all of your golf skills and see if you have what it takes to complete a golf gauntlet packed with 10 one-of-a-kind skills challenges. Feel the pressure and experience the thrill of victory or the agony of defeat.";

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  sections?: AccordionContentSection[];
}

export interface AccordionContentSection {
  heading: string;
  body: string;
}

export const HOW_IT_WORKS_ACCORDION_ITEMS: AccordionItem[] = [
  {
    id: "challenges",
    title: "The Challenges",
    content:
      "One by one, you must navigate a gauntlet of 10 one-of-a-kind golf challenges. Each checkpoint puts a different skill under pressure as you race toward the finish line.",
  },
  {
    id: "tee-times",
    title: "Tee Times",
    content:
      "Swingrush takes place over the course of several days for a limited time only in each location. The world's biggest and best indoor venues are transformed into an arena-style golf course that is open from 9am to 9pm, with tee times starting every 15 minutes.",
  },
  {
    id: "scoring",
    title: "Scoring",
    content:
      "No counting strokes here. Time is your new scorecard, and your challenge is to complete all skills checkpoints throughout the gauntlet and cross the finish line as fast as possible. The fastest times will top our leaderboard.",
  },
  {
    id: "divisions",
    title: "Divisions",
    content:
      "Swingrush features two divisions: an open division for recreational golfers and an elite division for competitive golfers.\n\nIf you have a golf handicap under 10, the elite division is for you. Elite division targets are smaller and, thus, more difficult. Only elite division golfers are eligible to be crowned champions of their respective categories.\n\nThe open division challenges recreational golfers to complete all 10 challenges in under 60 minutes. Those who do will take their place in our winners circle and be crowned a Swingrusher.",
  },
  {
    id: "categories",
    title: "Categories",
    content:
      "Swingrush features the following categories:",
    sections: [
      {
        heading: "Men's/Women's Singles",
        body: "Each golfer must complete each challenge before advancing to the next one.\nAvailable in Elite and Amateur divisions.",
      },
      {
        heading: "Men's/Women's/Mixed Doubles",
        body: "Each golfer must complete each challenge before advancing to the next one.\nAvailable in Elite and Amateur divisions.",
      },
      {
        heading: "Men's/Women's/Mixed Foursomes",
        body: "Golfers take turns hitting shots and advance as soon as one completes the challenge.\nOnly available in the Amateur division.",
      },
    ],
  },
];

export interface HowItWorksAccordionSectionProps
  extends React.HTMLAttributes<HTMLElement> {
  items?: AccordionItem[];
  intro?: string;
}

export function HowItWorksAccordionSection({
  className,
  items = HOW_IT_WORKS_ACCORDION_ITEMS,
  intro = INTRO_COPY,
  ...props
}: HowItWorksAccordionSectionProps) {
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <section
      className={cn(
        "bg-black pb-16 pt-12 text-white",
        className,
      )}
      {...props}
    >
      <div className="w-full px-4">
        <p className="max-w-[23.125rem] font-body text-[1.0625rem] leading-[1.3] tracking-body">
          {intro}
        </p>

        <div className="mt-[2.6875rem] border-t border-white">
          {items.map((item) => {
            const isOpen = openItemId === item.id;
            const triggerId = `how-it-works-${item.id}-trigger`;
            const contentId = `how-it-works-${item.id}-content`;

            return (
              <AccordionRow
                key={item.id}
                item={item}
                isOpen={isOpen}
                triggerId={triggerId}
                contentId={contentId}
                reduceMotion={shouldReduceMotion}
                onToggle={() =>
                  setOpenItemId((current) =>
                    current === item.id ? null : item.id,
                  )
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface AccordionRowProps {
  item: AccordionItem;
  isOpen: boolean;
  triggerId: string;
  contentId: string;
  reduceMotion: boolean;
  onToggle: () => void;
}

function AccordionRow({
  item,
  isOpen,
  triggerId,
  contentId,
  reduceMotion,
  onToggle,
}: AccordionRowProps) {
  const content = (
    <div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      className="pb-7"
    >
      <div className="space-y-[1.375rem] font-body text-[1.0625rem] leading-[1.3] tracking-body text-white">
        {item.content.split("\n\n").map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {item.sections?.map((section) => (
          <div key={section.heading}>
            <h3 className="font-bold">{section.heading}</h3>
            <p className="whitespace-pre-line">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <article className="border-b border-white">
      <button
        id={triggerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        className={cn(
          "flex h-[5.6875rem] w-full touch-manipulation items-center text-left font-display text-[3.125rem] uppercase leading-[2.625rem] transition-colors duration-200 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand motion-reduce:transition-none",
          isOpen ? "text-brand" : "text-white",
        )}
      >
        <span className="min-w-0 break-words">{item.title}</span>
      </button>

      {reduceMotion ? (
        isOpen ? (
          content
        ) : null
      ) : (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
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
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </article>
  );
}
