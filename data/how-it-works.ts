import type { HowItWorksPageContent } from "@/types/how-it-works";

export const HOW_IT_WORKS_PAGE_CONTENT = {
  seo: {
    title: "How It Works | SwingRush",
    description: "Learn how SwingRush events work from start to finish.",
  },
  hero: {
    heading: "HOW IT WORKS",
    webmSrc: "/videos/Sizzzle%20one.webm",
    mp4Src: "/videos/Sizzzle%20one.mp4",
    posterSrc: "/images/hero-poster.jpg",
    arenaHeading: "THE ARENA\nGOLF GAUNTLET",
    arenaDescription:
      "Do you have the skills to complete each golf challenge as fast as you can and become a Swingrusher?",
  },
  introduction:
    "Swingrush combines the thrill of competing under arena spotlights with the adrenaline of sinking your favorite clutch golf shots. This is your chance to test all of your golf skills and see if you have what it takes to complete a golf gauntlet packed with 10 one-of-a-kind skills challenges. Feel the pressure and experience the thrill of victory or the agony of defeat.",
  items: [
    {
      id: "skills-challenges",
      title: "Skills Challenges",
      content:
        "Swingrush features two divisions: an open division for recreational golfers and an elite division for competitive golfers.\n\nIf you have a golf handicap under 10, the elite division is for you. Elite division targets are smaller and, thus, more difficult. Only elite division golfers are eligible to be crowned champions of their respective categories.\n\nThe open division challenges recreational golfers to complete all 10 challenges in under 60 minutes. Those who do will take their place in our winners circle and be crowned a Swingrusher.",
      image: {
        src: "/images/how-it-works/skills-challenges.jpg",
        alt: "A golfer swings on an arena tee box beside a glowing Swingrush target",
      },
      link: { label: "View Skills Challenges", href: "/challenges" },
    },
    {
      id: "race-format",
      title: "Race Format",
      content:
        "Swingrush takes place over the course of several days for a limited time only in each location. The world’s biggest and best indoor venues are transformed into an arena-style golf course that is open from 9am to 9pm, with tee times starting every 15 minutes.\n\nNo counting strokes here. Time is your new scorecard, and your challenge is to complete all skills checkpoints throughout the gauntlet and cross the finish line as fast as possible. The fastest times will top our leaderboard.",
      image: {
        src: "/images/how-it-works/race-format.jpg",
        alt: "A golfer crosses the finish line under the live leaderboard as the crowd cheers",
      },
    },
    {
      id: "skills-divisions",
      title: "Skills Divisions",
      content:
        "Swingrush features two divisions: an open division for recreational golfers and an elite division for competitive golfers.\n\nIf you have a golf handicap under 10, the elite division is for you. Elite division targets are smaller and, thus, more difficult. Only elite division golfers are eligible to be crowned champions of their respective categories.\n\nThe open division challenges recreational golfers to complete all 10 challenges in under 60 minutes. Those who do will take their place in our winners circle and be crowned a Swingrusher.",
      image: {
        src: "/images/how-it-works/skill-divisions.jpg",
        mobileSrc: "/images/how-it-works/skill-divisions-mobile.jpg",
        alt: "Golfers play out of a bunker on the arena course",
      },
    },
    {
      id: "teams",
      title: "Teams",
      content: "Swingrush features the following categories:",
      sections: [
        {
          heading: "Men’s/Women’s Singles",
          body: "Each golfer must complete each challenge before advancing to the next one.\nAvailable in Elite and Amateur divisions.",
        },
        {
          heading: "Men’s/Women’s/Mixed Doubles",
          body: "Each golfer must complete each challenge before advancing to the next one.\nAvailable in Elite and Amateur divisions.",
        },
        {
          heading: "Men’s/Women’s/Mixed Foursomes",
          body: "Golfers take turns hitting shots and advance as soon as one completes the challenge.\nOnly available in the Amateur division.",
        },
      ],
      image: {
        src: "/images/how-it-works/teams.jpg",
        alt: "Two teammates high-five on the arena green",
      },
    },
  ],
} as const satisfies HowItWorksPageContent;
