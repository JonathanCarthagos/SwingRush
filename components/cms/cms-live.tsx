import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import { isSanityConfigured } from "@/sanity/env";
import { SanityLive } from "@/sanity/lib/live";

/**
 * Live content and Visual Editing are scoped to the CMS-driven routes instead of
 * the root layout. `includeDrafts` is the only path that sends the Viewer token
 * to the browser, and only while Draft Mode is on.
 */
export async function CmsLive() {
  if (!isSanityConfigured) return null;

  const { isEnabled } = await draftMode();

  return (
    <>
      <SanityLive includeDrafts={isEnabled} />
      {isEnabled ? <VisualEditing /> : null}
    </>
  );
}
