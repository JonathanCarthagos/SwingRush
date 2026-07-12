import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Challenges | SwingRush",
  description: "Take on SwingRush dance challenges.",
};

export default function ChallengesPage() {
  return (
    <main className="flex-1 px-gutter-x pb-gutter-y pt-nav-offset">
      <div className="mx-auto w-full max-w-6xl py-gutter-y">
        <h1 className="font-display text-h1">Challenges</h1>
        <p className="mt-4 max-w-2xl text-base text-foreground/70 md:text-lg">
          Challenges page scaffold. Content will be wired from Sanity after
          schema expansion.
        </p>
      </div>
    </main>
  );
}
