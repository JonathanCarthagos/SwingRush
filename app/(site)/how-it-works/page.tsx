import type { Metadata } from "next";

import { CmsLive } from "@/components/cms/cms-live";
import { Cta } from "@/components/sections/cta";
import { HowItWorksAccordionSection } from "@/components/sections/how-it-works-accordion-section";
import { HowItWorksHero } from "@/components/sections/how-it-works-hero";
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
  const { hero, introduction, items } = await getHowItWorksPage();

  return (
    <>
      <main className="min-h-dvh flex-1 overflow-x-hidden bg-black">
        <HowItWorksHero
          heading={hero.heading}
          webmSrc={hero.webmSrc}
          videoSrc={hero.mp4Src}
          poster={hero.posterSrc}
          arenaHeading={hero.arenaHeading}
          arenaDescription={hero.arenaDescription}
        />
        <Cta
          id="how-it-works-arena"
          variant="inverted"
          heading={hero.arenaHeading}
          description={hero.arenaDescription}
          ctaLabel="Sign Up"
          className="hidden min-[1280px]:flex min-[1280px]:[&_h2]:whitespace-nowrap"
        />
        <HowItWorksAccordionSection intro={introduction} items={items} />
      </main>
      <CmsLive />
    </>
  );
}
