import type { Metadata } from "next";

import { CmsLive } from "@/components/cms/cms-live";
import { Arena } from "@/components/sections/arena";
import { Challenges } from "@/components/sections/challenges";
import { Clubs } from "@/components/sections/clubs";
import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { getHomePage } from "@/lib/cms/home";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomePage({ clean: true });

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: {
      canonical: "/",
    },
    keywords: [
      "arena golf",
      "golf challenges",
      "competitive social golf",
      "team golf events",
      "skills golf challenges",
      "indoor golf competition",
    ],
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: "/",
      type: "website",
      images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/twitter-image.jpg"],
    },
  };
}

export default async function HomePage() {
  const { hero, clubs, arena, stories, cta } = await getHomePage();

  return (
    <>
      <main className="min-h-dvh flex-1 overflow-x-clip bg-[#000000]">
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
          variant="inverted"
          keepBreaks
          heading={"10 CHALLENGES\n1 FINISH LINE"}
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
