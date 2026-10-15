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
  const { hero, promoCta, skillsBanner, clubs, arena, stories, cta } =
    await getHomePage();

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
          heading={promoCta.heading}
          className={SCROLL_MARGIN_NAV_DESKTOP_CLASS}
          description={promoCta.description}
          ctaLabel={promoCta.ctaLabel}
          ctaHref={promoCta.ctaHref}
        />
        <Cta
          variant="solid"
          heading={skillsBanner.heading}
          description={skillsBanner.description}
        />
        <Clubs clubs={clubs} />
        <Arena heading={arena.heading} description={arena.description} />
        <Challenges stories={stories} />
        <Cta
          variant="inverted"
          keepBreaks
          heading={cta.heading}
          description={cta.description}
          ctaLabel={cta.ctaLabel}
          ctaHref={cta.ctaHref}
        />
      </main>
      <CmsLive />
    </>
  );
}
