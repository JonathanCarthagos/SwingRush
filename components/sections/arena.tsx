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
        "relative flex min-h-[28.4375rem] w-full scroll-mt-nav-offset flex-col items-center justify-center bg-brand px-[0.96rem] text-center min-[768px]:h-tablet-band min-[768px]:min-h-0 min-[768px]:px-tablet-gutter min-[1280px]:h-[37.5rem]",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-[0.834rem] min-[768px]:gap-[clamp(1rem,2.03125vw,1.625rem)]">
        <DisplayHeading
          as="h2"
          text={heading}
          className="box-border max-w-[calc(100vw-2rem)] whitespace-pre-line px-[0.08em] font-display text-[clamp(3.25rem,15.5vw,4rem)] leading-[0.86] text-white [text-wrap:balance] min-[768px]:max-w-[calc(100vw-4rem)] min-[768px]:text-[clamp(4.5rem,7.8125vw,6.25rem)] min-[1280px]:hidden"
        />
        <DisplayHeading as="h2" text={heading.replace(/\s+/g, " ")} className="hidden px-[0.08em] font-display text-[clamp(4.5rem,5.952vw,6.25rem)] leading-[0.845] text-white min-[1280px]:block" />
        <p className="max-w-[16.85rem] font-body text-[1.0625rem] leading-[1.3] tracking-body text-white min-[768px]:max-w-[36.66rem] min-[768px]:text-[clamp(1.0625rem,1.875vw,1.5rem)]">
          {description}
        </p>
        <span className="hidden h-[2.125rem] items-center justify-center rounded-full border border-white px-[1.35rem] font-body text-[clamp(1.0625rem,1.5625vw,1.25rem)] font-medium uppercase leading-[1.1] tracking-[0.08em] text-white min-[768px]:inline-flex">Sign Up</span>
      </div>
    </section>
  );
}
