import { WaitlistForm } from "@/components/sections/waitlist-form";
import { DisplayHeading } from "@/components/ui/display-heading";
import type {
  WaitlistLocationOption,
  WaitlistPageContent,
} from "@/types/waitlist";

export interface WaitlistPageSectionProps {
  content: WaitlistPageContent;
  locations: readonly WaitlistLocationOption[];
}

export function WaitlistPageSection({
  content,
  locations,
}: WaitlistPageSectionProps) {
  return (
    <section
      aria-labelledby="waitlist-title"
      className="mx-auto w-full max-w-[105rem] px-4 pt-12 pb-11 text-white min-[768px]:px-tablet-gutter min-[768px]:pt-[clamp(3rem,calc(5.859vw+0.1875rem),4.875rem)] min-[768px]:pb-[clamp(2.75rem,calc(40.47vw-16.68rem),15.6875rem)] min-[1280px]:px-desktop-gutter min-[1280px]:pt-[4.875rem] min-[1280px]:pb-[15.6875rem]"
    >
      <DisplayHeading
        as="h1"
        id="waitlist-title"
        text={content.title}
        wrap
        className="box-border max-w-full px-[0.08em] font-display text-[3.125rem] uppercase leading-[0.845] [text-wrap:balance] min-[768px]:text-[clamp(3.125rem,calc(9.765625vw-1.5625rem),6.25rem)] min-[1280px]:text-[6.25rem]"
      />
      <p className="mt-[0.9375rem] max-w-[47.8125rem] font-body text-[1.0625rem] leading-[1.3] tracking-body min-[768px]:mt-[clamp(0.9375rem,calc(1.758vw+0.09375rem),1.5rem)] min-[768px]:text-[clamp(1.0625rem,calc(2.539vw-0.15625rem),1.875rem)] min-[1280px]:mt-6 min-[1280px]:text-[1.875rem]">
        {content.introduction}
      </p>
      <WaitlistForm content={content} locations={locations} />
    </section>
  );
}
