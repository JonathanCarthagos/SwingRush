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
  body?: string | null;
  media?: string | null;
  image?: RawImage | null;
}

interface RawHomePage {
  seo?: { title?: string | null; description?: string | null } | null;
  hero?: {
    heading?: string | null;
    posterSrc?: string | null;
    webmSrc?: string | null;
    mp4Src?: string | null;
  } | null;
  arena?: { heading?: string | null; description?: string | null } | null;
  stories?: RawStory[] | null;
  cta?: {
    heading?: string | null;
    description?: string | null;
    action?: { label?: string | null; href?: string | null } | null;
  } | null;
}

function adaptStories(stories: RawStory[] | null | undefined): HomeStory[] {
  if (!stories?.length) return [];

  const fallbackById = new Map<string, (typeof HOME_PAGE_CONTENT.stories)[number]>(
    HOME_PAGE_CONTENT.stories.map((story) => [story.id, story]),
  );

  return stories.flatMap((story) => {
    const title = text(story.title);
    const subtitle = text(story.subtitle);
    const body = text(story.body);
    if (!title || !subtitle || !body) return [];

    const media = story.media === "scoreboard" ? "scoreboard" : "image";
    const src = text(story.image?.src);
    const fallback = fallbackById.get(story._key);

    if (media === "image" && !src) {
      if (fallback?.media === "image" && fallback.image) {
        return [
          {
            id: story._key,
            title,
            subtitle,
            body,
            media: "image",
            image: fallback.image,
          },
        ];
      }
      return [];
    }

    return [
      {
        id: story._key,
        title,
        subtitle,
        body,
        media,
        ...(media === "image" && src
          ? { image: { src, alt: text(story.image?.alt) ?? "" } }
          : {}),
      },
    ];
  });
}

function adaptHomePage(raw: RawHomePage | null): HomePageContent {
  const fallback = HOME_PAGE_CONTENT;
  if (!raw) return fallback;

  const stories = adaptStories(raw.stories);

  return {
    seo: {
      title: text(raw.seo?.title) ?? fallback.seo.title,
      description: text(raw.seo?.description) ?? fallback.seo.description,
    },
    hero: {
      heading: text(raw.hero?.heading) ?? fallback.hero.heading,
      webmSrc: text(raw.hero?.webmSrc) ?? fallback.hero.webmSrc,
      mp4Src: text(raw.hero?.mp4Src) ?? fallback.hero.mp4Src,
      posterSrc: text(raw.hero?.posterSrc) ?? fallback.hero.posterSrc,
    },
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
