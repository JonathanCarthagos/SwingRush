import type { Metadata } from "next";

import { CmsLive } from "@/components/cms/cms-live";
import { Arena } from "@/components/sections/arena";
import { Challenges } from "@/components/sections/challenges";
import { Clubs } from "@/components/sections/clubs";
import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { getHomePage } from "@/lib/cms/home";
import { SCROLL_MARGIN_NAV_DESKTOP_CLASS } from "@/lib/layout/hero-shell";
import { buildPageMetadata } from "@/lib/seo/build-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomePage({ clean: true });

  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    canonical: "/",
    twitter: true,
    keywords: [
      "arena golf",
      "golf challenges",
      "competitive social golf",
      "team golf events",
      "skills golf challenges",
      "indoor golf competition",
    ],
  });
}

export default async function HomePage() {
  const { hero, clubs, arena, stories, cta } = await getHomePage();

  return (
    <>
      <main id="main" className="min-h-dvh flex-1 overflow-x-clip bg-[#000000]">
        <Hero
          heading={hero.heading}
          webmSrc={hero.webmSrc}
          videoSrc={hero.mp4Src}
          poster={hero.posterSrc}
          mobileWebmSrc={hero.mobileWebmSrc}
          mobileVideoSrc={hero.mobileMp4Src}
          mobilePoster={hero.mobilePosterSrc}
        />
        <Cta
          id="next-section"
          variant="inverted"
          keepBreaks
          heading={"10 CHALLENGES\n1 FINISH LINE"}
          className={SCROLL_MARGIN_NAV_DESKTOP_CLASS}
          description="The world’s first arena golf experience"
          ctaLabel="Learn More"
          ctaHref="/how-it-works"
        />
        <Cta
          variant="solid"
          heading="CONQUER THE SKILLS GAUNTLET"
          description="Do you have what it takes to complete all ten skills challenges?"
        />
        <Clubs clubs={clubs} />
        <Arena heading={arena.heading} description={arena.description} />
        <Challenges stories={stories} />
        <Cta
          variant="inverted"
          heading={"JUMP INTO\nTHE ARENA"}
          description={cta.description}
          ctaLabel="Sign Up"
          ctaHref="/locations"
        />
      </main>
      <CmsLive />
    </>
  );
}
