import { HOW_IT_WORKS_PAGE_CONTENT } from "@/data/how-it-works";
import { cmsFetch, type CmsReadOptions } from "@/lib/cms/fetch";
import { text, toId } from "@/lib/cms/utils";
import { HOW_IT_WORKS_PAGE_QUERY } from "@/sanity/lib/queries";
import type {
  HowItWorksItem,
  HowItWorksItemImage,
  HowItWorksPageContent,
} from "@/types/how-it-works";

interface RawSection {
  _key: string;
  heading?: string | null;
  body?: string | null;
}

interface RawItem {
  _key: string;
  title?: string | null;
  slug?: string | null;
  content?: string | null;
  sections?: RawSection[] | null;
  link?: { label?: string | null; href?: string | null } | null;
  image?: { src?: string | null; alt?: string | null } | null;
}

// Anchors used by the original CMS items, pointed at the fallback item whose photo they share.
const LEGACY_ITEM_IDS: Record<string, string> = {
  challenges: "skills-challenges",
  "tee-times": "race-format",
  scoring: "race-format",
  divisions: "skills-divisions",
  categories: "teams",
};

const LOCAL_ITEM_IMAGES = new Map<string, HowItWorksItemImage>(
  HOW_IT_WORKS_PAGE_CONTENT.items.flatMap((item) =>
    item.image ? [[item.id, item.image] as const] : [],
  ),
);

const DEFAULT_ITEM_IMAGE: HowItWorksItemImage = {
  src: "/images/how-it-works-arena.jpg",
  alt: "Golfers competing inside the Swingrush arena",
};

function adaptImage(
  image: RawItem["image"],
  id: string,
  title: string,
): HowItWorksItemImage {
  const src = text(image?.src);
  if (src) return { src, alt: text(image?.alt) ?? title };

  return (
    LOCAL_ITEM_IMAGES.get(id) ??
    LOCAL_ITEM_IMAGES.get(LEGACY_ITEM_IDS[id] ?? "") ??
    DEFAULT_ITEM_IMAGE
  );
}

interface RawHowItWorksPage {
  seo?: { title?: string | null; description?: string | null } | null;
  hero?: {
    heading?: string | null;
    posterSrc?: string | null;
    webmSrc?: string | null;
    mp4Src?: string | null;
  } | null;
  arena?: { heading?: string | null; description?: string | null } | null;
  introduction?: string | null;
  items?: RawItem[] | null;
}

function adaptItems(items: RawItem[] | null | undefined): HowItWorksItem[] {
  if (!items?.length) return [];

  return items.flatMap((item) => {
    const title = text(item.title);
    const content = text(item.content);
    if (!title || !content) return [];

    const sections = (item.sections ?? []).flatMap((section) => {
      const heading = text(section.heading);
      const body = text(section.body);
      return heading && body ? [{ heading, body }] : [];
    });

    const id = text(item.slug) ?? toId(title, item._key);
    const linkLabel = text(item.link?.label);
    const linkHref = text(item.link?.href);

    return [
      {
        id,
        title,
        content,
        ...(sections.length > 0 ? { sections } : {}),
        image: adaptImage(item.image, id, title),
        ...(linkLabel && linkHref
          ? { link: { label: linkLabel, href: linkHref } }
          : {}),
      },
    ];
  });
}

function adaptHowItWorksPage(
  raw: RawHowItWorksPage | null,
): HowItWorksPageContent {
  const fallback = HOW_IT_WORKS_PAGE_CONTENT;
  if (!raw) return fallback;

  const items = adaptItems(raw.items);

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
      arenaHeading: text(raw.arena?.heading) ?? fallback.hero.arenaHeading,
      arenaDescription:
        text(raw.arena?.description) ?? fallback.hero.arenaDescription,
    },
    introduction: text(raw.introduction) ?? fallback.introduction,
    items: items.length > 0 ? items : fallback.items,
  };
}

export async function getHowItWorksPage(
  options: CmsReadOptions = {},
): Promise<HowItWorksPageContent> {
  const raw = await cmsFetch<RawHowItWorksPage>({
    query: HOW_IT_WORKS_PAGE_QUERY,
    clean: options.clean,
  });

  return adaptHowItWorksPage(raw);
}
