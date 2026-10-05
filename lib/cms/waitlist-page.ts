import {
  WAITLIST_PAGE_CONTENT,
  WAITLIST_PAGE_SEO,
} from "@/data/waitlist";
import { cmsFetch, type CmsReadOptions } from "@/lib/cms/fetch";
import { text } from "@/lib/cms/utils";
import { WAITLIST_PAGE_QUERY } from "@/sanity/lib/queries";
import type { SeoContent } from "@/types/seo";
import type { WaitlistPageContent } from "@/types/waitlist";

interface RawWaitlistPage {
  title?: string | null;
  introduction?: string | null;
  seo?: { title?: string | null; description?: string | null } | null;
}

export interface WaitlistPageDocument {
  seo: SeoContent;
  content: WaitlistPageContent;
}

function adaptWaitlistPage(raw: RawWaitlistPage | null): WaitlistPageDocument {
  const fallbackContent = WAITLIST_PAGE_CONTENT;

  if (!raw) {
    return {
      seo: WAITLIST_PAGE_SEO,
      content: fallbackContent,
    };
  }

  return {
    seo: {
      title: text(raw.seo?.title) ?? WAITLIST_PAGE_SEO.title,
      description:
        text(raw.seo?.description) ?? WAITLIST_PAGE_SEO.description,
    },
    content: {
      ...fallbackContent,
      title: text(raw.title) ?? fallbackContent.title,
      introduction: text(raw.introduction) ?? fallbackContent.introduction,
    },
  };
}

export async function getWaitlistPage(
  options: CmsReadOptions = {},
): Promise<WaitlistPageDocument> {
  const raw = await cmsFetch<RawWaitlistPage>({
    query: WAITLIST_PAGE_QUERY,
    clean: options.clean,
  });

  return adaptWaitlistPage(raw);
}
