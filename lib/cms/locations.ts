import { getLocationDetailMock } from "@/data/location-details";
import { LOCATIONS_PAGE_CONTENT, LOCATIONS_PAGE_SEO } from "@/data/locations";
import { DEFAULT_FEATURE_IMAGE_SIZE, DEFAULT_HERO_MEDIA } from "@/data/media";
import { cmsFetch, type CmsReadOptions } from "@/lib/cms/fetch";
import { compact, isoDate, isoTime, text, toId } from "@/lib/cms/utils";
import {
  LOCATION_BY_SLUG_QUERY,
  LOCATION_SITEMAP_QUERY,
  LOCATION_SLUGS_QUERY,
  LOCATIONS_PAGE_QUERY,
} from "@/sanity/lib/queries";
import type {
  LocationDetailPageContent,
  LocationFeature,
  LocationInformationBlock,
  LocationScheduleDay,
  LocationTicketRelease,
  LocationVolunteerInformation,
} from "@/types/location-detail";
import type {
  LocationDateRange,
  LocationListItem,
  LocationsPageDocument,
} from "@/types/locations";

const TICKET_INFO_ANCHOR = "ticket-info";

interface RawAction {
  label?: string | null;
  href?: string | null;
}

interface RawDates {
  startDate?: string | null;
  endDate?: string | null;
}

interface RawLocationSummary {
  _id: string;
  city?: string | null;
  slug?: string | null;
  dates?: RawDates | null;
  ctaLabel?: string | null;
}

interface RawLocationsPage {
  page?: {
    title?: string | null;
    introduction?: string | null;
    emptyState?: string | null;
    seo?: { title?: string | null; description?: string | null } | null;
  } | null;
  locations?: RawLocationSummary[] | null;
}

interface RawLocationDetail extends RawLocationSummary {
  detailStatus?: string | null;
  venueName?: string | null;
  introduction?: string | null;
  seo?: { title?: string | null; description?: string | null } | null;
  hero?: {
    ariaLabel?: string | null;
    posterSrc?: string | null;
    webmSrc?: string | null;
    mp4Src?: string | null;
  } | null;
  primaryAction?: RawAction | null;
  features?:
    | {
        _key: string;
        title?: string | null;
        description?: string | null;
        image?: {
          src?: string | null;
          alt?: string | null;
          width?: number | null;
          height?: number | null;
        } | null;
      }[]
    | null;
  schedule?: {
    title?: string | null;
    days?:
      | {
          _key: string;
          date?: string | null;
          sessions?:
            | {
                _key: string;
                category?: string | null;
                startTime?: string | null;
                endTime?: string | null;
              }[]
            | null;
        }[]
      | null;
  } | null;
  ticketInfo?: {
    title?: string | null;
    releases?:
      | {
          _key: string;
          title?: string | null;
          description?: string | null;
          releaseDate?: string | null;
          action?: RawAction | null;
        }[]
      | null;
  } | null;
  importantInformation?: {
    title?: string | null;
    blocks?:
      | {
          _key: string;
          title?: string | null;
          lines?: string[] | null;
        }[]
      | null;
    volunteer?: {
      title?: string | null;
      description?: string | null;
      benefits?: string[] | null;
      action?: RawAction | null;
    } | null;
  } | null;
}

function adaptDates(dates: RawDates | null | undefined) {
  const startDate = isoDate(dates?.startDate);
  const endDate = isoDate(dates?.endDate);
  if (!startDate || !endDate) return undefined;
  return { startDate, endDate } satisfies LocationDateRange;
}

function adaptSummary(
  raw: RawLocationSummary,
): LocationListItem | undefined {
  const city = text(raw.city);
  const slug = text(raw.slug);
  const dates = adaptDates(raw.dates);
  if (!city || !slug || !dates) return undefined;

  return {
    id: slug,
    city,
    slug,
    dates,
    cta: {
      label: text(raw.ctaLabel) ?? "Join Waitlist",
      href: `/locations/${slug}`,
    },
  };
}

