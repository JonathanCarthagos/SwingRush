import { getLocationDetailMock } from "@/data/location-details";
import {
  DEFAULT_LOCATION_INTRODUCTION,
  LOCATIONS_PAGE_CONTENT,
  LOCATIONS_PAGE_SEO,
} from "@/data/locations";
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
  LocationHeroMedia,
  LocationWaitlistContent,
  LocationInformationBlock,
  LocationScheduleDay,
  LocationTicketRelease,
  LocationVolunteerInformation,
} from "@/types/location-detail";
import type {
  LocationDateRange,
  LocationListItem,
  LocationsPageDocument,
  LocationStatus,
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
  registrationStatus?: string | null;
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

interface RawHeroMedia {
  ariaLabel?: string | null;
  posterSrc?: string | null;
  webmSrc?: string | null;
  mp4Src?: string | null;
  mobilePosterSrc?: string | null;
  mobileWebmSrc?: string | null;
  mobileMp4Src?: string | null;
}

interface RawLocationDetail extends RawLocationSummary {
  detailStatus?: string | null;
  venueName?: string | null;
  introduction?: string | null;
  seo?: { title?: string | null; description?: string | null } | null;
  hero?: RawHeroMedia | null;
  shared?: {
    locationHero?: RawHeroMedia | null;
    defaultIntroduction?: string | null;
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

function adaptStatus(value: string | null | undefined): LocationStatus {
  return value === "register" || value === "soldOut" ? value : "waitlist";
}

function adaptSummary(
  raw: RawLocationSummary,
): LocationListItem | undefined {
  const city = text(raw.city);
  const slug = text(raw.slug);
  const dates = adaptDates(raw.dates);
  if (!city || !slug || !dates) return undefined;

  const status = adaptStatus(raw.registrationStatus);

  return {
    id: slug,
    city,
    slug,
    dates,
    status,
    cta: {
      label:
        status === "register" ? "Register" : (text(raw.ctaLabel) ?? "Join Waitlist"),
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

// A city's own video wins only when both sources are set; a half-uploaded override falls back as a whole
// so the WebM and MP4 never come from different clips. The phone hero is a wide frame, so without a
// dedicated mobile pair it keeps the landscape clip instead of cropping the portrait Home clip.
function resolveHero(raw: RawLocationDetail, city: string): LocationHeroMedia {
  const own = raw.hero;
  const shared = raw.shared?.locationHero;
  const hasSources = (media: RawHeroMedia | null | undefined) =>
    Boolean(text(media?.webmSrc) && text(media?.mp4Src));
  const source = hasSources(own) ? own : hasSources(shared) ? shared : undefined;

  const webmSrc = text(source?.webmSrc) ?? DEFAULT_HERO_MEDIA.webmSrc;
  const mp4Src = text(source?.mp4Src) ?? DEFAULT_HERO_MEDIA.mp4Src;
  const posterSrc =
    text(source?.posterSrc) ??
    text(own?.posterSrc) ??
    text(shared?.posterSrc) ??
    DEFAULT_HERO_MEDIA.posterSrc;
  const mobileWebm = text(source?.mobileWebmSrc);
  const mobileMp4 = text(source?.mobileMp4Src);
  const mobile =
    mobileWebm && mobileMp4
      ? {
          webmSrc: mobileWebm,
          mp4Src: mobileMp4,
          posterSrc: text(source?.mobilePosterSrc) ?? posterSrc,
        }
      : { webmSrc, mp4Src, posterSrc };

  return {
    ariaLabel:
      text(own?.ariaLabel) ??
      text(source?.ariaLabel) ??
      `SwingRush ${city} arena preview`,
    webmSrc,
    mp4Src,
    posterSrc,
    mobileWebmSrc: mobile.webmSrc,
    mobileMp4Src: mobile.mp4Src,
    mobilePosterSrc: mobile.posterSrc,
  };
}

function adaptIntroduction(raw: RawLocationDetail) {
  return (
    text(raw.introduction) ??
    text(raw.shared?.defaultIntroduction) ??
    DEFAULT_LOCATION_INTRODUCTION
  );
}

function adaptWaitlist(
  raw: RawLocationDetail,
  summary: LocationListItem,
): LocationWaitlistContent {
  const venueName = text(raw.venueName);

  return {
    slug: summary.slug,
    city: summary.city,
    ...(venueName ? { venueName } : {}),
    dates: summary.dates,
    introduction: adaptIntroduction(raw),
    seo: {
      title: text(raw.seo?.title) ?? summary.city,
      description:
        text(raw.seo?.description) ??
        `Join the SwingRush ${summary.city} waitlist to hear first when tickets go on sale.`,
    },
    hero: resolveHero(raw, summary.city),
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
    introduction: adaptIntroduction(raw),
    seo: {
      title: text(raw.seo?.title) ?? summary.city,
      description:
        text(raw.seo?.description) ??
        `SwingRush event details for ${summary.city}.`,
    },
    hero: resolveHero(raw, summary.city),
    primaryAction: {
      // "Register" always follows the status, so a stale CMS label can't contradict it.
      label:
        summary.status === "register"
          ? summary.cta.label
          : (text(raw.primaryAction?.label) ?? summary.cta.label),
      href: text(raw.primaryAction?.href) ?? `#${TICKET_INFO_ANCHOR}`,
    },
    status: summary.status,
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
  | { status: "sales"; detail: LocationDetailPageContent }
  | { status: "waitlist"; waitlist: LocationWaitlistContent };

function mockLocationRoute(slug: string): LocationRoute | null {
  const detail = getLocationDetailMock(slug);
  if (detail?.status === "register") return { status: "sales", detail };

  const summary = LOCATIONS_PAGE_CONTENT.locations.find(
    (location) => location.slug === slug,
  );
  if (!summary) return null;

  return {
    status: "waitlist",
    waitlist: adaptWaitlist(
      {
        _id: summary.slug,
        venueName: detail?.venueName,
        introduction: detail?.introduction,
      },
      summary,
    ),
  };
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

  // The full sales page only opens once tickets are on sale; every other city collects waitlist signups.
  const detail =
    summary.status === "register" && raw.detailStatus === "complete"
      ? adaptDetail(raw)
      : undefined;

  return detail
    ? { status: "sales", detail }
    : { status: "waitlist", waitlist: adaptWaitlist(raw, summary) };
}
