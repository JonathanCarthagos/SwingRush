import Image from "next/image";
import Link from "next/link";

import { LocationVideoHero } from "@/components/sections/location-video-hero";
import { AnchorScrollLink } from "@/components/ui/anchor-scroll-link";
import { buttonVariants } from "@/components/ui/button";
import { DisplayHeading } from "@/components/ui/display-heading";
import {
  formatLocationDate,
  formatLocationDateRange,
  formatScheduleDate,
  formatScheduleTime,
} from "@/lib/format-location-date";
import { cn } from "@/lib/utils";
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
      <div className="mx-auto w-full max-w-[25.125rem] min-[1280px]:max-w-none">
        <LocationVideoHero media={content.hero} title={content.city} />

        <div className="px-4 pb-24 pt-8 min-[1280px]:hidden">
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

      <DesktopLocationDetail content={content} />
    </main>
  );
}

const desktopHeadingClass =
  "font-display text-[4.6875rem] uppercase leading-[0.85] text-white";
const desktopBodyClass =
  "font-body text-[1.5rem] leading-[1.3] tracking-body text-white";
const desktopTextLinkClass =
  "inline-flex font-bold underline decoration-[7%] underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

function DesktopLocationDetail({
  content,
}: {
  content: LocationDetailPageContent;
}) {
  return (
    <div className="mx-auto hidden w-full max-w-[105rem] px-desktop-gutter min-[1280px]:block">
      <div className="flex flex-col gap-[8.125rem] py-[8.125rem]">
        <DesktopLocationMeta content={content} />
        <DesktopLocationFeatures features={content.features} />
        <div className="flex flex-col gap-[7.5rem]">
          <DesktopLocationSchedule
            title={content.schedule.title}
            days={content.schedule.days}
          />
          <DesktopLocationTicketInfo ticketInfo={content.ticketInfo} />
          <DesktopLocationImportantInformation
            information={content.importantInformation}
          />
        </div>
      </div>
    </div>
  );
}

function DesktopLocationMeta({
  content,
}: {
  content: LocationDetailPageContent;
}) {
  return (
    <div className="flex max-w-[48rem] flex-col gap-6">
      <div className="flex flex-col items-start gap-6">
        <p className={desktopBodyClass}>
          <span className="font-bold">
            {formatLocationDateRange(content.dates)}
          </span>
          <br />
          {content.venueName}
        </p>
        <AnchorScrollLink
          href={content.primaryAction.href}
          className={buttonVariants({ variant: "outline-white" })}
        >
          {content.primaryAction.label}
        </AnchorScrollLink>
      </div>
      <p className={desktopBodyClass}>{content.introduction}</p>
    </div>
  );
}

function DesktopLocationFeatures({
  features,
}: {
  features: readonly LocationFeature[];
}) {
  if (features.length === 0) return null;

  return (
    <div className="flex flex-col gap-[5.625rem]">
      {features.map((feature, index) => (
        <DesktopFeatureRow
          key={feature.id}
          feature={feature}
          reverse={index % 2 === 1}
        />
      ))}
    </div>
  );
}

function DesktopFeatureRow({
  feature,
  reverse,
}: {
  feature: LocationFeature;
  reverse: boolean;
}) {
  return (
    <article className="grid grid-cols-2 items-center gap-x-16">
      <div className={reverse ? "order-1" : "order-2"}>
        <Image
          src={feature.image.src}
          alt={feature.image.alt}
          width={feature.image.width}
          height={feature.image.height}
          sizes="(min-width: 1280px) 50vw, 100vw"
          className="aspect-[3/2] w-full object-cover"
        />
      </div>
      <div
        className={cn(
          "flex min-w-0 flex-col gap-[1.125rem]",
          reverse ? "order-2" : "order-1",
        )}
      >
        <DisplayHeading
          as="h2"
          text={feature.title}
          className={desktopHeadingClass}
        />
        <p className={desktopBodyClass}>{feature.description}</p>
      </div>
    </article>
  );
}

