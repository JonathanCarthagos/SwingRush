import type { ChallengeItem, ChallengesPageContent } from "@/types/challenges";

const PLACEHOLDER_IMAGE = "/images/challenge-skills.avif";

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

export const CHALLENGE_PLACEHOLDER_IMAGE = PLACEHOLDER_IMAGE;

export const CHALLENGES_PAGE_CONTENT = {
  seo: {
    title: "Challenges | SwingRush",
    description: "Take on ten one-of-a-kind SwingRush golf skills challenges.",
  },
  title: "CHALLENGES",
  introduction:
    "One by one, you must navigate a gauntlet of ten golf challenges. Each will test a specific skill to see if you have what it takes to stand in the winners circle and be crowned a Swingrusher.",
  emptyState: "Challenge details are coming soon.",
  items: CHALLENGE_ITEMS,
} satisfies ChallengesPageContent;
