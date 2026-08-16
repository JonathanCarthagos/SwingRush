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
        "relative left-1/2 right-1/2 -mx-[50vw] flex min-h-[28.4375rem] w-screen scroll-mt-nav-offset flex-col items-center justify-center bg-brand px-[0.96rem] text-center",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-[0.834rem]">
        <DisplayHeading
          as="h2"
          text={heading}
          className="box-border max-w-[calc(100vw-2rem)] whitespace-pre-line px-[0.08em] font-display text-[clamp(3.25rem,15.5vw,4rem)] leading-[0.86] text-white [text-wrap:balance]"
        />
        <p className="max-w-[16.85rem] font-body text-[1.0625rem] leading-[1.3] tracking-body text-white">
          {description}
        </p>
      </div>
    </section>
  );
}
