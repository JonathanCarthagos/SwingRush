import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { LocationDetailPage } from "@/components/sections/location-detail-page";
import { LocationWaitlistPage } from "@/components/sections/location-waitlist-page";
import { getLocationRoute, getLocationSlugs } from "@/lib/cms/locations";
import { LOCATION_ROUTE_MAIN_CLASS } from "@/lib/layout/hero-shell";
import { locationEventStructuredData } from "@/lib/seo/location-event";
import { buildPageMetadata } from "@/lib/seo/build-page-metadata";

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

  const { seo } = route.status === "sales" ? route.detail : route.waitlist;
  const canonical = `/locations/${slug}`;

  return buildPageMetadata({
    title: seo.title.includes("SwingRush") ? seo.title : `${seo.title} | SwingRush`,
    description: seo.description,
    canonical,
    twitter: true,
  });
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const route = await getLocationRoute(slug);

  if (!route) {
    notFound();
  }

  return (
    <main id="main" className={LOCATION_ROUTE_MAIN_CLASS}>
      {route.status === "sales" ? (
        <>
          <JsonLd data={locationEventStructuredData(route.detail)} />
          <LocationDetailPage content={route.detail} />
        </>
      ) : (
        <LocationWaitlistPage content={route.waitlist} />
      )}
    </main>
  );
}
