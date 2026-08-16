import type { SeoContent } from "@/types/seo";

export interface AccordionContentSection {
  heading: string;
  body: string;
}

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  sections?: readonly AccordionContentSection[];
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
  items: readonly AccordionItem[];
}
