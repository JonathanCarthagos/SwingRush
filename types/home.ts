import type { SeoContent } from "@/types/seo";

export interface HomeHeroContent {
  heading: string;
  webmSrc: string;
  mp4Src: string;
  posterSrc: string;
}

export interface HomeArenaContent {
  heading: string;
  description: string;
}

export interface HomeStoryImage {
  src: string;
  alt: string;
}

export interface HomeStory {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  media: "image" | "scoreboard";
  image?: HomeStoryImage;
}

export interface HomeCtaContent {
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
}

export interface HomePageContent {
  seo: SeoContent;
  hero: HomeHeroContent;
  arena: HomeArenaContent;
  stories: readonly HomeStory[];
  cta: HomeCtaContent;
}
