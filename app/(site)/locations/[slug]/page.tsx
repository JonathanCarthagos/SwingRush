import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocationDetailPage } from "@/components/sections/location-detail-page";
import { LocationWaitlistPage } from "@/components/sections/location-waitlist-page";
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

  const { seo } = route.status === "sales" ? route.detail : route.waitlist;
  return { title: seo.title, description: seo.description };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const route = await getLocationRoute(slug);

  if (!route) {
    notFound();
  }

  if (route.status === "sales") {
    return <LocationDetailPage content={route.detail} />;
  }

  return <LocationWaitlistPage content={route.waitlist} />;
}
