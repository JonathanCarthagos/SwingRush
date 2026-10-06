import { HOME_PAGE_CONTENT } from "@/data/home";
import { cmsFetch, type CmsReadOptions } from "@/lib/cms/fetch";
import { text } from "@/lib/cms/utils";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import type { HomePageContent, HomeStory } from "@/types/home";

interface RawImage {
  src?: string | null;
  alt?: string | null;
}

interface RawStory {
  _key: string;
  title?: string | null;
  subtitle?: string | null;
  link?: { label?: string | null; href?: string | null } | null;
  image?: RawImage | null;
}

interface RawHomePage {
  title?: string | null;
  seo?: { title?: string | null; description?: string | null } | null;
  hero?: {
    heading?: string | null;
    posterSrc?: string | null;
    webmSrc?: string | null;
    mp4Src?: string | null;
  } | null;
  clubs?: RawStory[] | null;
  arena?: { heading?: string | null; description?: string | null } | null;
  stories?: RawStory[] | null;
  cta?: {
    heading?: string | null;
    description?: string | null;
    action?: { label?: string | null; href?: string | null } | null;
  } | null;
}

const CLUB_CHALLENGE_HREFS: Record<string, string> = {
  driver: "/challenges#1",
  iron: "/challenges#2",
  wedge: "/challenges#6",
  putter: "/challenges#10",
};

const HOME_STORY_HREFS: Record<string, string> = {
  "timed race": "/how-it-works",
  "singles or teams": "/how-it-works",
};

function adaptStories(
  stories: RawStory[] | null | undefined,
  titleHrefOverrides: Record<string, string> = {},
): HomeStory[] {
  if (!stories?.length) return [];

  return stories.flatMap((story) => {
    const title = text(story.title);
    const subtitle = text(story.subtitle);
    const cmsHref = text(story.link?.href);
    const href = title
      ? (titleHrefOverrides[title.trim().toLowerCase()] ?? cmsHref)
      : cmsHref;
    const src = text(story.image?.src);
    if (!title || !subtitle || !href || !src) return [];

    return [
      {
        id: story._key,
        title,
        subtitle,
        linkLabel: text(story.link?.label) ?? "Learn More",
        href,
        image: { src, alt: text(story.image?.alt) ?? "" },
      },
    ];
  });
}

function adaptHomePage(raw: RawHomePage | null): HomePageContent {
  const fallback = HOME_PAGE_CONTENT;
  if (!raw) return fallback;

  const clubs = adaptStories(raw.clubs, CLUB_CHALLENGE_HREFS);
  const stories = adaptStories(raw.stories, HOME_STORY_HREFS);

  return {
    seo: {
      title: text(raw.seo?.title) ?? fallback.seo.title,
      description: text(raw.seo?.description) ?? fallback.seo.description,
    },
    hero: {
      heading:
        text(raw.title) ?? text(raw.hero?.heading) ?? fallback.hero.heading,
      webmSrc: text(raw.hero?.webmSrc) ?? fallback.hero.webmSrc,
      mp4Src: text(raw.hero?.mp4Src) ?? fallback.hero.mp4Src,
      posterSrc: text(raw.hero?.posterSrc) ?? fallback.hero.posterSrc,
      mobileWebmSrc: fallback.hero.mobileWebmSrc,
      mobileMp4Src: fallback.hero.mobileMp4Src,
      mobilePosterSrc: fallback.hero.mobilePosterSrc,
    },
    clubs: clubs.length > 0 ? clubs : fallback.clubs,
    arena: {
      heading: text(raw.arena?.heading) ?? fallback.arena.heading,
      description: text(raw.arena?.description) ?? fallback.arena.description,
    },
    stories: stories.length > 0 ? stories : fallback.stories,
    cta: {
      heading: text(raw.cta?.heading) ?? fallback.cta.heading,
      description: text(raw.cta?.description) ?? fallback.cta.description,
      ctaLabel: text(raw.cta?.action?.label) ?? fallback.cta.ctaLabel,
      ctaHref: text(raw.cta?.action?.href),
    },
  };
}

export async function getHomePage(
  options: CmsReadOptions = {},
): Promise<HomePageContent> {
  const raw = await cmsFetch<RawHomePage>({
    query: HOME_PAGE_QUERY,
    clean: options.clean,
  });

  return adaptHomePage(raw);
}
