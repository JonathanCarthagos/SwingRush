import type { Metadata } from "next";

import { Footer } from "@/components/sections/footer";
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
    },
  };
}

export default async function LocationsPage() {
  const { content } = await getLocationsPage();

  return (
    <>
      <main className="flex-1 overflow-x-hidden bg-black">
        <LocationsPageSection pageContent={content} />
      </main>
      <Footer />
    </>
  );
}
