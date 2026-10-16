import type { PortableTextBlock } from "@portabletext/types";

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
  /** Structured placeholder used when the CMS body is empty. */
  sections: readonly LegalSection[];
  /** Portable Text from Sanity. Null keeps the placeholder sections. */
  body: readonly PortableTextBlock[] | null;
}
