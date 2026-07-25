"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import { IoChevronForward } from "react-icons/io5";

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
const arrowTransition: Transition = {
  duration: 0.3,
  ease: MOTION_EASE,
};

const INTRO_COPY =
  "Swingrush combines the thrill of competing under arena spotlights with the adrenaline of sinking your favorite clutch golf shots. This is your chance to test all of your golf skills and see if you have what it takes to complete a golf gauntlet packed with 10 one-of-a-kind skills challenges. Feel the pressure and experience the thrill of victory or the agony of defeat.";

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
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
      "Choose an available tee time and arrive ready to compete. Your scheduled start keeps the arena moving and gives every golfer their moment under the spotlights.",
  },
  {
    id: "scoring",
    title: "Scoring",
    content:
      "Time is your scorecard. Complete every challenge, cross the finish line and compare your result with the fastest Swingrushers on the leaderboard.",
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
      "Compete as a single player or enter the arena with a team. Each category has its own leaderboard, so you can chase the glory yourself or share it with your friends.",
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
        "bg-black px-gutter-x pb-16 pt-12 text-white",
        className,
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-[25.125rem]">
        <p className="max-w-[23.125rem] font-body text-[1.0625rem] leading-[1.3] tracking-body">
          {intro}
        </p>

        <div className="mt-10 border-t border-white/70">
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
      className="pb-5"
    >
      <div className="space-y-5 pr-7 font-body text-[1.0625rem] leading-[1.3] tracking-body text-white">
        {item.content.split("\n\n").map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );

  return (
    <article className="border-b border-white/70">
      <button
        id={triggerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        className={cn(
          "flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left font-body text-[1.0625rem] font-bold leading-[1.1] tracking-body transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand motion-reduce:transition-none",
          isOpen ? "text-brand" : "text-white",
        )}
      >
        <span>{item.title}</span>
        <motion.span
          aria-hidden="true"
          className="shrink-0 text-[1.25rem]"
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={reduceMotion ? { duration: 0 } : arrowTransition}
        >
          <IoChevronForward />
        </motion.span>
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
