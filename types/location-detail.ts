import type {
  LocationDateRange,
  LocationSlug,
} from "@/types/locations";

export type IsoDate = `${number}-${number}-${number}`;
export type IsoTime = `${number}:${number}`;

export interface LocationAction {
  label: string;
  href: string;
}

export interface LocationHeroMedia {
  ariaLabel: string;
  webmSrc: string;
  mp4Src: string;
  posterSrc: string;
}

export interface LocationFeatureImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface LocationFeature {
  id: string;
  title: string;
  description: string;
  image: LocationFeatureImage;
}

export interface LocationScheduleSession {
  id: string;
  category: string;
  startTime: IsoTime;
  endTime: IsoTime;
}

export interface LocationScheduleDay {
  date: IsoDate;
  sessions: readonly LocationScheduleSession[];
}

export interface LocationTicketRelease {
  id: string;
  title: string;
  description: string;
  releaseDate: IsoDate;
  action?: LocationAction;
}

export interface LocationInformationBlock {
  id: string;
  title: string;
  lines: readonly string[];
}

export interface LocationVolunteerInformation {
  title: string;
  description: string;
  benefits: readonly string[];
  action: LocationAction;
}

export interface LocationDetailPageContent {
  id: string;
  slug: LocationSlug;
  city: string;
  venueName: string;
  dates: LocationDateRange;
  introduction: string;
  seo: {
    title: string;
    description: string;
  };
  hero: LocationHeroMedia;
  primaryAction: LocationAction;
  features: readonly LocationFeature[];
  schedule: {
    title: string;
    days: readonly LocationScheduleDay[];
  };
  ticketInfo: {
    id: string;
    title: string;
    releases: readonly LocationTicketRelease[];
  };
  importantInformation: {
    title: string;
    blocks: readonly LocationInformationBlock[];
    volunteer?: LocationVolunteerInformation;
  };
}
