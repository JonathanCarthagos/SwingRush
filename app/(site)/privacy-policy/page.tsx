import type { Metadata } from "next";

import { CmsLive } from "@/components/cms/cms-live";
import { SiteMain } from "@/components/layout/site-main";
import { LegalPageSection } from "@/components/sections/legal-page-section";
import { getPrivacyPolicy } from "@/lib/cms/legal";
import { buildPageMetadata } from "@/lib/seo/build-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPrivacyPolicy({ clean: true });

  // Placeholder copy: keep out of search results until the client replaces it.
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    canonical: "/privacy-policy",
    robots: { index: false, follow: false },
  });
}

export default async function Page() {
  const { content } = await getPrivacyPolicy();

  return (
    <>
      <SiteMain variant="solidNav">
        <LegalPageSection content={content} />
      </SiteMain>
      <CmsLive />
    </>
  );
}
