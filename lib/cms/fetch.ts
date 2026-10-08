import { draftMode } from "next/headers";
import type { QueryParams } from "next-sanity";

import { isSanityConfigured } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/live";

export interface CmsReadOptions {
  /**
   * Published-only and stega-free. Required in `generateMetadata`,
   * `generateStaticParams` and the sitemap so preview data never leaks into SEO.
   */
  clean?: boolean;
}

interface CmsFetchOptions extends CmsReadOptions {
  query: string;
  params?: QueryParams;
  /**
   * Page renders fall back to `null` so a read failure cannot turn the response into a 503.
   * Callers that need the original error, such as the waitlist action, pass `"throw"`.
   */
  onError?: "fallback" | "throw";
}

export async function cmsFetch<T>({
  query,
  params,
  clean,
  onError = "fallback",
}: CmsFetchOptions): Promise<T | null> {
  if (!isSanityConfigured) return null;

  try {
    const resolvedClean = clean ?? !(await draftMode()).isEnabled;

    const { data } = resolvedClean
      ? await sanityFetch({
          query,
          params,
          perspective: "published",
          stega: false,
        })
      : await sanityFetch({ query, params });

    return (data ?? null) as T | null;
  } catch (error) {
    if (onError === "throw") throw error;
    console.error({
      source: "cmsFetch",
      stage: "read",
      message: error instanceof Error ? error.message : "Read failed",
    });
    return null;
  }
}
