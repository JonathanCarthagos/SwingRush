import type { Metadata } from "next";

import { Footer } from "@/components/sections/footer";
import { Nav } from "@/components/sections/nav";
import { NotFoundSection } from "@/components/sections/not-found-section";

export const metadata: Metadata = {
  title: "Page Not Found",
};

// Renders under the root layout only, so it brings the site chrome the (site) group would provide.
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <Nav solid />
      <NotFoundSection />
      <Footer />
    </div>
  );
}
