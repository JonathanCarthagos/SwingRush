import { PageTransition } from "@/components/ui/page-transition";

/**
 * Remounts when moving between `/locations` and `/locations/[slug]` (or between
 * cities), so those navigations get the same push as the rest of the site.
 * It sits below the layout, so `CmsLive` (SanityLive / VisualEditing) stays
 * mounted.
 */
export default function LocationsTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PageTransition>{children}</PageTransition>;
}
