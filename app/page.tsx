import type { Metadata } from "next";

import { Arena } from "@/components/sections/arena";
import { Challenges } from "@/components/sections/challenges";
import { Cta } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";

const HOME_TITLE = "Ready, Set, Golf. The World's First Arena Golf Gauntlet.";
const HOME_DESCRIPTION =
  "Ten one-of-a-kind golf skills challenges, hundreds of golfers, one finish line. Race to the finish line solo or as a team.";

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "arena golf",
    "golf challenges",
    "competitive social golf",
    "team golf events",
    "skills golf challenges",
    "indoor golf competition",
  ],
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "/",
    type: "website",
  },
  twitter: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

export default function HomePage() {
  return (
    <>
      <main className="flex-1 bg-[#000000] px-gutter-x min-h-dvh">
        <Hero />
        <Arena />
        <Challenges />
        <Cta variant="inverted" />
      </main>
      <Footer />
    </>
  );
}
