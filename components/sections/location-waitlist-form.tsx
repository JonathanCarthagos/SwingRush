import { WaitlistForm } from "@/components/sections/waitlist-form";
import { WAITLIST_PAGE_CONTENT } from "@/data/waitlist";

export interface LocationWaitlistFormProps {
  slug: string;
  headingId: string;
  className?: string;
}

export function LocationWaitlistForm({
  slug,
  headingId,
  className,
}: LocationWaitlistFormProps) {
  return (
    <WaitlistForm
      content={WAITLIST_PAGE_CONTENT}
      locations={[]}
      headingId={headingId}
      fixedLocation={{ slug, sourcePath: `/locations/${slug}` }}
      className={className}
    />
  );
}
