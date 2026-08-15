import type {
  LocationDateRange,
  LocationListItem,
  LocationsPageContent,
} from "@/types/locations";

const APRIL_DATES = {
  startDate: "2027-04-08",
  endDate: "2027-04-11",
} as const satisfies LocationDateRange;

function createLocation(
  city: string,
  slug: string,
  dates: LocationDateRange,
): LocationListItem {
  return {
    id: slug,
    city,
    slug,
    dates,
    cta: {
      label: "Join Waitlist",
      href: `/locations/${slug}`,
    },
  };
}

export const LOCATIONS_PAGE_CONTENT = {
  title: "Locations",
  introduction:
    "Sign up to compete in the elite division and be crowned the most skilled golfer in your city. Or sign up in the open division to see if you have what it takes to cross the finish line in under 60 minutes so you can call yourself a Swingrusher. Not sure where to start? Create a team and bring some friends.",
  emptyState: "New SwingRush locations are coming soon.",
  locations: [
    createLocation("Boston", "boston", {
      startDate: "2027-03-09",
      endDate: "2027-03-14",
    }),
    createLocation("New York City", "new-york-city", {
      startDate: "2027-02-18",
      endDate: "2027-02-21",
    }),
    createLocation("Philadelphia", "philadelphia", APRIL_DATES),
    createLocation("Atlanta", "atlanta", APRIL_DATES),
    createLocation("Detroit", "detroit", APRIL_DATES),
    createLocation("Chicago", "chicago", APRIL_DATES),
    createLocation("Dallas", "dallas", APRIL_DATES),
    createLocation("Houston", "houston", APRIL_DATES),
    createLocation("Minneapolis", "minneapolis", APRIL_DATES),
    createLocation("Denver", "denver", APRIL_DATES),
    createLocation("Phoenix", "phoenix", APRIL_DATES),
    createLocation("Los Angeles", "los-angeles", APRIL_DATES),
    createLocation("San Francisco", "san-francisco", APRIL_DATES),
    createLocation("Seattle", "seattle", APRIL_DATES),
  ],
} as const satisfies LocationsPageContent;
