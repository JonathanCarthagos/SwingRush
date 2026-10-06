import type { Metadata } from "next";

import { WaitlistPageSection } from "@/components/sections/waitlist-page-section";
import { getWaitlistPage } from "@/lib/cms/waitlist-page";
import { getWaitlistLocationOptions } from "@/lib/waitlist";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getWaitlistPage({ clean: true });

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: {
      canonical: "/waitlist",
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: "/waitlist",
      type: "website",
      images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function WaitlistPage() {
  const [{ content }, locations] = await Promise.all([
    getWaitlistPage(),
    getWaitlistLocationOptions(),
  ]);

  return (
    <main className="flex-1 overflow-x-hidden bg-black pt-nav-offset min-[768px]:pt-[clamp(3.375rem,calc(-0.5625rem+8.203125vw),6rem)] min-[1280px]:pt-24">
      <WaitlistPageSection content={content} locations={locations} />
    </main>
  );
}
