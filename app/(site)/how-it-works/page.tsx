import type { Metadata } from "next";

import { CmsLive } from "@/components/cms/cms-live";
import { Cta } from "@/components/sections/cta";
import { HowItWorksDetailsSection } from "@/components/sections/how-it-works-details-section";
import { PageHero } from "@/components/sections/page-hero";
import { getHowItWorksPage } from "@/lib/cms/how-it-works";
import { buildPageMetadata } from "@/lib/seo/build-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHowItWorksPage({ clean: true });

  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    canonical: "/how-it-works",
    twitter: true,
  });
}

export default async function HowItWorksPage() {
  const { hero, items } = await getHowItWorksPage();

  return (
    <>
      <main id="main" className="min-h-dvh flex-1 overflow-x-clip bg-black">
        <PageHero
          title={hero.heading}
          tone="deep"
          image={{
            mobile: "/images/how-it-works/hero-mobile.jpg",
            desktop: "/images/how-it-works/hero-desktop.jpg",
          }}
        />
        <HowItWorksDetailsSection items={items} />
        <Cta
          id="how-it-works-arena"
          variant="inverted"
          heading={hero.arenaHeading}
          description={hero.arenaDescription}
          ctaLabel={hero.arenaCtaLabel}
          ctaHref={hero.arenaCtaHref}
        />
      </main>
      <CmsLive />
    </>
  );
}
