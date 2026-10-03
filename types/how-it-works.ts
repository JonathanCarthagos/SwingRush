import type { SeoContent } from "@/types/seo";

export interface HowItWorksContentSection {
  heading: string;
  body: string;
}

export interface HowItWorksItemImage {
  src: string;
  alt: string;
  /** Optional art-directed crop used below 768px. */
  mobileSrc?: string;
}

export interface HowItWorksItemLink {
  label: string;
  href: string;
}

export interface HowItWorksItem {
  id: string;
  title: string;
  content: string;
  sections?: readonly HowItWorksContentSection[];
  image?: HowItWorksItemImage;
  link?: HowItWorksItemLink;
}

export interface HowItWorksHeroContent {
  heading: string;
  webmSrc: string;
  mp4Src: string;
  posterSrc: string;
  arenaHeading: string;
  arenaDescription: string;
}

export interface HowItWorksPageContent {
  seo: SeoContent;
  hero: HowItWorksHeroContent;
  introduction: string;
  items: readonly HowItWorksItem[];
}
