import type { Metadata } from "next";

import { CmsLive } from "@/components/cms/cms-live";
import { SiteMain } from "@/components/layout/site-main";
import { LegalPageSection } from "@/components/sections/legal-page-section";
import { getTermsOfUse } from "@/lib/cms/legal";
import { buildPageMetadata } from "@/lib/seo/build-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getTermsOfUse({ clean: true });

  // Placeholder copy: keep out of search results until the client replaces it.
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    canonical: "/terms",
    robots: { index: false, follow: false },
  });
}

export default async function Page() {
  const { content } = await getTermsOfUse();

  return (
    <>
      <SiteMain variant="solidNav">
        <LegalPageSection content={content} />
      </SiteMain>
      <CmsLive />
    </>
  );
}
