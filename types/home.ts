import type { SeoContent } from "@/types/seo";

export interface HomeHeroContent {
  heading: string;
  webmSrc: string;
  mp4Src: string;
  posterSrc: string;
  mobileWebmSrc: string;
  mobileMp4Src: string;
  mobilePosterSrc: string;
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
  linkLabel: string;
  href: string;
  image: HomeStoryImage;
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
  clubs: readonly HomeStory[];
  arena: HomeArenaContent;
  stories: readonly HomeStory[];
  cta: HomeCtaContent;
}
