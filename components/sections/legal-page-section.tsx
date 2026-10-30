import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

import { DisplayHeading } from "@/components/ui/display-heading";
import type { LegalPageContent, LegalSection } from "@/types/legal";

// Desktop values come from the 1680px frame. There is no mobile or tablet frame, so mobile follows the
// site's mobile scale and tablet ramps linearly from the mobile value at 768px to the Figma value at 1280px.
const SECTION_CLASS =
  "flex flex-col gap-5 min-[768px]:gap-[clamp(1.25rem,calc(2.344vw+0.125rem),2rem)] min-[1280px]:gap-8";
const HEADING_CLASS =
  "font-display text-[2.5rem] uppercase leading-[1.05] min-[768px]:text-[clamp(2.5rem,calc(6.836vw-0.78rem),4.6875rem)] min-[1280px]:text-[4.6875rem] min-[1280px]:leading-[0.85]";
const BODY_CLASS =
  "flex flex-col gap-4 text-pretty font-body text-[1.0625rem] leading-[1.5] tracking-body min-[768px]:text-[clamp(1.0625rem,calc(0.1953vw+0.96875rem),1.125rem)] min-[1280px]:text-[1.125rem]";
const STACK_CLASS =
  "mx-auto mt-14 flex w-full flex-col gap-12 min-[768px]:mt-[clamp(3.5rem,calc(4.6875vw+1.25rem),5rem)] min-[768px]:max-w-challenge-tablet-copy min-[768px]:gap-[clamp(3rem,calc(3.125vw+1.5rem),4rem)] min-[1280px]:mx-0 min-[1280px]:mt-20 min-[1280px]:max-w-[89.625rem] min-[1280px]:gap-16";

const bodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h3: ({ children }) => (
      <h3 className="font-body text-[1.25rem] font-medium leading-[1.3] tracking-body">
        {children}
      </h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="flex list-disc flex-col gap-2 pl-5">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="flex list-decimal flex-col gap-2 pl-5">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "";
      const external = /^https?:\/\//.test(href);

      return (
        <a
          href={href}
          className="underline decoration-1 underline-offset-[0.18em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          {...(external
            ? { target: "_blank", rel: "noreferrer noopener" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export interface LegalPageSectionProps {
  content: LegalPageContent;
}

export function LegalPageSection({ content }: LegalPageSectionProps) {
  const { title, lastPublished, sections, body } = content;

  return (
    <article className="mx-auto w-full max-w-[105rem] px-4 pt-12 pb-16 text-white min-[768px]:px-tablet-gutter min-[768px]:pt-[clamp(3rem,calc(18.359vw-5.8125rem),8.875rem)] min-[768px]:pb-[clamp(4rem,calc(18.75vw-5rem),10rem)] min-[1280px]:px-desktop-gutter min-[1280px]:pt-[8.875rem] min-[1280px]:pb-40">
      <header className="flex flex-col items-center text-center">
        <DisplayHeading
          as="h1"
          text={title}
          wrap
          className="box-border max-w-full px-[0.08em] font-display text-[4rem] uppercase leading-[0.84] [text-wrap:balance] min-[768px]:text-[clamp(4rem,calc(100vw*200/1680),12.5rem)]"
        />
        <p className="mt-4 font-nav text-[1.0625rem] uppercase leading-[1.3] tracking-nav min-[768px]:mt-[clamp(1rem,calc(1.758vw+0.15625rem),1.5625rem)] min-[768px]:text-[clamp(1.0625rem,calc(1.367vw+0.40625rem),1.5rem)] min-[1280px]:mt-[1.5625rem] min-[1280px]:text-2xl">
          {lastPublished.label}:{" "}
          <time dateTime={lastPublished.isoDate}>{lastPublished.display}</time>
        </p>
      </header>

      {body?.length ? (
        <LegalBody blocks={body} />
      ) : (
        <PlaceholderSections sections={sections} />
      )}
    </article>
  );
}

function PlaceholderSections({
  sections,
}: {
  sections: readonly LegalSection[];
}) {
  return (
    <div className={STACK_CLASS}>
      {sections.map((section) => (
        <section
          key={section.id}
          aria-labelledby={`legal-${section.id}`}
          className={SECTION_CLASS}
        >
          <h2 id={`legal-${section.id}`} className={HEADING_CLASS}>
            {section.heading}
          </h2>
          <div className={BODY_CLASS}>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function isSectionHeading(block: PortableTextBlock) {
  return block._type === "block" && block.style === "h2" && !block.listItem;
}

function LegalBody({ blocks }: { blocks: readonly PortableTextBlock[] }) {
  const groups: {
    id: string;
    heading: PortableTextBlock | null;
    blocks: PortableTextBlock[];
  }[] = [];

  for (const block of blocks) {
    if (isSectionHeading(block) || groups.length === 0) {
      groups.push({
        id: block._key || `section-${groups.length + 1}`,
        heading: isSectionHeading(block) ? block : null,
        blocks: isSectionHeading(block) ? [] : [block],
      });
      continue;
    }

    groups[groups.length - 1]?.blocks.push(block);
  }

  return (
    <div className={STACK_CLASS}>
      {groups.map((group) => (
        <section
          key={group.id}
          aria-labelledby={group.heading ? `legal-${group.id}` : undefined}
          className={SECTION_CLASS}
        >
          {group.heading ? (
            <PortableText
              value={[group.heading]}
              components={{
                block: {
                  h2: ({ children }) => (
                    <h2 id={`legal-${group.id}`} className={HEADING_CLASS}>
                      {children}
                    </h2>
                  ),
                },
              }}
            />
          ) : null}
          {group.blocks.length > 0 ? (
            <div className={BODY_CLASS}>
              <PortableText value={group.blocks} components={bodyComponents} />
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}
