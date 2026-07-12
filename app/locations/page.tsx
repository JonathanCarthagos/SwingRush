import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Locations | SwingRush",
  description: "Explore SwingRush events across cities.",
};

export default function LocationsPage() {
  return (
    <main className="flex-1 px-gutter-x pb-gutter-y pt-nav-offset">
      <div className="mx-auto w-full max-w-6xl py-gutter-y">
        <h1 className="font-display text-h1">Locations</h1>
        <p className="mt-4 max-w-2xl text-base text-foreground/70 md:text-lg">
          City listing scaffold. Dynamic city pages live at /locations/[slug].
        </p>
      </div>
    </main>
  );
}
