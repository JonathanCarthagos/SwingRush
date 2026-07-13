import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import { SanityLive } from "@/sanity/lib/live";

export default async function LocationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <>
      {children}
      <SanityLive />
      {isDraftMode ? <VisualEditing /> : null}
    </>
  );
}
