import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { LocationsPageSection } from "@/components/sections/locations-page-section";
import { getLocationsPage } from "@/lib/cms/locations";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getLocationsPage({ clean: true });

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: {
      canonical: "/locations",
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: "/locations",
      type: "website",
      images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function LocationsPage() {
  const { content } = await getLocationsPage();

  return (
    <>
      <main className="flex-1 overflow-x-hidden bg-black min-[1280px]:overflow-x-clip">
        <PageHero
          title={content.title}
          image={{
            mobile: "/images/locations/hero-mobile.jpg",
            desktop: "/images/locations/hero-desktop.jpg",
          }}
        />
        <LocationsPageSection pageContent={content} />
      </main>
    </>
  );
}
