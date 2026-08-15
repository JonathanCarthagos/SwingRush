import Image from "next/image";
import Link from "next/link";

import { LocationVideoHero } from "@/components/sections/location-video-hero";
import { DisplayHeading } from "@/components/ui/display-heading";
import {
  formatLocationDate,
  formatLocationDateRange,
  formatScheduleDate,
  formatScheduleTime,
} from "@/lib/format-location-date";
import type {
  LocationDetailPageContent,
  LocationFeature,
  LocationInformationBlock,
  LocationScheduleDay,
  LocationTicketRelease,
} from "@/types/location-detail";
import type { LocationListItem } from "@/types/locations";

const displayHeadingClass =
  "font-display text-[2.5rem] uppercase leading-[2.625rem] [text-wrap:balance]";
const bodyClass = "font-body text-[1.0625rem] leading-[1.3] tracking-body";
const textLinkClass =
  "inline-flex min-h-11 touch-manipulation items-start py-1 font-body text-[1.0625rem] font-medium leading-[1.1] underline underline-offset-2 [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export interface LocationDetailPageProps {
  content: LocationDetailPageContent;
}

export function LocationDetailPage({ content }: LocationDetailPageProps) {
  return (
    <main className="flex-1 overflow-x-hidden bg-black text-white">
      <div className="mx-auto w-full max-w-[25.125rem]">
        <LocationVideoHero media={content.hero} />

        <div className="px-4 pb-24 pt-8">
          <LocationIntroduction content={content} />
          <LocationFeatures features={content.features} />
          <LocationSchedule
            title={content.schedule.title}
            days={content.schedule.days}
          />
          <LocationTicketInfo ticketInfo={content.ticketInfo} />
          <LocationImportantInformation
            information={content.importantInformation}
          />
        </div>
      </div>
    </main>
  );
}

function LocationIntroduction({
  content,
}: {
  content: LocationDetailPageContent;
}) {
  return (
    <header>
      <DisplayHeading
        as="h1"
        text={content.city}
        className="box-border max-w-full px-[0.08em] font-display text-[3.125rem] uppercase leading-[2.625rem] [text-wrap:balance]"
      />

      <div className="mt-[0.9375rem] grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <p className={bodyClass}>
          {formatLocationDateRange(content.dates)}
          <br />
          {content.venueName}
        </p>
        <a
          href={content.primaryAction.href}
          className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-white px-4 font-body text-[1.0625rem] font-medium leading-none tracking-body transition-colors duration-150 [-webkit-tap-highlight-color:transparent] hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:bg-white/15 motion-reduce:transition-none"
        >
          {content.primaryAction.label}
        </a>
      </div>

      <p className={`${bodyClass} mt-[1.5625rem]`}>{content.introduction}</p>
    </header>
  );
}

function LocationFeatures({
  features,
}: {
  features: readonly LocationFeature[];
}) {
  return (
    <section aria-label="What to expect" className="mt-[3.375rem] space-y-[1.875rem]">
      {features.map((feature) => (
        <article key={feature.id}>
          <Image
            src={feature.image.src}
            alt={feature.image.alt}
            width={feature.image.width}
            height={feature.image.height}
            sizes="(max-width: 479px) calc(100vw - 2rem), 0px"
            className="aspect-[3/2] w-full object-cover"
          />
          <DisplayHeading
            as="h2"
            text={feature.title}
            className={`${displayHeadingClass} mt-2`}
          />
          <p className={`${bodyClass} mt-2`}>{feature.description}</p>
        </article>
      ))}
    </section>
  );
}

