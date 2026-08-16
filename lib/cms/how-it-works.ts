import { HOW_IT_WORKS_PAGE_CONTENT } from "@/data/how-it-works";
import { cmsFetch, type CmsReadOptions } from "@/lib/cms/fetch";
import { text, toId } from "@/lib/cms/utils";
import { HOW_IT_WORKS_PAGE_QUERY } from "@/sanity/lib/queries";
import type {
  AccordionItem,
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

function adaptItems(items: RawItem[] | null | undefined): AccordionItem[] {
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

    return [
      {
        id: text(item.slug) ?? toId(title, item._key),
        title,
        content,
        ...(sections.length > 0 ? { sections } : {}),
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
