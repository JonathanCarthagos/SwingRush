import type { MetadataRoute } from "next";

import { getLocationSitemapEntries } from "@/lib/cms/locations";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locations = await getLocationSitemapEntries();

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/how-it-works`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/challenges`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/locations`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...locations.map((location) => ({
      url: `${SITE_URL}/locations/${location.slug}`,
      lastModified: location.updatedAt
        ? new Date(location.updatedAt)
        : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
