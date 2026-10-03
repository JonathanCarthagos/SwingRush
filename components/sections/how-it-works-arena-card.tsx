import { DisplayHeading } from "@/components/ui/display-heading";
import { cn } from "@/lib/utils";

export interface HowItWorksArenaCardProps
  extends React.HTMLAttributes<HTMLElement> {
  heading: string;
  description: string;
}

// Mobile and tablet only: desktop shows the full-width Cta band instead.
export function HowItWorksArenaCard({
  heading,
  description,
  className,
  ...props
}: HowItWorksArenaCardProps) {
  return (
    <section
      className={cn(
        "relative z-10 mx-gutter-x -mt-[3.25rem] flex min-h-[16.5rem] items-center justify-center bg-brand px-4 py-10 text-center text-white min-[1280px]:hidden",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-[0.834rem]">
        <DisplayHeading
          as="h2"
          text={heading}
          className="box-border max-w-[calc(100vw-4rem)] whitespace-pre-line px-[0.08em] font-display text-[clamp(3rem,14.5vw,3.75rem)] leading-[0.86] text-white [text-wrap:balance]"
        />
        <p className="max-w-[18rem] font-body text-[1.0625rem] leading-[1.3] tracking-body text-white">
          {description}
        </p>
      </div>
    </section>
  );
}
