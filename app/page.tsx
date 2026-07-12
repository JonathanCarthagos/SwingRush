import type { Metadata } from "next";

import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";

export const metadata: Metadata = {
  title: "SwingRush",
  description: "Premium swing dance experiences across cities.",
};

export default function HomePage() {
  return (
    <main className="flex-1 bg-[#000000] px-gutter-x pb-gutter-y min-h-dvh">
      <Hero />
      <Cta />
    </main>
  );
}
