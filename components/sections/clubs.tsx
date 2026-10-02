import Image from "next/image";
import Link from "next/link";

import { DisplayHeading } from "@/components/ui/display-heading";
import { HOME_PAGE_CONTENT } from "@/data/home";
import { cn } from "@/lib/utils";
import type { HomeStory } from "@/types/home";

export interface ClubsProps extends React.HTMLAttributes<HTMLElement> {
  clubs?: readonly HomeStory[];
}

export function Clubs({
  className,
  clubs = HOME_PAGE_CONTENT.clubs,
  ...props
}: ClubsProps) {
  return (
    <section
      className={cn(
        "flex w-full flex-col gap-[3.75rem] bg-black px-[0.986875rem] py-[4.375rem]",
        "min-[768px]:mx-auto min-[768px]:max-w-desktop-content min-[768px]:gap-[clamp(3.75rem,calc(-4.6875rem+17.578125vw),9.375rem)] min-[768px]:px-tablet-gutter min-[768px]:py-[clamp(4.375rem,calc(-1.25rem+11.71875vw),8.125rem)]",
        "min-[1280px]:gap-[9.375rem] min-[1280px]:px-0 min-[1280px]:py-[8.125rem]",
        className,
      )}
      {...props}
    >
      {clubs.map((club, index) => (
        <ClubCard key={club.id} club={club} index={index} />
      ))}
    </section>
  );
}

function rowGap(index: number) {
  if (index === 2) return "min-[1280px]:gap-[14.25rem]";
  return index % 2 === 1
    ? "min-[1280px]:gap-[13.5625rem]"
    : "min-[1280px]:gap-[11.375rem]";
}

function ClubCard({ club, index }: { club: HomeStory; index: number }) {
  const imageOnRight = index % 2 === 1;

  return (
    <article
      className={cn(
        "flex w-full flex-col items-start gap-6",
        "min-[1280px]:flex-row min-[1280px]:items-center",
        rowGap(index),
      )}
    >
      <div
        className={cn(
          "relative aspect-[370.42/356.17] w-full overflow-hidden",
          "min-[768px]:aspect-square min-[768px]:w-[clamp(23.15125rem,calc(11.003125rem+25.30859375vw),31.25rem)]",
          "min-[1280px]:w-[31.25rem] min-[1280px]:shrink-0",
          imageOnRight && "min-[1280px]:order-2",
        )}
      >
        <Image
          src={club.image.src}
          alt={club.image.alt}
          fill
          sizes="(min-width: 1280px) 500px, (min-width: 768px) 500px, 100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="flex w-full max-w-[21.75rem] flex-col text-left text-white min-[768px]:max-w-[clamp(21.75rem,calc(4.875rem+35.15625vw),33rem)] min-[1280px]:w-[33rem] min-[1280px]:max-w-none min-[1280px]:shrink-0">
        <div className="flex flex-col gap-[0.83375rem]">
          <DisplayHeading
            as="h2"
            text={club.title}
            className="box-border max-w-full px-[0.08em] font-display text-[3.125rem] uppercase leading-[2.625rem] min-[768px]:text-[clamp(3.125rem,calc(0.78125rem+4.8828125vw),4.6875rem)] min-[768px]:leading-[clamp(2.625rem,calc(0.5859375rem+4.248046875vw),3.984375rem)]"
          />
          <p className="font-body text-[1.0625rem] font-medium leading-[1.1] tracking-body min-[768px]:text-[clamp(1.0625rem,calc(0.40625rem+1.3671875vw),1.5rem)] min-[1280px]:font-normal min-[1280px]:leading-[1.3]">
            {club.subtitle}
          </p>
        </div>
        <Link
          href={club.href}
          className="mt-[0.83375rem] inline-flex min-h-11 w-fit items-center font-body text-[1.0625rem] font-medium leading-[1.1] tracking-body underline decoration-[0.08em] underline-offset-[0.18em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current min-[768px]:text-[clamp(1.0625rem,calc(0.40625rem+1.3671875vw),1.5rem)] min-[1280px]:mt-6 min-[1280px]:leading-[1.3] min-[1280px]:decoration-[0.07em]"
        >
          {club.linkLabel}
        </Link>
      </div>
    </article>
  );
}
