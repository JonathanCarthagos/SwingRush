import type { LocationDetailPageContent } from "@/types/location-detail";

const STANDARD_SESSIONS = [
  { startTime: "09:00", endTime: "12:00" },
  { startTime: "12:00", endTime: "15:00" },
  { startTime: "15:00", endTime: "18:00" },
  { startTime: "18:00", endTime: "21:00" },
] as const;

type SessionCategories = readonly [string, string, string, string];

function createSessions(categories: SessionCategories) {
  return categories.map((category, index) => ({
    id: `${category.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}-${index}`,
    category,
    ...STANDARD_SESSIONS[index],
  }));
}

export const NEW_YORK_LOCATION_DETAIL = {
  id: "new-york-city",
  slug: "new-york-city",
  city: "New York City",
  venueName: "Javits Center",
  dates: {
    startDate: "2027-02-18",
    endDate: "2027-02-21",
  },
  introduction:
    "This is it - the inaugural SwingRush. The first time anybody will see 10 one-of-a-kind skills challenges. The first time anybody will play the arena golf gauntlet. The first time a golf skills champion will be crowned.",
  seo: {
    title: "New York City",
    description:
      "Join SwingRush at the Javits Center in New York City from February 18-21, 2027.",
  },
  hero: {
    ariaLabel: "SwingRush New York arena preview",
    webmSrc: "/videos/Sizzzle%20one.webm",
    mp4Src: "/videos/Sizzzle%20one.mp4",
    posterSrc: "/images/hero-poster.jpg",
  },
  primaryAction: {
    label: "Join Waitlist",
    href: "#ticket-info",
  },
  features: [
    {
      id: "ten-challenges",
      title: "10 Challenges",
      description:
        "Step into the arena and navigate a golf gauntlet featuring 10 one-of-a-kind skills challenges. From driver accuracy to iron precision to putter touch, all of your golf skills will be put to the test.",
      image: {
        src: "/images/locations/new-york/ten-challenges.jpg",
        alt: "Golfer taking a shot inside the illuminated SwingRush arena",
        width: 742,
        height: 495,
      },
    },
    {
      id: "hundreds-of-golfers",
      title: "100’s of Golfers",
      description:
        "Each day will feature multiple tee times where golfers will choose to play in the open division or compete in the elite division. The elite division challenges feature a higher degree of difficulty with smaller holes and targets.",
      image: {
        src: "/images/locations/new-york/hundreds-of-golfers.jpg",
        alt: "Golfers carrying their bags through the SwingRush arena",
        width: 742,
        height: 495,
      },
    },
    {
      id: "finish-line",
      title: "1 Finish Line",
      description:
        "Open division participants must complete all 10 challenges and cross the finish line in under 60 minutes to stand in the winner's circle and be named a Swingrusher. Elite competitors will race to have the fastest time through all 10 challenges in order to be crowned the most skilled golfers in their categories.",
      image: {
        src: "/images/locations/new-york/finish-line.jpg",
        alt: "Competitors entering the SwingRush Elite Snyder finish line",
        width: 742,
        height: 495,
      },
    },
  ],
  schedule: {
    title: "Schedule",
    days: [
      {
        date: "2027-02-18",
        sessions: createSessions([
          "Men's Amateur Singles",
          "Women's Amateur Singles",
          "Men's Amateur Doubles",
          "Women's Amateur Doubles",
        ]),
      },
      {
        date: "2027-02-19",
        sessions: createSessions([
          "Men's Amateur Singles",
          "Women's Amateur Singles",
          "Men's Elite Doubles",
          "Women's Elite Doubles",
        ]),
      },
      {
        date: "2027-02-20",
        sessions: createSessions([
          "Men's Elite Singles",
          "Women's Elite Singles",
          "Men's Amateur Team",
          "Women's Amateur Team",
        ]),
      },
      {
        date: "2027-02-21",
        sessions: createSessions([
          "Men's Elite Team",
          "Women's Elite Team",
          "Men's Amateur Doubles",
          "Women's Amateur Doubles",
        ]),
      },
    ],
  },
  ticketInfo: {
    id: "ticket-info",
    title: "Ticket Info",
    releases: [
      {
        id: "private-pre-sale",
        title: "Private Pre Sale",
        description: "Tee time pre-sale to RSVP waitlist:",
        releaseDate: "2026-11-18",
        action: {
          label: "Join Pre Sale Waitlist",
          href: "#ticket-info",
        },
      },
      {
        id: "general-public-sale",
        title: "General Public Sale",
        description: "Tee times on sale to the general public:",
        releaseDate: "2026-12-02",
      },
    ],
  },
  importantInformation: {
    title: "Important Information",
    blocks: [
      {
        id: "location",
        title: "Location",
        lines: ["Javits Center", "429 11th Ave.", "New York, NY"],
      },
      {
        id: "parking",
        title: "Parking",
        lines: ["Information about parking will go here.", "$25 per car"],
      },
      {
        id: "check-in",
        title: "Check-in",
        lines: [
          "Please arrive at least 45 minutes prior to your scheduled tee time and bring I.D.",
        ],
      },
    ],
    volunteer: {
      title: "Volunteer",
      description:
        "Want to be part of the energy and experience the full SwingRush experience? Join our growing community of greenskeepers. Volunteer greenskeepers receive the following benefits:",
      benefits: [
        "Complimentary SwingRush amateur singles entry after your shift.",
        "Official Greenskeeper t-shirt",
      ],
      action: {
        label: "Sign Up to Volunteer",
        href: "#volunteer",
      },
    },
  },
} as const satisfies LocationDetailPageContent;

export const LOCATION_DETAIL_MOCKS = {
  "new-york-city": NEW_YORK_LOCATION_DETAIL,
} as const satisfies Record<string, LocationDetailPageContent>;

export function getLocationDetailMock(slug: string) {
  return LOCATION_DETAIL_MOCKS[
    slug as keyof typeof LOCATION_DETAIL_MOCKS
  ] as LocationDetailPageContent | undefined;
}
