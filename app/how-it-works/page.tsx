import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | SwingRush",
  description: "Learn how SwingRush events work from start to finish.",
};

export default function HowItWorksPage() {
  return (
    <main className="flex-1 px-gutter-x pb-gutter-y pt-nav-offset">
      <div className="mx-auto w-full max-w-6xl py-gutter-y">
        <h1 className="font-display text-h1">How It Works</h1>
        <p className="mt-4 max-w-2xl text-base text-foreground/70 md:text-lg">
          Process explainer scaffold. Sections and animations will be added from
          Figma designs.
        </p>
      </div>
    </main>
  );
}
