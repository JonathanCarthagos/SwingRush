import Image from "next/image";

import { DisplayHeading } from "@/components/ui/display-heading";
import { TextLink } from "@/components/ui/text-link";
import { HOME_PAGE_CONTENT } from "@/data/home";
import { cn } from "@/lib/utils";
import type { HomeStory } from "@/types/home";

export interface ChallengesProps extends React.HTMLAttributes<HTMLElement> {
  stories?: readonly HomeStory[];
}

export function Challenges({
  className,
  stories = HOME_PAGE_CONTENT.stories,
  ...props
}: ChallengesProps) {
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
      {stories.map((story, index) => (
        <ChallengeCard key={story.id} story={story} index={index} />
      ))}
    </section>
  );
}

function ChallengeCard({ story, index }: { story: HomeStory; index: number }) {
  const imageOnRight = index % 2 === 1;

  return (
    <article
      className={cn(
        "flex w-full flex-col items-start gap-6",
        "min-[1280px]:flex-row min-[1280px]:items-center",
        imageOnRight
          ? "min-[1280px]:gap-[13.5625rem]"
          : "min-[1280px]:gap-[11.375rem]",
      )}
    >
      <div
        className={cn(
          "relative aspect-[510/500] w-full overflow-hidden",
          "min-[768px]:w-[clamp(23.15125rem,calc(10rem+27.34375vw),31.875rem)]",
          "min-[1280px]:h-[31.25rem] min-[1280px]:shrink-0",
          imageOnRight && "min-[1280px]:order-2",
        )}
      >
        <Image
          src={story.image.src}
          alt={story.image.alt}
          fill
          sizes="(min-width: 1280px) 510px, (min-width: 768px) 510px, 100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="flex w-full max-w-full flex-col text-left text-white min-[768px]:max-w-[clamp(23.15125rem,calc(10rem+27.34375vw),31.875rem)] min-[1280px]:w-[33rem] min-[1280px]:max-w-none min-[1280px]:shrink-0">
        <div className="flex flex-col gap-[0.8125rem]">
          <DisplayHeading
            as="h3"
            text={story.title}
            className="box-border max-w-full px-[0.08em] font-display text-[3.125rem] uppercase leading-[2.625rem] min-[768px]:text-[clamp(3.125rem,calc(0.78125rem+4.8828125vw),4.6875rem)] min-[768px]:leading-[clamp(2.625rem,calc(0.5859375rem+4.248046875vw),3.984375rem)]"
          />
          <p className="font-body text-[1.0625rem] font-medium leading-[1.1] tracking-body min-[768px]:text-[clamp(1.0625rem,calc(0.40625rem+1.3671875vw),1.5rem)] min-[1280px]:font-normal min-[1280px]:leading-[1.3]">
            {story.subtitle}
          </p>
        </div>
        <TextLink
          href={story.href}
          className="mt-[0.8125rem] inline-flex min-h-11 w-fit items-center font-body text-[1.0625rem] font-medium leading-[1.1] tracking-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current min-[768px]:text-[clamp(1.0625rem,calc(0.40625rem+1.3671875vw),1.5rem)] min-[1280px]:mt-6 min-[1280px]:leading-[1.3]"
        >
          {story.linkLabel}
        </TextLink>
      </div>
    </article>
  );
}
