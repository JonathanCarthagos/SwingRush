import type { Metadata } from "next";

const OPEN_GRAPH_IMAGE = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
} as const;

export interface PageMetadataInput {
  title: string;
  description: string;
  canonical: string;
  keywords?: Metadata["keywords"];
  /** Home sets a full Twitter card. Other routes inherit the root card only. */
  twitter?: boolean;
  robots?: Metadata["robots"];
}

/** Shared title, canonical, and Open Graph block. Does not invent fields a route did not already set. */
export function buildPageMetadata({
  title,
  description,
  canonical,
  keywords,
  twitter = false,
  robots,
}: PageMetadataInput): Metadata {
  const metadata: Metadata = {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: [OPEN_GRAPH_IMAGE],
    },
  };

  if (keywords) metadata.keywords = keywords;
  if (twitter) {
    metadata.twitter = {
      card: "summary_large_image",
      title,
      description,
      images: ["/twitter-image.jpg"],
    };
  }
  if (robots) metadata.robots = robots;

  return metadata;
}
