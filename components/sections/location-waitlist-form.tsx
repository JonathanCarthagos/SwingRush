import { WaitlistForm } from "@/components/sections/waitlist-form";
import { WAITLIST_PAGE_CONTENT } from "@/data/waitlist";

export interface LocationWaitlistFormProps {
  slug: string;
  className?: string;
}

export function LocationWaitlistForm({ slug, className }: LocationWaitlistFormProps) {
  return (
    <WaitlistForm
      content={WAITLIST_PAGE_CONTENT}
      locations={[]}
      fixedLocation={{ slug, sourcePath: `/locations/${slug}` }}
      className={className}
    />
  );
}
