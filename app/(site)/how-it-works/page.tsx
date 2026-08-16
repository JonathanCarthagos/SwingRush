import type { Metadata } from "next";

import { CmsLive } from "@/components/cms/cms-live";
import { Footer } from "@/components/sections/footer";
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
        <HowItWorksAccordionSection intro={introduction} items={items} />
      </main>
      <Footer />
      <CmsLive />
    </>
  );
}
