import type { Metadata } from "next";

import { CmsLive } from "@/components/cms/cms-live";
import { ChallengesPageSection } from "@/components/sections/challenges-page-section";
import { Cta } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { getChallengesPage } from "@/lib/cms/challenges";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getChallengesPage({ clean: true });

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: {
      canonical: "/challenges",
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: "/challenges",
      type: "website",
      images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function ChallengesPage() {
  const { title, emptyState, items } = await getChallengesPage();

  return (
    <>
      <main className="flex-1 overflow-x-clip bg-black">
        <PageHero
          title={title}
          stackTitleOnMobile
          image={{
            mobile: "/images/challenges/hero-mobile.jpg",
            desktop: "/images/challenges/hero-desktop.jpg",
          }}
        />
        <ChallengesPageSection emptyState={emptyState} items={items} />
        <Cta
          variant="inverted"
          heading={"THE ARENA\nGOLF GAUNTLET"}
          mobileDescription="Do you have the skills to complete each golf challenge as fast as you can and become a Swingrusher?"
          description="Do you have the skills to complete the world’s first arena golf gauntlet and become a Swingrusher?"
          ctaLabel="Sign Up"
          ctaHref="/locations"
          className="min-[1280px]:[&>div]:max-w-none min-[1280px]:[&_h2]:whitespace-nowrap"
        />
      </main>
      <CmsLive />
    </>
  );
}
