import type { Metadata } from "next";

import { CmsLive } from "@/components/cms/cms-live";
import { ChallengesHero } from "@/components/sections/challenges-hero";
import { ChallengesPageSection } from "@/components/sections/challenges-page-section";
import { Cta } from "@/components/sections/cta";
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
    },
  };
}

export default async function ChallengesPage() {
  const { title, emptyState, items } = await getChallengesPage();

  return (
    <>
      <main className="flex-1 overflow-x-clip bg-black">
        <ChallengesHero title={title} />
        <ChallengesPageSection emptyState={emptyState} items={items} />
        <Cta
          variant="inverted"
          heading={"THE ARENA\nGOLF GAUNTLET"}
          mobileDescription="Do you have the skills to complete each golf challenge as fast as you can and become a Swingrusher?"
          description="Do you have the skills to complete the world’s first arena golf gauntlet and become a Swingrusher?"
          ctaLabel="Sign Up"
          className="min-[1280px]:[&>div]:max-w-none min-[1280px]:[&_h2]:whitespace-nowrap"
        />
      </main>
      <CmsLive />
    </>
  );
}
