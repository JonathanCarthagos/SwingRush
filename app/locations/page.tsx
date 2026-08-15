import type { Metadata } from "next";

import { Footer } from "@/components/sections/footer";
import { LocationsPageSection } from "@/components/sections/locations-page-section";
import { LOCATIONS_PAGE_CONTENT } from "@/data/locations";

export const metadata: Metadata = {
  title: "Locations | SwingRush",
  description: "Explore SwingRush events across cities.",
};

export default function LocationsPage() {
  return (
    <>
      <main className="flex-1 overflow-x-hidden bg-black">
        <LocationsPageSection pageContent={LOCATIONS_PAGE_CONTENT} />
      </main>
      <Footer />
    </>
  );
}
