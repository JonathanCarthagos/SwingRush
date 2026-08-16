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
}

export async function cmsFetch<T>({
  query,
  params,
  clean = false,
}: CmsFetchOptions): Promise<T | null> {
  if (!isSanityConfigured) return null;

  const { data } = clean
    ? await sanityFetch({
        query,
        params,
        perspective: "published",
        stega: false,
      })
    : await sanityFetch({ query, params });

  return (data ?? null) as T | null;
}
