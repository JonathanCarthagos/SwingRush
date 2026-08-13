"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { DisplayHeading } from "@/components/ui/display-heading";
import {
  SplitFlapAccordionBoard,
  type SplitFlapAccordionItem,
} from "@/components/ui/split-flap-board";
import { cn } from "@/lib/utils";

const PLACEHOLDER_IMAGE = "/images/challenge-skills.avif";

export interface ChallengeItem {
  id: string;
  number: string;
  title: string;
  image: string;
  imageAlt: string;
  club: string;
  shot: string;
  distance: string;
  targetHeight: {
    open: string;
    elite: string;
  };
  timeLimit: string;
  description: string;
}

export const CHALLENGE_ITEMS: ChallengeItem[] = [
  {
    id: "drive-through",
    number: "01",
    title: "Drive Through",
    image: PLACEHOLDER_IMAGE,
    imageAlt: "Isometric golf challenge green",
    club: "DRIVER",
    shot: "TEE SHOT",
    distance: "250′",
    targetHeight: { open: "30′", elite: "20′" },
    timeLimit: "10 MINUTES",
    description:
      "DRIVE THE BALL THROUGH THE TARGET GATE TO COMPLETE THE CHALLENGE.",
  },
  {
    id: "stinger-shot",
    number: "02",
    title: "Stinger Shot",
    image: PLACEHOLDER_IMAGE,
    imageAlt: "Isometric golf challenge green",
    club: "3I",
    shot: "LOW TRAJECTORY",
    distance: "150′",
    targetHeight: { open: "24′", elite: "12′" },
    timeLimit: "10 MINUTES",
    description:
      "KEEP THE BALL BELOW THE HEIGHT MARKER AND FIND THE TARGET AT DISTANCE.",
  },
  {
    id: "rough-lie",
    number: "03",
    title: "Rough Lie",
    image: PLACEHOLDER_IMAGE,
    imageAlt: "Isometric Big Breaker golf challenge green",
    club: "3I",
    shot: "LONG IRON\nKNOCKDOWN",
    distance: "100′",
    targetHeight: { open: "24′", elite: "12′" },
    timeLimit: "10 MINUTES",
    description: "TEE SHOT TO HIT THROUGH DIRECT-FACING TARGET AT DISTANCE.",
  },
  {
    id: "high-flyer",
    number: "04",
    title: "High Flyer",
    image: PLACEHOLDER_IMAGE,
    imageAlt: "Isometric golf challenge green",
    club: "7I",
    shot: "HIGH APPROACH",
    distance: "140′",
    targetHeight: { open: "28′", elite: "20′" },
    timeLimit: "10 MINUTES",
    description:
      "LAUNCH THE BALL OVER THE HEIGHT MARKER AND LAND IT IN THE TARGET ZONE.",
  },
  {
    id: "flag-hunter",
    number: "05",
    title: "Flag Hunter",
    image: PLACEHOLDER_IMAGE,
    imageAlt: "Isometric golf challenge green",
    club: "WEDGE",
    shot: "TARGET CONTROL",
    distance: "75′",
    targetHeight: { open: "20′", elite: "12′" },
    timeLimit: "10 MINUTES",
    description:
      "ATTACK THE FLAG AND FINISH INSIDE THE MARKED SCORING CIRCLE.",
  },
  {
    id: "bunker-splash",
    number: "06",
    title: "Bunker Splash",
    image: PLACEHOLDER_IMAGE,
    imageAlt: "Isometric golf challenge green",
    club: "SW",
    shot: "BUNKER SHOT",
    distance: "30′",
    targetHeight: { open: "16′", elite: "10′" },
    timeLimit: "10 MINUTES",
    description:
      "SPLASH OUT OF THE BUNKER AND STOP THE BALL INSIDE THE TARGET.",
  },
  {
    id: "bump-and-run",
    number: "07",
    title: "Bump & Run",
    image: PLACEHOLDER_IMAGE,
    imageAlt: "Isometric golf challenge green",
    club: "8I",
    shot: "CHIP SHOT",
    distance: "40′",
    targetHeight: { open: "12′", elite: "8′" },
    timeLimit: "10 MINUTES",
    description:
      "FLY THE FIRST MARKER AND RELEASE THE BALL ALONG THE GROUND TO THE TARGET.",
  },
  {
    id: "up-and-down",
    number: "08",
    title: "Up & Down",
    image: PLACEHOLDER_IMAGE,
    imageAlt: "Isometric golf challenge green",
    club: "WEDGE",
    shot: "SHORT GAME",
    distance: "50′",
    targetHeight: { open: "16′", elite: "10′" },
    timeLimit: "10 MINUTES",
    description:
      "PLAY THE APPROACH AND COMPLETE THE FOLLOWING PUTT INSIDE THE TIME LIMIT.",
  },
  {
    id: "flop-shot",
    number: "09",
    title: "Flop Shot",
    image: PLACEHOLDER_IMAGE,
    imageAlt: "Isometric golf challenge green",
    club: "LW",
    shot: "HIGH SOFT SHOT",
    distance: "35′",
    targetHeight: { open: "18′", elite: "12′" },
    timeLimit: "10 MINUTES",
    description:
      "OPEN THE FACE, CLEAR THE BARRIER AND LAND SOFTLY INSIDE THE TARGET.",
  },
  {
    id: "clutch-putt",
    number: "10",
    title: "Clutch Putt",
    image: PLACEHOLDER_IMAGE,
    imageAlt: "Isometric golf challenge green",
    club: "PUTTER",
    shot: "PRESSURE PUTT",
    distance: "15′",
    targetHeight: { open: "N/A", elite: "N/A" },
    timeLimit: "10 MINUTES",
    description:
      "HOLE THE FINAL PRESSURE PUTT TO CROSS THE SWINGRUSH FINISH LINE.",
  },
];

const INTRO_COPY =
  "One by one, you must navigate a gauntlet of ten golf challenges. Each will test a specific skill to see if you have what it takes to stand in the winners circle and be crowned a Swingrusher.";

export interface ChallengesPageSectionProps
  extends React.HTMLAttributes<HTMLElement> {
  items?: readonly ChallengeItem[];
}

export function ChallengesPageSection({
  items = CHALLENGE_ITEMS,
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
          text="CHALLENGES"
          className="box-border max-w-full px-[0.08em] font-display text-[3.125rem] uppercase leading-[0.84] [text-wrap:balance]"
        />
        <p className="mt-3 max-w-[23.125rem] font-body text-[1.0625rem] leading-[1.3] tracking-body">
          {INTRO_COPY}
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
            Challenge details are coming soon.
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
