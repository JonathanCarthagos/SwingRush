import type { Metadata } from "next";

import { WaitlistPageSection } from "@/components/sections/waitlist-page-section";
import { WAITLIST_PAGE_CONTENT, WAITLIST_PAGE_SEO } from "@/data/waitlist";
import { getWaitlistLocationOptions } from "@/lib/waitlist";

export const metadata: Metadata = {
  title: { absolute: WAITLIST_PAGE_SEO.title },
  description: WAITLIST_PAGE_SEO.description,
  alternates: {
    canonical: "/waitlist",
  },
  openGraph: {
    title: WAITLIST_PAGE_SEO.title,
    description: WAITLIST_PAGE_SEO.description,
    url: "/waitlist",
    type: "website",
  },
};

export default async function WaitlistPage() {
  const locations = await getWaitlistLocationOptions();

  return (
    <main className="flex-1 overflow-x-hidden bg-black pt-nav-offset min-[768px]:pt-[clamp(3.375rem,calc(-0.5625rem+8.203125vw),6rem)] min-[1280px]:pt-24">
      <WaitlistPageSection content={WAITLIST_PAGE_CONTENT} locations={locations} />
    </main>
  );
}
