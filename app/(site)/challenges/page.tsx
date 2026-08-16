import type { Metadata } from "next";

import { CmsLive } from "@/components/cms/cms-live";
import { ChallengesPageSection } from "@/components/sections/challenges-page-section";
import { Footer } from "@/components/sections/footer";
import { getChallengesPage } from "@/lib/cms/challenges";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getChallengesPage({ clean: true });

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: {
      canonical: "/challenges",
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: "/challenges",
      type: "website",
    },
  };
}

export default async function ChallengesPage() {
  const { title, introduction, emptyState, items } = await getChallengesPage();

  return (
    <>
      <main className="flex-1 overflow-x-hidden bg-black">
        <ChallengesPageSection
          title={title}
          introduction={introduction}
          emptyState={emptyState}
          items={items}
        />
      </main>
      <Footer />
      <CmsLive />
    </>
  );
}
