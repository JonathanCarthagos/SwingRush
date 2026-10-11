import { Footer } from "@/components/sections/footer";
import { PageTransition } from "@/components/ui/page-transition";

/**
 * Wraps the page content (and its footer) in the push transition while the
 * Nav, which lives in the layout, travels via its own `site-nav` snapshot.
 */
export default function SiteTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageTransition>
      {children}
      <Footer />
    </PageTransition>
  );
}
