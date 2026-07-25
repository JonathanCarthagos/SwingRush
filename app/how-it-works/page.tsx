import type { Metadata } from "next";

import { Footer } from "@/components/sections/footer";
import { HowItWorksAccordionSection } from "@/components/sections/how-it-works-accordion-section";
import { HowItWorksHero } from "@/components/sections/how-it-works-hero";

export const metadata: Metadata = {
  title: "How It Works | SwingRush",
  description: "Learn how SwingRush events work from start to finish.",
};

export default function HowItWorksPage() {
  return (
    <>
      <main className="min-h-dvh flex-1 overflow-x-hidden bg-black">
        <HowItWorksHero />
        <HowItWorksAccordionSection />
      </main>
      <Footer />
    </>
  );
}
