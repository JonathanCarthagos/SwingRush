import type { HomePageContent } from "@/types/home";

export const HOME_PAGE_CONTENT = {
  seo: {
    title: "Ready, Set, Golf. The World's First Arena Golf Gauntlet.",
    description:
      "Ten one-of-a-kind golf skills challenges, hundreds of golfers, one finish line. Race to the finish line solo or as a team.",
  },
  hero: {
    heading: "ENTER\nTHE GOLF\nARENA",
    webmSrc: "/videos/hero-desktop.webm",
    mp4Src: "/videos/hero-desktop.mp4",
    posterSrc: "/images/hero-desktop-poster.jpg",
    mobileWebmSrc: "/videos/hero-mobile.webm",
    mobileMp4Src: "/videos/hero-mobile.mp4",
    mobilePosterSrc: "/images/hero-mobile-poster.jpg",
  },
  clubs: [
    {
      id: "driver",
      title: "Driver",
      subtitle: "Abilities will be put to the test one skill at a time",
      linkLabel: "Learn More",
      href: "/challenges#1",
      image: {
        src: "/images/clubs/driver.jpg",
        alt: "A golfer in a white shirt and black skirt swinging a driver under a red ring light",
      },
    },
    {
      id: "iron",
      title: "Iron",
      subtitle: "The clock is ticking until you cross the finish line",
      linkLabel: "Learn More",
      href: "/challenges#2",
      image: {
        src: "/images/clubs/iron.jpg",
        alt: "A golfer in a black shirt swinging an iron on the arena turf",
      },
    },
    {
      id: "wedge",
      title: "Wedge",
      subtitle:
        "Whether you are an elite golfer or a weekend warrior, we have a division for you",
      linkLabel: "Learn More",
      href: "/challenges#6",
      image: {
        src: "/images/clubs/wedge.jpg",
        alt: "A golfer hitting out of a bunker in front of a pink bunker sign",
      },
    },
    {
      id: "putter",
      title: "Putter",
      subtitle: "Take all the glory yourself or share it with your friends",
      linkLabel: "Learn More",
      href: "/challenges#10",
      image: {
        src: "/images/clubs/putter.jpg",
        alt: "A golfer in black celebrating with a putter beside a lit banner",
      },
    },
  ],
  arena: {
    heading: "NO SCORECARDS\nNO STROKES",
    description: "When will you cross the finish line?",
  },
  stories: [
    {
      id: "timed-race",
      title: "Timed race",
      subtitle: "Test your golf skills in the world’s first golf race.",
      linkLabel: "Learn More",
      href: "/how-it-works",
      image: {
        src: "/images/timed-race.jpg",
        alt: "A golfer celebrating on a lit stage in the arena",
      },
    },
    {
      id: "singles-or-teams",
      title: "Singles or teams",
      subtitle: "Race as a solo golfer or with a team of friends.",
      linkLabel: "Learn More",
      href: "/how-it-works",
      image: {
        src: "/images/singles-or-teams.jpg",
        alt: "Two golfers walking through the arena with their bags",
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
