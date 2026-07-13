import type { Metadata } from "next";

import { Arena } from "@/components/sections/arena";
import { Challenges } from "@/components/sections/challenges";
import { Cta } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { HomeMotionShell } from "@/components/motion";

export const metadata: Metadata = {
  title: "Arena Golf Challenges and Competitive Social Golf",
  description:
    "SwingRush is the world’s first arena golf gauntlet, blending one-of-a-kind skills challenges, team formats, and leaderboard-driven competition.",
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
    title: "Arena Golf Challenges and Competitive Social Golf",
    description:
      "SwingRush is the world’s first arena golf gauntlet, blending one-of-a-kind skills challenges, team formats, and leaderboard-driven competition.",
    url: "/",
    type: "website",
  },
  twitter: {
    title: "Arena Golf Challenges and Competitive Social Golf",
    description:
      "SwingRush is the world’s first arena golf gauntlet, blending one-of-a-kind skills challenges, team formats, and leaderboard-driven competition.",
  },
};

export default function HomePage() {
  return (
    <HomeMotionShell>
      <main className="flex-1 bg-[#000000] px-gutter-x min-h-dvh">
        <Hero />
        <Arena />
        <Challenges />
        <Cta variant="inverted" />
      </main>
      <Footer />
    </HomeMotionShell>
  );
}
