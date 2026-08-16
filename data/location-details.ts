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
  features: [],
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
