import { stegaClean } from "@sanity/client/stega";
import type { PortableTextBlock } from "@portabletext/types";

import { PRIVACY_POLICY_CONTENT, TERMS_CONTENT } from "@/data/legal";
import { cmsFetch, type CmsReadOptions } from "@/lib/cms/fetch";
import { isoDate, text } from "@/lib/cms/utils";
import { PRIVACY_POLICY_QUERY, TERMS_OF_USE_QUERY } from "@/sanity/lib/queries";
import type { SeoContent } from "@/types/seo";
import type { LegalPageContent } from "@/types/legal";

interface RawLegalPage {
  title?: string | null;
  lastPublished?: string | null;
  body?: PortableTextBlock[] | null;
  seo?: { title?: string | null; description?: string | null } | null;
}

export interface LegalPageDocument {
  seo: SeoContent;
  content: LegalPageContent;
}

const LAST_PUBLISHED_LABEL = "Last Published";

function formatPublishedDate(iso: `${number}-${number}-${number}`) {
  const [year, month, day] = iso.split("-").map(Number);
  const display = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));

  return { label: LAST_PUBLISHED_LABEL, isoDate: iso, display };
}

function adaptLegalPage(
  raw: RawLegalPage | null,
  fallback: LegalPageContent & { seo: SeoContent },
): LegalPageDocument {
  if (!raw) {
    return { seo: fallback.seo, content: fallback };
  }

  const published = isoDate(stegaClean(raw.lastPublished ?? ""));
  const body = raw.body?.length ? raw.body : null;

  return {
    seo: {
      title: text(raw.seo?.title) ?? fallback.seo.title,
      description: text(raw.seo?.description) ?? fallback.seo.description,
    },
    content: {
      title: text(raw.title) ?? fallback.title,
      lastPublished: published
        ? formatPublishedDate(published)
        : fallback.lastPublished,
      sections: fallback.sections,
      body,
    },
  };
}

export async function getPrivacyPolicy(
  options: CmsReadOptions = {},
): Promise<LegalPageDocument> {
  const raw = await cmsFetch<RawLegalPage>({
    query: PRIVACY_POLICY_QUERY,
    clean: options.clean,
  });

  return adaptLegalPage(raw, PRIVACY_POLICY_CONTENT);
}

export async function getTermsOfUse(
  options: CmsReadOptions = {},
): Promise<LegalPageDocument> {
  const raw = await cmsFetch<RawLegalPage>({
    query: TERMS_OF_USE_QUERY,
    clean: options.clean,
  });

  return adaptLegalPage(raw, TERMS_CONTENT);
}
