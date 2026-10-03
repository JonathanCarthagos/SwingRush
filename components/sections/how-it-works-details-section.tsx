import Image from "next/image";
import Link from "next/link";

import { DisplayHeading } from "@/components/ui/display-heading";
import { HOW_IT_WORKS_PAGE_CONTENT } from "@/data/how-it-works";
import { cn } from "@/lib/utils";
import type { HowItWorksItem } from "@/types/how-it-works";

const IMAGE_SIZES = "(min-width: 1680px) 767px, (min-width: 1280px) 46vw, 100vw";

// Stack spacing ramps from 17px (mobile) to 28px (desktop) across the tablet range.
const STACK_GAP =
  "gap-[1.0625rem] min-[768px]:gap-[clamp(1.0625rem,calc(0.03125rem+2.1484375vw),1.75rem)] min-[1280px]:gap-7";

export interface HowItWorksDetailsSectionProps
  extends React.HTMLAttributes<HTMLElement> {
  items?: readonly HowItWorksItem[];
}

export function HowItWorksDetailsSection({
  className,
  items = HOW_IT_WORKS_PAGE_CONTENT.items,
  ...props
}: HowItWorksDetailsSectionProps) {
  return (
    <section
      className={cn(
        "bg-black py-20 text-white min-[768px]:py-[clamp(5rem,calc(-1.5625rem+13.671875vw),9.375rem)] min-[1280px]:py-[9.375rem]",
        className,
      )}
      {...props}
    >
      <div className="mx-auto w-full px-4 min-[768px]:px-tablet-gutter min-[1280px]:max-w-[105rem] min-[1280px]:px-desktop-gutter">
        {/* Tablet keeps the mobile stack in a centred reading column; desktop splits into two columns. */}
        <div className="flex flex-col divide-y divide-white min-[768px]:mx-auto min-[768px]:max-w-challenge-tablet-copy min-[1280px]:mx-0 min-[1280px]:max-w-none min-[1280px]:gap-[5.125rem] min-[1280px]:divide-y-0">
          {items.map((item) => (
            <DetailRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DetailRow({ item }: { item: HowItWorksItem }) {
  return (
    <article
      id={item.id}
      className={cn(
        "flex flex-col",
        STACK_GAP,
        // The link's 44px hit area already closes the block, as in the frame.
        item.link ? "pb-0" : "pb-[1.375rem]",
        "min-[1280px]:grid min-[1280px]:grid-cols-[minmax(0,32.455%)_minmax(0,49.293%)] min-[1280px]:items-start min-[1280px]:justify-between min-[1280px]:gap-0 min-[1280px]:pb-0",
      )}
    >
      <DisplayHeading
        as="h2"
        text={item.title}
        wrap
        // Desktop scales with the 1680px frame so titles keep one line as the columns narrow;
        // the tablet ramp ends where desktop starts (50px -> 57.14px) to avoid a jump at 1280.
        className="flex min-h-[5.6875rem] flex-col justify-center font-display text-[3.125rem] uppercase leading-[2.625rem] text-white min-[768px]:text-[clamp(3.125rem,calc(2.4554rem+1.3951vw),3.5714rem)] min-[768px]:leading-[clamp(2.625rem,calc(2.0089rem+1.2835vw),3.0357rem)] min-[1280px]:-mt-[0.04em] min-[1280px]:block min-[1280px]:min-h-0 min-[1280px]:text-[clamp(3.125rem,calc(100vw*75/1680),4.6875rem)] min-[1280px]:leading-[0.85]"
      />

      <div className={cn("flex min-w-0 flex-col", STACK_GAP)}>
        {item.image ? <DetailImage image={item.image} /> : null}

        <DetailCopy item={item} />

        {item.link ? (
          <Link
            href={item.link.href}
            className="inline-flex min-h-11 w-fit items-start font-body text-[1.0625rem] font-medium leading-[1.1] tracking-body underline decoration-[8%] transition-opacity duration-150 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current motion-reduce:transition-none min-[768px]:text-[clamp(1.0625rem,calc(0.40625rem+1.3671875vw),1.5rem)] min-[1280px]:-mt-4 min-[1280px]:text-[1.5rem] min-[1280px]:font-bold min-[1280px]:leading-[1.3]"
          >
            {item.link.label}
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function DetailImage({ image }: { image: NonNullable<HowItWorksItem["image"]> }) {
  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden bg-black">
      {image.mobileSrc ? (
        <>
          <Image
            src={image.mobileSrc}
            alt={image.alt}
            fill
            quality={85}
            sizes="100vw"
            className="object-cover min-[768px]:hidden"
          />
          <Image
            src={image.src}
            alt={image.alt}
            fill
            quality={85}
            sizes={IMAGE_SIZES}
            className="hidden object-cover min-[768px]:block"
          />
        </>
      ) : (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          quality={85}
          sizes={IMAGE_SIZES}
          className="object-cover"
        />
      )}
    </div>
  );
}

function DetailCopy({ item }: { item: HowItWorksItem }) {
  return (
    // Paragraph gaps equal one blank line (1.3em) at every type size.
    <div className="space-y-[1.3em] font-body text-[1.0625rem] leading-[1.3] tracking-body text-white min-[768px]:text-[clamp(1.0625rem,calc(0.40625rem+1.3671875vw),1.5rem)] min-[1280px]:text-[1.5rem]">
      {item.content.split("\n\n").map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      {item.sections?.map((section, index) => (
        <div key={index}>
          <h3 className="font-bold">{section.heading}</h3>
          <p className="whitespace-pre-line min-[1280px]:whitespace-normal">
            {section.body}
          </p>
        </div>
      ))}
    </div>
  );
}