function LocationSchedule({
  title,
  days,
}: {
  title: string;
  days: readonly LocationScheduleDay[];
}) {
  return (
    <section aria-labelledby="schedule-title" className="mt-10">
      <DisplayHeading
        as="h2"
        id="schedule-title"
        text={title}
        className={displayHeadingClass}
      />
      <div className="mt-5 space-y-6">
        {days.map((day) => (
          <section key={day.date} aria-labelledby={`schedule-${day.date}`}>
            <h3
              id={`schedule-${day.date}`}
              className="px-1 font-nav text-[0.9375rem] font-bold leading-[1.5]"
            >
              {formatScheduleDate(day.date)}
            </h3>
            <dl className="font-nav text-[0.9375rem] uppercase leading-[1.5]">
              {day.sessions.map((session) => (
                <div
                  key={session.id}
                  className="grid min-h-[1.4375rem] grid-cols-[minmax(0,1fr)_auto] gap-2 px-1 odd:bg-[#d9d9d9]/20"
                >
                  <dt className="min-w-0 break-words">{session.category}</dt>
                  <dd className="whitespace-nowrap tabular-nums">
                    {formatScheduleTime(session.startTime)} -{" "}
                    {formatScheduleTime(session.endTime)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </section>
  );
}

function LocationTicketInfo({
  ticketInfo,
}: {
  ticketInfo: LocationDetailPageContent["ticketInfo"];
}) {
  return (
    <section
      id={ticketInfo.id}
      aria-labelledby={`${ticketInfo.id}-title`}
      className="scroll-mt-nav-offset mt-10"
    >
      <DisplayHeading
        as="h2"
        id={`${ticketInfo.id}-title`}
        text={ticketInfo.title}
        className={displayHeadingClass}
      />
      <div className="mt-[0.9375rem] space-y-[0.9375rem]">
        {ticketInfo.releases.map((release) => (
          <TicketRelease key={release.id} release={release} />
        ))}
      </div>
    </section>
  );
}

function TicketRelease({ release }: { release: LocationTicketRelease }) {
  return (
    <article className={bodyClass}>
      <h3 className="font-medium">{release.title}</h3>
      <p>
        {release.description}
        <br />
        <time dateTime={release.releaseDate}>
          {formatLocationDate(release.releaseDate)}
        </time>
      </p>
      {release.action ? (
        <a href={release.action.href} className={`${textLinkClass} mt-2`}>
          {release.action.label}
        </a>
      ) : null}
    </article>
  );
}

function LocationImportantInformation({
  information,
}: {
  information: LocationDetailPageContent["importantInformation"];
}) {
  return (
    <section aria-labelledby="important-info-title" className="mt-10">
      <DisplayHeading
        as="h2"
        id="important-info-title"
        text={information.title}
        className={displayHeadingClass}
      />
      <div className="mt-[0.9375rem] space-y-[0.9375rem]">
        {information.blocks.map((block) => (
          <InformationBlock key={block.id} block={block} />
        ))}
        <div
          id="volunteer"
          className={`scroll-mt-nav-offset ${bodyClass}`}
        >
          <h3 className="font-medium">{information.volunteer.title}</h3>
          <p>{information.volunteer.description}</p>
          <ul className="list-disc pl-6">
            {information.volunteer.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
          <a
            href={information.volunteer.action.href}
            className={`${textLinkClass} mt-2`}
          >
            {information.volunteer.action.label}
          </a>
        </div>
      </div>
    </section>
  );
}

function InformationBlock({
  block,
}: {
  block: LocationInformationBlock;
}) {
  return (
    <article className={bodyClass}>
      <h3 className="font-medium">{block.title}</h3>
      <p>
        {block.lines.map((line, index) => (
          <span key={line} className="block">
            {index === block.lines.length - 1 && block.id === "location" ? (
              <span translate="no">{line}</span>
            ) : (
              line
            )}
          </span>
        ))}
      </p>
    </article>
  );
}

export interface LocationComingSoonProps {
  location: LocationListItem;
}

export function LocationComingSoon({ location }: LocationComingSoonProps) {
  return (
    <main className="flex min-h-dvh flex-1 bg-black px-4 pb-24 pt-nav-offset text-white">
      <div className="mx-auto w-full max-w-[25.125rem] pt-12">
        <DisplayHeading
          as="h1"
          text={location.city}
          className="box-border max-w-full px-[0.08em] font-display text-[3.125rem] uppercase leading-[0.84] [text-wrap:balance]"
        />
        <p className={`${bodyClass} mt-4`}>
          {formatLocationDateRange(location.dates)}
        </p>
        <p className={`${bodyClass} mt-8`}>Event details are coming soon.</p>
        <Link href="/locations" className={`${textLinkClass} mt-4`}>
          View All Locations
        </Link>
      </div>
    </main>
  );
}
