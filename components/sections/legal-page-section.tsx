import { DisplayHeading } from "@/components/ui/display-heading";
import type { LegalPageContent } from "@/types/legal";

// Desktop values come from the 1680px frame. There is no mobile or tablet frame, so mobile follows the
// site's mobile scale and tablet ramps linearly from the mobile value at 768px to the Figma value at 1280px.
export interface LegalPageSectionProps {
  content: LegalPageContent;
}

export function LegalPageSection({ content }: LegalPageSectionProps) {
  const { title, lastPublished, sections } = content;

  return (
    <article className="mx-auto w-full max-w-[105rem] px-4 pt-12 pb-16 text-white min-[768px]:px-tablet-gutter min-[768px]:pt-[clamp(3rem,calc(18.359vw-5.8125rem),8.875rem)] min-[768px]:pb-[clamp(4rem,calc(18.75vw-5rem),10rem)] min-[1280px]:px-desktop-gutter min-[1280px]:pt-[8.875rem] min-[1280px]:pb-40">
      <header className="flex flex-col items-center text-center">
        <DisplayHeading
          as="h1"
          align="center"
          text={title}
          wrap
          className="box-border max-w-full font-display text-[4.375rem] leading-none [text-wrap:balance] min-[768px]:text-[clamp(4.375rem,calc(25.39vw-7.8125rem),12.5rem)] min-[1280px]:text-[12.5rem]"
        />
        <p className="mt-4 font-body text-[1.0625rem] font-extrabold leading-[1.5] min-[768px]:mt-[clamp(1rem,calc(1.758vw+0.15625rem),1.5625rem)] min-[768px]:text-[clamp(1.0625rem,calc(1.367vw+0.40625rem),1.5rem)] min-[1280px]:mt-[1.5625rem] min-[1280px]:text-2xl">
          {lastPublished.label}:{" "}
          <time dateTime={lastPublished.isoDate}>{lastPublished.display}</time>
        </p>
      </header>

      <div className="mx-auto mt-14 flex w-full flex-col gap-12 min-[768px]:mt-[clamp(3.5rem,calc(4.6875vw+1.25rem),5rem)] min-[768px]:max-w-challenge-tablet-copy min-[768px]:gap-[clamp(3rem,calc(3.125vw+1.5rem),4rem)] min-[1280px]:mt-20 min-[1280px]:max-w-[89.625rem] min-[1280px]:gap-16">
        {sections.map((section) => (
          <section
            key={section.id}
            aria-labelledby={`legal-${section.id}`}
            className="flex flex-col gap-5 min-[768px]:gap-[clamp(1.25rem,calc(2.344vw+0.125rem),2rem)] min-[1280px]:gap-8"
          >
            <h2
              id={`legal-${section.id}`}
              className="font-display text-[2.5rem] leading-[1.1] tracking-[-0.01em] min-[768px]:text-[clamp(2.5rem,calc(3.906vw+0.625rem),3.75rem)] min-[1280px]:text-[3.75rem]"
            >
              {section.heading}
            </h2>
            <div className="flex flex-col gap-4 text-pretty font-body text-[1.0625rem] leading-[1.5] tracking-body min-[768px]:text-[clamp(1.0625rem,calc(0.1953vw+0.96875rem),1.125rem)] min-[1280px]:text-[1.125rem]">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
