import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CITY_PAGE_QUERY, CITY_PAGE_SLUGS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { isSanityConfigured } from "@/sanity/env";
import type { CityPage } from "@/types";

interface CityPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  if (!isSanityConfigured) {
    return [];
  }

  const { data } = await sanityFetch({
    query: CITY_PAGE_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  });

  const slugs = (data ?? []) as Array<{ slug: string }>;

  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isSanityConfigured) {
    return {
      title: "City | SwingRush",
    };
  }

  const { data } = await sanityFetch({
    query: CITY_PAGE_QUERY,
    params: { slug },
    stega: false,
  });

  const city = data as CityPage | null;

  if (!city) {
    return {
      title: "City Not Found | SwingRush",
    };
  }

  return {
    title: `${city.title} | SwingRush`,
    description: city.heroDescription ?? `SwingRush events in ${city.title}.`,
  };
}

export default async function CityPageRoute({ params }: CityPageProps) {
  const { slug } = await params;

  if (!isSanityConfigured) {
    notFound();
  }

  const { data } = await sanityFetch({
    query: CITY_PAGE_QUERY,
    params: { slug },
  });

  const city = data as CityPage | null;

  if (!city) {
    notFound();
  }

  return (
    <main className="flex-1 px-gutter-x pb-gutter-y pt-nav-offset">
      <div className="mx-auto w-full max-w-6xl py-gutter-y">
        <p className="text-sm uppercase tracking-wide text-foreground/60">
          City Page
        </p>
        <h1 className="mt-2 font-display text-h1">
          {city.heroHeadline ?? city.title}
        </h1>
        {city.heroDescription ? (
          <p className="mt-4 max-w-2xl text-base text-foreground/70 md:text-lg">
            {city.heroDescription}
          </p>
        ) : null}
      </div>
    </main>
  );
}
