import type { Metadata } from "next";

import { SiteMain } from "@/components/layout/site-main";
import { WaitlistPageSection } from "@/components/sections/waitlist-page-section";
import { getWaitlistPage } from "@/lib/cms/waitlist-page";
import { buildPageMetadata } from "@/lib/seo/build-page-metadata";
import { getWaitlistLocationOptions } from "@/lib/waitlist";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getWaitlistPage({ clean: true });

  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    canonical: "/waitlist",
  });
}

export default async function WaitlistPage() {
  const [{ content }, locations] = await Promise.all([
    getWaitlistPage(),
    getWaitlistLocationOptions(),
  ]);

  return (
    <SiteMain variant="solidNav">
      <WaitlistPageSection content={content} locations={locations} />
    </SiteMain>
  );
}
