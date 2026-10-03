import type { Metadata } from "next";

import { CmsLive } from "@/components/cms/cms-live";
import { Cta } from "@/components/sections/cta";
import { HowItWorksDetailsSection } from "@/components/sections/how-it-works-details-section";
import { HowItWorksArenaCard } from "@/components/sections/how-it-works-arena-card";
import { PageHero } from "@/components/sections/page-hero";
import { getHowItWorksPage } from "@/lib/cms/how-it-works";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHowItWorksPage({ clean: true });

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: {
      canonical: "/how-it-works",
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: "/how-it-works",
      type: "website",
    },
  };
}

export default async function HowItWorksPage() {
  const { hero, items } = await getHowItWorksPage();

  return (
    <>
      <main className="min-h-dvh flex-1 overflow-x-hidden bg-black">
        <PageHero
          title={hero.heading}
          tone="deep"
          image={{
            mobile: "/images/how-it-works/hero-mobile.jpg",
            desktop: "/images/how-it-works/hero-desktop.jpg",
          }}
        />
        <HowItWorksArenaCard
          heading={hero.arenaHeading}
          description={hero.arenaDescription}
        />
        <Cta
          id="how-it-works-arena"
          variant="inverted"
          heading={hero.arenaHeading}
          description={hero.arenaDescription}
          ctaLabel="Sign Up"
          className="hidden min-[1280px]:flex min-[1280px]:[&_h2]:whitespace-nowrap"
        />
        <HowItWorksDetailsSection items={items} />
      </main>
      <CmsLive />
    </>
  );
}
