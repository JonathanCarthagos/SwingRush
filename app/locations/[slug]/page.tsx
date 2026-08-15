import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/sections/footer";
import {
  LocationComingSoon,
  LocationDetailPage,
} from "@/components/sections/location-detail-page";
import { getLocationDetailMock } from "@/data/location-details";
import { LOCATIONS_PAGE_CONTENT } from "@/data/locations";

interface LocationPageProps {
  params: Promise<{ slug: string }>;
}

function getLocationSummary(slug: string) {
  return LOCATIONS_PAGE_CONTENT.locations.find(
    (location) => location.slug === slug,
  );
}

export function generateStaticParams() {
  return LOCATIONS_PAGE_CONTENT.locations.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = getLocationDetailMock(slug);

  if (detail) {
    return {
      title: detail.seo.title,
      description: detail.seo.description,
    };
  }

  const location = getLocationSummary(slug);

  if (!location) {
    return { title: "Location Not Found" };
  }

  return {
    title: location.city,
    description: `SwingRush event details for ${location.city} are coming soon.`,
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const detail = getLocationDetailMock(slug);

  if (detail) {
    return (
      <>
        <LocationDetailPage content={detail} />
        <Footer />
      </>
    );
  }

  const location = getLocationSummary(slug);

  if (!location) {
    notFound();
  }

  return (
    <>
      <LocationComingSoon location={location} />
      <Footer />
    </>
  );
}
