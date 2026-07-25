import type { Metadata } from "next";

import { ChallengesPageSection } from "@/components/sections/challenges-page-section";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: "Challenges | SwingRush",
  description:
    "Take on ten one-of-a-kind SwingRush golf skills challenges.",
};

export default function ChallengesPage() {
  return (
    <>
      <main className="flex-1 overflow-x-hidden bg-black">
        <ChallengesPageSection />
      </main>
      <Footer />
    </>
  );
}