function DesktopLocationSchedule({
  title,
  days,
}: {
  title: string;
  days: readonly LocationScheduleDay[];
}) {
  if (days.length === 0) return null;

  return (
    <section
      aria-labelledby="schedule-title-desktop"
      className="grid grid-cols-2 items-start gap-x-16"
    >
      <DisplayHeading
        as="h2"
        id="schedule-title-desktop"
        text={title}
        className={desktopHeadingClass}
      />
      <div className="flex min-w-0 flex-col gap-[1.875rem]">
        {days.map((day) => (
          <div key={day.date}>
            <h3 className="px-[0.625rem] font-nav text-[1.375rem] font-bold uppercase leading-[1.3] tracking-nav text-white">
              {formatScheduleDate(day.date)}
            </h3>
            <dl className="font-nav text-[1.375rem] uppercase leading-[1.3] tracking-nav text-white">
              {day.sessions.map((session) => (
                <div
                  key={session.id}
                  className="grid min-h-[1.75rem] grid-cols-[minmax(0,1fr)_auto] gap-5 px-[0.625rem] odd:bg-[#d9d9d9]/20"
                >
                  <dt className="min-w-0 break-words">{session.category}</dt>
                  <dd className="whitespace-nowrap tabular-nums">
                    {formatScheduleTime(session.startTime)} -{" "}
                    {formatScheduleTime(session.endTime)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

function DesktopLocationTicketInfo({
  ticketInfo,
}: {
  ticketInfo: LocationDetailPageContent["ticketInfo"];
}) {
  if (ticketInfo.releases.length === 0) return null;

  return (
    <section
      id={ticketInfo.id}
      aria-labelledby={`${ticketInfo.id}-title-desktop`}
      className="grid scroll-mt-24 grid-cols-2 items-start gap-x-16"
    >
      <DisplayHeading
        as="h2"
        id={`${ticketInfo.id}-title-desktop`}
        text={ticketInfo.title}
        className={desktopHeadingClass}
      />
      <div className="flex min-w-0 flex-col gap-7">
        {ticketInfo.releases.map((release) => (
          <DesktopTicketRelease key={release.id} release={release} />
        ))}
      </div>
    </section>
  );
}

function DesktopTicketRelease({ release }: { release: LocationTicketRelease }) {
  return (
    <article className={desktopBodyClass}>
      <h3 className="font-bold">{release.title}</h3>
      <p>
        {release.description}
        <br />
        <time dateTime={release.releaseDate}>
          {formatLocationDate(release.releaseDate)}
        </time>
      </p>
      {release.action ? (
        <AnchorScrollLink
          href={release.action.href}
          className={`${desktopTextLinkClass} mt-2`}
        >
          {release.action.label}
        </AnchorScrollLink>
      ) : null}
    </article>
  );
}

function DesktopLocationImportantInformation({
  information,
}: {
  information: LocationDetailPageContent["importantInformation"];
}) {
  const { volunteer } = information;

  if (information.blocks.length === 0 && !volunteer) return null;

  return (
    <section
      aria-labelledby="important-info-title-desktop"
      className="grid grid-cols-2 items-start gap-x-16"
    >
      <DisplayHeading
        as="h2"
        id="important-info-title-desktop"
        text={information.title}
        className={desktopHeadingClass}
      />
      <div className="flex min-w-0 flex-col gap-7">
        {information.blocks.map((block) => (
          <DesktopInformationBlock key={block.id} block={block} />
        ))}
        {volunteer ? (
          <div id="volunteer" className={`scroll-mt-24 ${desktopBodyClass}`}>
            <h3 className="font-bold">{volunteer.title}</h3>
            <p>{volunteer.description}</p>
            <ul className="list-disc pl-6">
              {volunteer.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
            <AnchorScrollLink
              href={volunteer.action.href}
              className={`${desktopTextLinkClass} mt-2`}
            >
              {volunteer.action.label}
            </AnchorScrollLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function DesktopInformationBlock({
  block,
}: {
  block: LocationInformationBlock;
}) {
  return (
    <article className={desktopBodyClass}>
      <h3 className="font-bold">{block.title}</h3>
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
          className={buttonVariants({ variant: "outline-white" })}
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
  if (features.length === 0) return null;

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
  if (days.length === 0) return null;

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
  if (ticketInfo.releases.length === 0) return null;

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
  const { volunteer } = information;

  if (information.blocks.length === 0 && !volunteer) return null;

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
        {volunteer ? (
          <div
            id="volunteer"
            className={`scroll-mt-nav-offset ${bodyClass}`}
          >
            <h3 className="font-medium">{volunteer.title}</h3>
            <p>{volunteer.description}</p>
            <ul className="list-disc pl-6">
              {volunteer.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
            <a
              href={volunteer.action.href}
              className={`${textLinkClass} mt-2`}
            >
              {volunteer.action.label}
            </a>
          </div>
        ) : null}
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
    <main className="flex min-h-dvh flex-1 bg-black px-4 pb-24 pt-nav-offset text-white min-[1280px]:px-0 min-[1280px]:pb-0 min-[1280px]:pt-0">
      <div className="mx-auto w-full max-w-[25.125rem] pt-12 min-[1280px]:hidden">
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

      <div className="mx-auto hidden w-full max-w-[105rem] flex-col items-start justify-center px-desktop-gutter pb-24 pt-24 min-[1280px]:flex">
        <DisplayHeading
          as="h1"
          text={location.city}
          className="box-border max-w-full px-[0.08em] font-display text-location-city-desktop uppercase"
        />
        <p className="mt-6 font-body text-location-meta-desktop text-white">
          {formatLocationDateRange(location.dates)}
        </p>
        <p className="mt-10 font-body text-location-meta-desktop text-white">
          Event details are coming soon.
        </p>
        <Link
          href="/locations"
          className="mt-6 inline-flex font-body text-location-meta-desktop font-bold text-white underline decoration-[7%] underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          View All Locations
        </Link>
      </div>
    </main>
  );
}
