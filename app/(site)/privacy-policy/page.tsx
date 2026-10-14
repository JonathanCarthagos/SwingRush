import type { Metadata } from "next";

import { SiteMain } from "@/components/layout/site-main";
import { LegalPageSection } from "@/components/sections/legal-page-section";
import { PRIVACY_POLICY_CONTENT } from "@/data/legal";
import { buildPageMetadata } from "@/lib/seo/build-page-metadata";

const { seo } = PRIVACY_POLICY_CONTENT;

// Placeholder copy: keep out of search results until the real text replaces it (see data/legal.ts).
export const metadata: Metadata = buildPageMetadata({
  title: seo.title,
  description: seo.description,
  canonical: "/privacy-policy",
  robots: { index: false, follow: false },
});

export default function Page() {
  return (
    <SiteMain variant="solidNav">
      <LegalPageSection content={PRIVACY_POLICY_CONTENT} />
    </SiteMain>
  );
}
