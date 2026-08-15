export type LocationSlug = string;

export type LocationHref = `/locations/${string}`;

export interface LocationDateRange {
  startDate: `${number}-${number}-${number}`;
  endDate: `${number}-${number}-${number}`;
}

export interface LocationCta {
  label: string;
  href: LocationHref;
}

export interface LocationListItem {
  id: string;
  city: string;
  slug: LocationSlug;
  dates: LocationDateRange;
  cta: LocationCta;
}

export interface LocationsPageContent {
  title: string;
  introduction: string;
  emptyState: string;
  locations: readonly LocationListItem[];
}
