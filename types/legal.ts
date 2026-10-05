import type { SeoContent } from "@/types/seo";

export interface LegalSection {
  id: string;
  heading: string;
  paragraphs: readonly string[];
}

export interface LegalPageContent {
  title: string;
  lastPublished: {
    label: string;
    /** Machine-readable date for the <time> element. */
    isoDate: `${number}-${number}-${number}`;
    display: string;
  };
  sections: readonly LegalSection[];
  seo: SeoContent;
}
