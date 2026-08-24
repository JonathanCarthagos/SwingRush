"use client";

import Image from "next/image";
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

const DESKTOP_MEDIA_SRC = "/images/how-it-works-arena.jpg";

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
        "bg-black pb-16 pt-12 text-white min-[1280px]:pb-36 min-[1280px]:pt-[4.625rem]",
        className,
      )}
      {...props}
    >
      <div className="w-full px-4 min-[1280px]:hidden">
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

      <div className="mx-auto hidden w-full max-w-[105rem] px-desktop-gutter min-[1280px]:block">
        <p className="w-[48rem] max-w-full font-body text-[1.875rem] leading-[1.3] tracking-body">
          {intro}
        </p>

        <div className="mt-[6.25rem] flex flex-col gap-[5.125rem]">
          {items.map((item) => (
            <article
              key={item.id}
              className="grid w-full grid-cols-[minmax(0,32.455%)_minmax(0,49.293%)] items-start justify-between"
            >
              <h2 className="font-display text-[4.6875rem] uppercase leading-[0.85] text-white">
                {item.title}
              </h2>

              <div className="flex min-w-0 flex-col gap-7">
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-black">
                  <div className="pointer-events-none absolute left-[-6.7%] top-[-14.7%] size-[119.77%]">
                    <Image
                      src={DESKTOP_MEDIA_SRC}
                      alt=""
                      aria-hidden
                      fill
                      sizes="(min-width: 1680px) 767px, (min-width: 1280px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                <ItemContent
                  item={item}
                  className="space-y-[1.95rem] font-body text-2xl leading-[1.3] tracking-body text-white"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ItemContent({
  item,
  className,
}: {
  item: AccordionItem;
  className: string;
}) {
  return (
    <div className={className}>
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
      <ItemContent
        item={item}
        className="space-y-[1.375rem] font-body text-[1.0625rem] leading-[1.3] tracking-body text-white"
      />
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
