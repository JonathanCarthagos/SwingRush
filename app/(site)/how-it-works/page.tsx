import type { Metadata } from "next";

import { CmsLive } from "@/components/cms/cms-live";
import { Cta } from "@/components/sections/cta";
import { HowItWorksDetailsSection } from "@/components/sections/how-it-works-details-section";
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
        <HowItWorksDetailsSection items={items} />
        <Cta
          id="how-it-works-arena"
          variant="inverted"
          heading={hero.arenaHeading}
          mobileDescription={hero.arenaDescription}
          description="Do you have the skills to complete the world’s first arena golf gauntlet and become a Swingrusher?"
          ctaLabel="Sign Up"
          className="min-[1280px]:[&>div]:max-w-none min-[1280px]:[&_h2]:whitespace-nowrap"
        />
      </main>
      <CmsLive />
    </>
  );
}
