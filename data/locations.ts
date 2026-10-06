import type {
  LocationDateRange,
  LocationListItem,
  LocationsPageContent,
  LocationStatus,
} from "@/types/locations";
import type { SeoContent } from "@/types/seo";

export const LOCATIONS_PAGE_SEO = {
  title: "Locations | SwingRush",
  description: "Explore SwingRush events across cities.",
} as const satisfies SeoContent;

export const DEFAULT_LOCATION_INTRODUCTION =
  "This is it - the inaugural SwingRush. The first time anybody will see 10 one-of-a-kind skills challenges. The first time anybody will play the arena golf gauntlet. The first time a golf skills champion will be crowned.";

const APRIL_DATES = {
  startDate: "2027-04-08",
  endDate: "2027-04-11",
} as const satisfies LocationDateRange;

function createLocation(
  city: string,
  slug: string,
  dates: LocationDateRange,
  status: LocationStatus = "waitlist",
): LocationListItem {
  return {
    id: slug,
    city,
    slug,
    dates,
    status,
    cta: {
      label: status === "register" ? "Register" : "Join Waitlist",
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
    createLocation(
      "Boston",
      "boston",
      { startDate: "2027-03-09", endDate: "2027-03-14" },
      "soldOut",
    ),
    createLocation(
      "New York City",
      "new-york-city",
      { startDate: "2027-02-18", endDate: "2027-02-21" },
      "register",
    ),
    createLocation("Philadelphia", "philadelphia", APRIL_DATES, "register"),
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
