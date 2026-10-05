import { getLocationsPage } from "@/lib/cms/locations";
import type { WaitlistLocationOption } from "@/types/waitlist";

// Published-only and stega-free: option labels and values must never carry preview markers.
export async function getWaitlistLocationOptions(): Promise<
  WaitlistLocationOption[]
> {
  const { content } = await getLocationsPage({ clean: true });
  return content.locations.map(({ slug, city }) => ({
    value: slug,
    label: city,
  }));
}
