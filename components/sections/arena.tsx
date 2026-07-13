import { RevealText } from "@/components/motion";
import { cn } from "@/lib/utils";

export interface ArenaProps extends React.HTMLAttributes<HTMLElement> {
  heading?: string;
  description?: string;
}

export function Arena({
  className,
  heading = "THE ARENA\nGOLF GAUNTLET",
  description = "Do you have the skills to complete the world’s first arena golf gauntlet and become a Swingrusher?",
  ...props
}: ArenaProps) {
  return (
    <section
      className={cn(
        "relative left-1/2 right-1/2 -mx-[50vw] flex min-h-[28.4375rem] w-screen flex-col items-center justify-center bg-brand px-[0.96rem] text-center",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-[0.834rem]">
        <RevealText
          as="h2"
          text={heading}
          className="box-border max-w-[calc(100vw-2rem)] whitespace-pre-line px-[0.08em] font-display text-[clamp(3.25rem,15.5vw,4rem)] leading-[0.86] text-white [text-wrap:balance]"
          wipeClassName="bg-brand"
        />
        <p className="max-w-[16.85rem] font-body text-[1.0625rem] leading-[1.3] tracking-body text-white">
          {description}
        </p>
      </div>
    </section>
  );
}
