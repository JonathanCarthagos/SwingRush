import { DisplayHeading } from "@/components/ui/display-heading";
import { HOME_PAGE_CONTENT } from "@/data/home";
import { cn } from "@/lib/utils";

export interface ArenaProps extends React.HTMLAttributes<HTMLElement> {
  heading?: string;
  description?: string;
}

export function Arena({
  className,
  heading = HOME_PAGE_CONTENT.arena.heading,
  description = HOME_PAGE_CONTENT.arena.description,
  ...props
}: ArenaProps) {
  return (
    <section
      id="arena"
      className={cn(
        "flex h-[22.3125rem] w-full scroll-mt-nav-offset flex-col items-center justify-center bg-brand px-[0.97375rem] text-center",
        "min-[768px]:h-[clamp(22.3125rem,calc(-0.46875rem+47.4609375vw),37.5rem)] min-[768px]:px-tablet-gutter",
        "min-[1280px]:h-[37.5rem] min-[1280px]:px-0",
        className,
      )}
      {...props}
    >
      <div className="flex w-full flex-col items-center gap-[0.875rem] min-[768px]:gap-[clamp(0.875rem,calc(0.6875rem+0.390625vw),1rem)] min-[1280px]:gap-4">
        <DisplayHeading
          as="h2"
          text={heading}
          className="box-border max-w-full px-[0.08em] font-display text-[4rem] uppercase leading-[0.84502] text-white min-[768px]:text-[clamp(4rem,calc(0.625rem+7.03125vw),6.25rem)]"
        />
        <p className="max-w-[16.8533125rem] font-body text-[1.0625rem] font-normal leading-[1.3] tracking-body text-white min-[768px]:max-w-[clamp(16.8533125rem,calc(-12.85990625rem+61.9025390625vw),36.662125rem)] min-[768px]:text-[clamp(1.0625rem,calc(0.40625rem+1.3671875vw),1.5rem)] min-[1280px]:max-w-[36.662125rem] min-[1280px]:text-[1.5rem]">
          {description}
        </p>
      </div>
    </section>
  );
}