function adaptFeatures(raw: RawLocationDetail): LocationFeature[] {
  return (raw.features ?? []).flatMap((feature) => {
    const title = text(feature.title);
    const description = text(feature.description);
    const src = text(feature.image?.src);
    if (!title || !description || !src) return [];

    return [
      {
        id: feature._key,
        title,
        description,
        image: {
          src,
          alt: text(feature.image?.alt) ?? "",
          width: feature.image?.width ?? DEFAULT_FEATURE_IMAGE_SIZE.width,
          height: feature.image?.height ?? DEFAULT_FEATURE_IMAGE_SIZE.height,
        },
      },
    ];
  });
}

function adaptScheduleDays(raw: RawLocationDetail): LocationScheduleDay[] {
  return (raw.schedule?.days ?? []).flatMap((day) => {
    const date = isoDate(day.date);
    if (!date) return [];

    const sessions = (day.sessions ?? []).flatMap((session) => {
      const category = text(session.category);
      const startTime = isoTime(session.startTime);
      const endTime = isoTime(session.endTime);
      if (!category || !startTime || !endTime) return [];
      return [{ id: session._key, category, startTime, endTime }];
    });

    return sessions.length > 0 ? [{ date, sessions }] : [];
  });
}

function adaptReleases(raw: RawLocationDetail): LocationTicketRelease[] {
  return (raw.ticketInfo?.releases ?? []).flatMap((release) => {
    const title = text(release.title);
    const description = text(release.description);
    const releaseDate = isoDate(release.releaseDate);
    if (!title || !description || !releaseDate) return [];

    const label = text(release.action?.label);
    const href = text(release.action?.href);

    return [
      {
        id: release._key,
        title,
        description,
        releaseDate,
        ...(label && href ? { action: { label, href } } : {}),
      },
    ];
  });
}

function adaptInformationBlocks(
  raw: RawLocationDetail,
): LocationInformationBlock[] {
  return (raw.importantInformation?.blocks ?? []).flatMap((block) => {
    const title = text(block.title);
    const lines = compact((block.lines ?? []).map((line) => text(line)));
    if (!title || lines.length === 0) return [];

    return [{ id: toId(title, block._key), title, lines }];
  });
}

function adaptVolunteer(
  raw: RawLocationDetail,
): LocationVolunteerInformation | undefined {
  const volunteer = raw.importantInformation?.volunteer;
  const title = text(volunteer?.title);
  const description = text(volunteer?.description);
  const label = text(volunteer?.action?.label);
  const href = text(volunteer?.action?.href);
  if (!title || !description || !label || !href) return undefined;

  return {
    title,
    description,
    benefits: compact((volunteer?.benefits ?? []).map((benefit) => text(benefit))),
    action: { label, href },
  };
}

function adaptDetail(
  raw: RawLocationDetail,
): LocationDetailPageContent | undefined {
  const summary = adaptSummary(raw);
  if (!summary) return undefined;

  const volunteer = adaptVolunteer(raw);

  return {
    id: summary.id,
    slug: summary.slug,
    city: summary.city,
    venueName: text(raw.venueName) ?? "",
    dates: summary.dates,
    introduction: text(raw.introduction) ?? "",
    seo: {
      title: text(raw.seo?.title) ?? summary.city,
      description:
        text(raw.seo?.description) ??
        `SwingRush event details for ${summary.city}.`,
    },
    hero: {
      ariaLabel:
        text(raw.hero?.ariaLabel) ?? `SwingRush ${summary.city} arena preview`,
      webmSrc: text(raw.hero?.webmSrc) ?? DEFAULT_HERO_MEDIA.webmSrc,
      mp4Src: text(raw.hero?.mp4Src) ?? DEFAULT_HERO_MEDIA.mp4Src,
      posterSrc: text(raw.hero?.posterSrc) ?? DEFAULT_HERO_MEDIA.posterSrc,
    },
    primaryAction: {
      label: text(raw.primaryAction?.label) ?? summary.cta.label,
      href: text(raw.primaryAction?.href) ?? `#${TICKET_INFO_ANCHOR}`,
    },
    features: adaptFeatures(raw),
    schedule: {
      title: text(raw.schedule?.title) ?? "Schedule",
      days: adaptScheduleDays(raw),
    },
    ticketInfo: {
      id: TICKET_INFO_ANCHOR,
      title: text(raw.ticketInfo?.title) ?? "Ticket Info",
      releases: adaptReleases(raw),
    },
    importantInformation: {
      title: text(raw.importantInformation?.title) ?? "Important Information",
      blocks: adaptInformationBlocks(raw),
      ...(volunteer ? { volunteer } : {}),
    },
  };
}

