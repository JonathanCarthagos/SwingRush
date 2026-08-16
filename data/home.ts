import type { HomePageContent } from "@/types/home";

export const HOME_PAGE_CONTENT = {
  seo: {
    title: "Ready, Set, Golf. The World's First Arena Golf Gauntlet.",
    description:
      "Ten one-of-a-kind golf skills challenges, hundreds of golfers, one finish line. Race to the finish line solo or as a team.",
  },
  hero: {
    heading: "READY\nSET\nGOLF",
    webmSrc: "/videos/Sizzzle%20one.webm",
    mp4Src: "/videos/Sizzzle%20one.mp4",
    posterSrc: "/images/hero-poster.jpg",
  },
  arena: {
    heading: "THE ARENA\nGOLF GAUNTLET",
    description:
      "Do you have the skills to complete the world’s first arena golf gauntlet and become a Swingrusher?",
  },
  stories: [
    {
      id: "ten-challenges",
      title: "Ten one-of-a-kind skills challenges",
      subtitle: "Abilities will be put to the test one skill at a time",
      body: "One by one, you must navigate a gauntlet of ten golf challenges. Each will test a specific skill to see if you have what it takes to stand in the winners circle and be crowned a Swingrusher.",
      media: "image",
      image: {
        src: "/images/challenge-skills.avif",
        alt: "Isometric golf green challenge with Big Breaker backdrop",
      },
    },
    {
      id: "crunch-time",
      title: "It’s crunch time",
      subtitle: "The clock is ticking until you cross the finish line",
      body: "No more scorekeeping or stroke counting. Time is your new scorecard and it is a race to the finish. Your challenge is to complete all skills checkpoints and cross the finish line. The fastest times will top the leaderboard as the most clutch Swingrushers to enter the arena.",
      media: "image",
      image: {
        src: "/images/crunch.avif",
        alt: "Player racing the leaderboard clock",
      },
    },
    {
      id: "skill-divisions",
      title: "Skill divisions are the new handicap",
      subtitle:
        "Whether you are an elite golfer or a weekend warrior, we have a division for you",
      body: "The elite division will increase the difficulty at each challenge while upping the stakes for those who top its leaderboard. The open division will challenge the average recreational golfer to see who has what it takes to be crowned a Swingrusher by crossing the finish line in under 60 minutes.",
      media: "scoreboard",
    },
    {
      id: "single-or-team",
      title: "Compete as a\nsingle or a team",
      subtitle: "Take all the glory yourself or share it with your friends",
      body: "Choose between a single player or a team format. Either way, challenge yourself and your golf abilities in whichever format suits you best.",
      media: "image",
      image: {
        src: "/images/team.avif",
        alt: "Golfer competing in the arena",
      },
    },
  ],
  cta: {
    heading: "SWING IN\nTHE ARENA",
    description:
      "Do you have the skills to complete the world’s first arena golf gauntlet and become a Swingrusher?",
    ctaLabel: "Contact Us",
  },
} as const satisfies HomePageContent;
