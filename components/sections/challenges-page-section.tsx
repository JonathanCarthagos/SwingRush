"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { DisplayHeading } from "@/components/ui/display-heading";
import {
  SplitFlapAccordionBoard,
  type SplitFlapAccordionItem,
} from "@/components/ui/split-flap-board";
import { CHALLENGES_PAGE_CONTENT } from "@/data/challenges";
import { cn } from "@/lib/utils";
import type { ChallengeItem } from "@/types/challenges";

export interface ChallengesPageSectionProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  introduction?: string;
  emptyState?: string;
  items?: readonly ChallengeItem[];
}

export function ChallengesPageSection({
  title = CHALLENGES_PAGE_CONTENT.title,
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
        "bg-black px-4 pb-16 pt-nav-offset text-white",
        className,
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-[25.125rem] pt-10">
        <DisplayHeading
          as="h1"
          text={title}
          className="box-border max-w-full px-[0.08em] font-display text-[3.125rem] uppercase leading-[0.84] [text-wrap:balance]"
        />
        <p className="mt-3 max-w-[23.125rem] font-body text-[1.0625rem] leading-[1.3] tracking-body">
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
    </section>
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
