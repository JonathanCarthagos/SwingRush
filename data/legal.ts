import type { LegalPageContent, LegalSection } from "@/types/legal";
import type { SeoContent } from "@/types/seo";

// Fallback when the Sanity document is missing or its body is empty.
// Placeholder copy: both pages stay noindex until the client replaces this text.
const LOREM =
  "Nunc condimentum curabitur vulputate in. Faucibus blandit id egestas amet euismod. Dolor sed purus ultrices etiam auctor volutpat. Fusce quam viverra vulputate vitae volutpat vitae a amet lacus. Lorem semper arcu ante orci sollicitudin ut nec diam. Pellentesque egestas ultrices feugiat tellus. Eget leo lacus sit quisque tristique aliquet convallis nunc. Quis dignissim lacus gravida mi et molestie tincidunt eget pharetra. Ullamcorper quam in libero enim. Eleifend lorem pretium eget ante nulla proin. Velit quis nisl nullam sed consectetur dapibus. Condimentum nibh turpis vitae orci. Eu arcu lorem pellentesque convallis ultricies. Sit bibendum sit massa enim leo.";

function placeholderSections(): LegalSection[] {
  return [3, 2, 5].map((count, index) => ({
    id: `section-${index + 1}`,
    heading: "Content",
    paragraphs: Array.from({ length: count }, () => LOREM),
  }));
}

const LAST_PUBLISHED = {
  label: "Last Published",
  isoDate: "2026-09-25",
  display: "25 September 2026",
} as const;

export const PRIVACY_POLICY_CONTENT = {
  title: "Privacy Policy",
  lastPublished: LAST_PUBLISHED,
  sections: placeholderSections(),
  body: null,
  seo: {
    title: "Privacy Policy | SwingRush",
    description: "How SwingRush collects, uses and protects your information.",
  },
} as const satisfies LegalPageContent & { seo: SeoContent };

export const TERMS_CONTENT = {
  title: "Terms of Use",
  lastPublished: LAST_PUBLISHED,
  sections: placeholderSections(),
  body: null,
  seo: {
    title: "Terms of Use | SwingRush",
    description:
      "The terms that apply when you use the SwingRush website and events.",
  },
} as const satisfies LegalPageContent & { seo: SeoContent };
