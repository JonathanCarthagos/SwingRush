import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocationHeroNavFlag } from "@/components/cms/location-hero-nav-flag";
import { Footer } from "@/components/sections/footer";
import {
  LocationComingSoon,
  LocationDetailPage,
} from "@/components/sections/location-detail-page";
import { getLocationRoute, getLocationSlugs } from "@/lib/cms/locations";

interface LocationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getLocationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = await getLocationRoute(slug, { clean: true });

  if (!route) {
    return { title: "Location Not Found" };
  }

  if (route.status === "complete") {
    return {
      title: route.detail.seo.title,
      description: route.detail.seo.description,
    };
  }

  return {
    title: route.summary.city,
    description: `SwingRush event details for ${route.summary.city} are coming soon.`,
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const route = await getLocationRoute(slug);

  if (!route) {
    notFound();
  }

  if (route.status === "complete") {
    return (
      <>
        <LocationHeroNavFlag />
        <LocationDetailPage content={route.detail} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <LocationComingSoon location={route.summary} />
      <Footer />
    </>
  );
}
