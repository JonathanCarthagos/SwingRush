import { CmsLive } from "@/components/cms/cms-live";

export default function LocationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <CmsLive />
    </>
  );
}
