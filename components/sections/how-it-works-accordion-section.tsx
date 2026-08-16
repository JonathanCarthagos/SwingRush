"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";

import { HOW_IT_WORKS_PAGE_CONTENT } from "@/data/how-it-works";
import { cn } from "@/lib/utils";
import type { AccordionItem } from "@/types/how-it-works";

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

export interface HowItWorksAccordionSectionProps
  extends React.HTMLAttributes<HTMLElement> {
  items?: readonly AccordionItem[];
  intro?: string;
}

export function HowItWorksAccordionSection({
  className,
  items = HOW_IT_WORKS_PAGE_CONTENT.items,
  intro = HOW_IT_WORKS_PAGE_CONTENT.introduction,
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
