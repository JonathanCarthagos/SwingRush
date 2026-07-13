import type { Metadata } from "next";

import { Arena } from "@/components/sections/arena";
import { Challenges } from "@/components/sections/challenges";
import { Cta } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { HomeMotionShell } from "@/components/motion";

export const metadata: Metadata = {
  title: "SwingRush",
  description: "Premium swing dance experiences across cities.",
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
