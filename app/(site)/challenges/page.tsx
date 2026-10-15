import type { Metadata } from "next";

import { CmsLive } from "@/components/cms/cms-live";
import { ChallengesPageSection } from "@/components/sections/challenges-page-section";
import { ChallengesSeoIndex } from "@/components/sections/challenges-seo-index";
import { Cta } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { getChallengesPage } from "@/lib/cms/challenges";
import { buildPageMetadata } from "@/lib/seo/build-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getChallengesPage({ clean: true });

  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    canonical: "/challenges",
    twitter: true,
  });
}

export default async function ChallengesPage() {
  const { title, introduction, emptyState, closingCta, items } =
    await getChallengesPage();

  return (
    <>
      <main id="main" className="flex-1 overflow-x-clip bg-black">
        <PageHero
          title={title}
          stackTitleOnMobile
          image={{
            mobile: "/images/challenges/hero-mobile.jpg",
            desktop: "/images/challenges/hero-desktop.jpg",
          }}
        />
        <ChallengesSeoIndex items={items} />
        <ChallengesPageSection
          emptyState={emptyState}
          introduction={introduction}
          items={items}
        />
        <Cta
          variant="inverted"
          keepBreaks
          heading={closingCta.heading}
          mobileDescription={closingCta.description}
          description={closingCta.description}
          ctaLabel={closingCta.ctaLabel}
          ctaHref={closingCta.ctaHref}
          className="min-[1280px]:[&>div]:max-w-none min-[1280px]:[&_h2]:whitespace-nowrap"
        />
      </main>
      <CmsLive />
    </>
  );
}
