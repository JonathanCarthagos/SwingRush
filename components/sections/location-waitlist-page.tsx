import { LocationVideoHero } from "@/components/sections/location-video-hero";
import { LocationWaitlistForm } from "@/components/sections/location-waitlist-form";
import { DisplayHeading } from "@/components/ui/display-heading";
import { formatLocationDateRange } from "@/lib/format-location-date";
import { cn } from "@/lib/utils";
import type { LocationWaitlistContent } from "@/types/location-detail";

// Type and spacing ramp from the mobile frame (402px) to the desktop frame (1680px) across the tablet range.
const TEXT_SUBHEAD =
  "font-body text-[1.0625rem] leading-[1.3] tracking-body min-[768px]:text-[clamp(1.0625rem,calc(2.539vw-0.15625rem),1.875rem)] min-[1280px]:text-[1.875rem]";

export interface LocationWaitlistPageProps {
  content: LocationWaitlistContent;
}

export function LocationWaitlistPage({ content }: LocationWaitlistPageProps) {
  return (
    <main className="flex-1 overflow-x-hidden bg-black text-white">
      {/* The waitlist frame plays 658px of video below the 96px header on desktop. */}
      <LocationVideoHero
        media={content.hero}
        title={content.city}
        showTitle={false}
        className="min-[1280px]:h-[47.125rem]"
      />

      <div className="mx-auto w-full max-w-[105rem] px-4 py-16 min-[768px]:px-tablet-gutter min-[768px]:py-[clamp(0.9375rem,calc(21.29vw-9.28rem),7.75rem)] min-[1280px]:px-desktop-gutter min-[1280px]:py-[7.75rem]">
        <div className="flex max-w-[48.086rem] flex-col">
          <DisplayHeading
            as="h1"
            text={content.city}
            className="box-border max-w-full px-[0.08em] font-display text-[3.125rem] uppercase leading-[0.84] [text-wrap:balance] min-[768px]:text-[clamp(3.125rem,calc(9.766vw-1.5625rem),6.25rem)] min-[1280px]:text-[6.25rem] min-[1280px]:leading-[0.845]"
          />

          <p
            className={cn(
              TEXT_SUBHEAD,
              "mt-[0.9375rem] min-[768px]:mt-[clamp(0.9375rem,calc(1.758vw+0.09375rem),1.5rem)] min-[1280px]:mt-6",
            )}
          >
            <span className="block min-[1280px]:font-bold">
              {formatLocationDateRange(content.dates)}
            </span>
            {content.venueName ? (
              <span className="block" translate="no">
                {content.venueName}
              </span>
            ) : null}
          </p>

          <p className={cn(TEXT_SUBHEAD, "mt-6 min-[1280px]:max-w-[48rem]")}>
            {content.introduction}
          </p>

          <LocationWaitlistForm
            slug={content.slug}
            className="mt-12 min-[1280px]:mt-[3.125rem]"
          />
        </div>
      </div>
    </main>
  );
}
