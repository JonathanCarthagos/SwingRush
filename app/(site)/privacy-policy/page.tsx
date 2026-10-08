import type { Metadata } from "next";

import { LegalPageSection } from "@/components/sections/legal-page-section";
import { PRIVACY_POLICY_CONTENT } from "@/data/legal";

const { seo } = PRIVACY_POLICY_CONTENT;

// Placeholder copy: keep out of search results until the real text replaces it (see data/legal.ts).
export const metadata: Metadata = {
  title: { absolute: seo.title },
  description: seo.description,
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: "/privacy-policy",
    type: "website",
    images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630 }],
  },
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main id="main" className="flex-1 overflow-x-hidden bg-black pt-nav-offset min-[768px]:pt-[clamp(3.375rem,calc(-0.5625rem+8.203125vw),6rem)] min-[1280px]:pt-24">
      <LegalPageSection content={PRIVACY_POLICY_CONTENT} />
    </main>
  );
}
