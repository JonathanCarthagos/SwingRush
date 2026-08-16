import type { Metadata } from "next";

import { CmsLive } from "@/components/cms/cms-live";
import { Arena } from "@/components/sections/arena";
import { Challenges } from "@/components/sections/challenges";
import { Cta } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
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
    },
    twitter: {
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function HomePage() {
  const { hero, arena, stories, cta } = await getHomePage();

  return (
    <>
      <main className="flex-1 bg-[#000000] px-gutter-x min-h-dvh">
        <Hero
          heading={hero.heading}
          webmSrc={hero.webmSrc}
          videoSrc={hero.mp4Src}
          poster={hero.posterSrc}
        />
        <Arena heading={arena.heading} description={arena.description} />
        <Challenges stories={stories} />
        <Cta
          variant="inverted"
          heading={cta.heading}
          description={cta.description}
          ctaLabel={cta.ctaLabel}
          ctaHref={cta.ctaHref}
        />
      </main>
      <Footer />
      <CmsLive />
    </>
  );
}