export async function getLocationsPage(
  options: CmsReadOptions = {},
): Promise<LocationsPageDocument> {
  const raw = await cmsFetch<RawLocationsPage>({
    query: LOCATIONS_PAGE_QUERY,
    clean: options.clean,
  });

  const fallback = LOCATIONS_PAGE_CONTENT;
  if (!raw) {
    return { seo: LOCATIONS_PAGE_SEO, content: fallback };
  }

  const locations = compact((raw.locations ?? []).map(adaptSummary));

  return {
    seo: {
      title: text(raw.page?.seo?.title) ?? LOCATIONS_PAGE_SEO.title,
      description:
        text(raw.page?.seo?.description) ?? LOCATIONS_PAGE_SEO.description,
    },
    content: {
      title: text(raw.page?.title) ?? fallback.title,
      introduction: text(raw.page?.introduction) ?? fallback.introduction,
      emptyState: text(raw.page?.emptyState) ?? fallback.emptyState,
      locations: locations.length > 0 ? locations : fallback.locations,
    },
  };
}

export async function getLocationSlugs(): Promise<string[]> {
  const raw = await cmsFetch<{ slug?: string | null }[]>({
    query: LOCATION_SLUGS_QUERY,
    clean: true,
  });

  const slugs = compact((raw ?? []).map((entry) => text(entry.slug)));

  return slugs.length > 0
    ? slugs
    : LOCATIONS_PAGE_CONTENT.locations.map(({ slug }) => slug);
}

export interface LocationSitemapEntry {
  slug: string;
  updatedAt?: string;
}

export async function getLocationSitemapEntries(): Promise<
  LocationSitemapEntry[]
> {
  const raw = await cmsFetch<{ slug?: string | null; _updatedAt?: string }[]>({
    query: LOCATION_SITEMAP_QUERY,
    clean: true,
  });

  const entries = compact(
    (raw ?? []).map((entry) => {
      const slug = text(entry.slug);
      return slug ? { slug, updatedAt: entry._updatedAt } : undefined;
    }),
  );

  return entries.length > 0
    ? entries
    : LOCATIONS_PAGE_CONTENT.locations.map(({ slug }) => ({ slug }));
}

export type LocationRoute =
  | { status: "complete"; detail: LocationDetailPageContent }
  | { status: "comingSoon"; summary: LocationListItem };

function mockLocationRoute(slug: string): LocationRoute | null {
  const detail = getLocationDetailMock(slug);
  if (detail) return { status: "complete", detail };

  const summary = LOCATIONS_PAGE_CONTENT.locations.find(
    (location) => location.slug === slug,
  );

  return summary ? { status: "comingSoon", summary } : null;
}

export async function getLocationRoute(
  slug: string,
  options: CmsReadOptions = {},
): Promise<LocationRoute | null> {
  const raw = await cmsFetch<RawLocationDetail>({
    query: LOCATION_BY_SLUG_QUERY,
    params: { slug },
    clean: options.clean,
  });

  if (!raw) return mockLocationRoute(slug);

  const summary = adaptSummary(raw);
  if (!summary) return null;

  if (raw.detailStatus !== "complete") {
    return { status: "comingSoon", summary };
  }

  const detail = adaptDetail(raw);
  if (!detail) return { status: "comingSoon", summary };

  const mock = getLocationDetailMock(summary.slug);
  if (
    mock &&
    (!detail.hero.webmSrc || !detail.hero.mp4Src || !detail.hero.posterSrc)
  ) {
    return {
      status: "complete",
      detail: {
        ...detail,
        hero: {
          ...detail.hero,
          webmSrc: detail.hero.webmSrc || mock.hero.webmSrc,
          mp4Src: detail.hero.mp4Src || mock.hero.mp4Src,
          posterSrc: detail.hero.posterSrc || mock.hero.posterSrc,
        },
      },
    };
  }

  return { status: "complete", detail };
}
