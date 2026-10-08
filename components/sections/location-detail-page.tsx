import { LocationVideoHero } from "@/components/sections/location-video-hero";
import { AnchorScrollLink } from "@/components/ui/anchor-scroll-link";
import { DisplayHeading } from "@/components/ui/display-heading";
import {
  formatLocationDate,
  formatLocationDateRange,
  formatScheduleDate,
  formatScheduleTime,
} from "@/lib/format-location-date";
import {
  LOCATION_SOLD_OUT_CLASS_NAME,
  locationActionClassName,
} from "@/lib/location-action";
import { cn } from "@/lib/utils";
import type {
  LocationDetailPageContent,
  LocationInformationBlock,
  LocationScheduleDay,
  LocationTicketRelease,
} from "@/types/location-detail";

// Type and spacing ramp from the mobile frame (402px) to the desktop frame (1680px) across the tablet range.
const TEXT_BODY =
  "font-body text-[1.0625rem] min-[768px]:text-[clamp(1.0625rem,calc(0.40625rem+1.3671875vw),1.5rem)] min-[1280px]:text-[1.5rem]";
const TEXT_SUBHEAD =
  "font-body text-[1.0625rem] min-[768px]:text-[clamp(1.0625rem,calc(2.539vw-0.15625rem),1.875rem)] min-[1280px]:text-[1.875rem]";
const SECTION_HEADING =
  "font-display text-[2.5rem] uppercase leading-[1.05] min-[768px]:text-[clamp(2.5rem,calc(6.836vw-0.78rem),4.6875rem)] min-[1280px]:text-[4.6875rem] min-[1280px]:leading-[0.85]";
const TEXT_LINK =
  "inline-flex min-h-[1.8045rem] touch-manipulation items-start font-bold leading-[1.1] underline decoration-[7%] underline-offset-2 [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand min-[1280px]:h-[1.8045rem] min-[1280px]:leading-[1.3]";
// Title above content below 1280px; title and content side by side (768 + 20 + 768 at 1680) from 1280px.
const SPLIT_SECTION =
  "flex flex-col min-[1280px]:grid min-[1280px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] min-[1280px]:items-start min-[1280px]:gap-x-5 min-[1280px]:gap-y-0";
const SCROLL_MARGIN =
  "scroll-mt-nav-offset min-[768px]:scroll-mt-[clamp(3.375rem,calc(-0.5625rem+8.203125vw),6rem)] min-[1280px]:scroll-mt-24";
// The time column is a share of the row (121.5px at 402, 243px at 1680) so long categories never clip.
const SCHEDULE_ROW =
  "grid h-[2.2269rem] grid-cols-[minmax(0,1fr)_33.49%] items-center gap-x-[0.894rem] pl-[0.4472rem] min-[768px]:h-[clamp(2.2269rem,calc(1.442rem+1.635vw),2.75rem)] min-[768px]:grid-cols-[minmax(0,1fr)_32.06%] min-[768px]:gap-x-[clamp(0.894rem,calc(0.359rem+1.113vw),1.25rem)] min-[768px]:pl-[clamp(0.4472rem,calc(0.18rem+0.557vw),0.625rem)] min-[1280px]:h-11 min-[1280px]:gap-x-5 min-[1280px]:pl-[0.625rem]";

export interface LocationDetailPageProps {
  content: LocationDetailPageContent;
}

export function LocationDetailPage({ content }: LocationDetailPageProps) {
  return (
    <main id="main" className="flex-1 overflow-x-hidden bg-black text-white">
      <LocationVideoHero media={content.hero} title={content.city} />

      <div className="mx-auto w-full max-w-[105rem] px-4 py-20 min-[768px]:px-tablet-gutter min-[768px]:py-[clamp(5rem,calc(1.25rem+7.8125vw),7.5rem)] min-[1280px]:px-desktop-gutter min-[1280px]:py-[7.5rem]">
        <div className="flex flex-col gap-[3.75rem] min-[768px]:mx-auto min-[768px]:max-w-challenge-tablet-copy min-[768px]:gap-[clamp(3.75rem,calc(13.67vw-2.8125rem),8.125rem)] min-[1280px]:max-w-none min-[1280px]:gap-[8.125rem]">
          <LocationIntroduction content={content} />

          <div className="flex flex-col gap-[3.75rem] min-[768px]:gap-[clamp(3.75rem,calc(11.72vw-1.875rem),7.5rem)] min-[1280px]:gap-[7.5rem]">
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
      </div>
    </main>
  );
}

function LocationIntroduction({
  content,
}: {
  content: LocationDetailPageContent;
}) {
  const { primaryAction, status } = content;

  return (
    <header className="flex flex-col">
      {/* Desktop shows the city in the hero instead. */}
      <DisplayHeading
        as="h1"
        text={content.city}
        className="box-border max-w-full px-[0.08em] font-display text-[3.125rem] uppercase leading-[0.84] [text-wrap:balance] min-[768px]:text-[clamp(3.125rem,calc(0.78125rem+4.8828125vw),4.6875rem)] min-[1280px]:hidden"
      />

      <div className="mt-[0.9375rem] grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 min-[1280px]:mt-0 min-[1280px]:flex min-[1280px]:flex-col min-[1280px]:items-start min-[1280px]:gap-6">
        <p className={cn(TEXT_SUBHEAD, "leading-[1.3] tracking-body")}>
          <span className="block min-[1280px]:font-bold">
            {formatLocationDateRange(content.dates)}
          </span>
          <span className="block min-[1280px]:leading-[1.8125rem]">
            {content.venueName}
          </span>
        </p>

        <div className="flex flex-col items-end min-[1280px]:items-start">
          {status === "soldOut" ? (
            <span className={LOCATION_SOLD_OUT_CLASS_NAME}>Sold out</span>
          ) : null}
          <AnchorScrollLink
            href={primaryAction.href}
            className={cn(
              locationActionClassName(status),
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              status === "register"
                ? "hover:border-brand-dark hover:bg-brand-dark"
                : "hover:bg-white hover:text-black",
            )}
          >
            {primaryAction.label}
          </AnchorScrollLink>
        </div>
      </div>

      <p
        className={cn(
          TEXT_SUBHEAD,
          "mt-[1.5625rem] leading-[1.3] tracking-body min-[1280px]:mt-6 min-[1280px]:max-w-[48rem]",
        )}
      >
        {content.introduction}
      </p>
    </header>
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
    <section
      aria-labelledby="schedule-title"
      className={cn(SPLIT_SECTION, "gap-y-[1.125rem]")}
    >
      <DisplayHeading
        as="h2"
        id="schedule-title"
        text={title}
        className={SECTION_HEADING}
      />
      <div className="flex min-w-0 flex-col gap-[1.3415rem] font-nav text-[min(0.9375rem,calc((100vw-3.3125rem)/22.5))] uppercase leading-[1.5] tracking-nav min-[768px]:gap-[clamp(1.3415rem,calc(0.6833rem+1.3712vw),1.875rem)] min-[768px]:text-[clamp(0.9375rem,calc(0.28125rem+1.367vw),1.375rem)] min-[1280px]:gap-[1.875rem] min-[1280px]:text-[1.375rem] min-[1280px]:leading-[1.3]">
        {days.map((day) => (
          <section key={day.date} aria-labelledby={`schedule-${day.date}`}>
            <h3
              id={`schedule-${day.date}`}
              className="flex h-[2.2269rem] items-center pl-[0.4472rem] font-bold min-[768px]:h-[clamp(2.2269rem,calc(1.442rem+1.635vw),2.75rem)] min-[768px]:pl-[clamp(0.4472rem,calc(0.18rem+0.557vw),0.625rem)] min-[1280px]:h-11 min-[1280px]:pl-[0.625rem]"
            >
              {formatScheduleDate(day.date)}
            </h3>
            <dl>
              {day.sessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(SCHEDULE_ROW, "odd:bg-[#d9d9d9]/20")}
                >
                  <dt className="min-w-0 truncate">{session.category}</dt>
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
      className={cn(SPLIT_SECTION, SCROLL_MARGIN, "gap-y-[0.9375rem]")}
    >
      <DisplayHeading
        as="h2"
        id={`${ticketInfo.id}-title`}
        text={ticketInfo.title}
        className={SECTION_HEADING}
      />
      <div className="flex min-w-0 flex-col gap-[0.9375rem] min-[768px]:gap-[clamp(0.9375rem,calc(2.539vw-0.28125rem),1.75rem)] min-[1280px]:gap-7">
        {ticketInfo.releases.map((release) => (
          <TicketRelease key={release.id} release={release} />
        ))}
      </div>
    </section>
  );
}

function TicketRelease({ release }: { release: LocationTicketRelease }) {
  return (
    <article className={cn(TEXT_BODY, "leading-[1.3] tracking-body")}>
      <h3 className="font-bold leading-[1.1] min-[1280px]:leading-[1.3]">
        {release.title}
      </h3>
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
          className={cn(TEXT_LINK, "mt-1 min-[1280px]:mt-2.5")}
        >
          {release.action.label}
        </AnchorScrollLink>
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
    <section
      aria-labelledby="important-info-title"
      className={cn(SPLIT_SECTION, "gap-y-[0.9375rem]")}
    >
      <DisplayHeading
        as="h2"
        id="important-info-title"
        text={information.title}
        className={SECTION_HEADING}
      />
      <div className="flex min-w-0 flex-col gap-[0.9375rem] min-[768px]:gap-[clamp(0.9375rem,calc(0.4rem+1.119vw),1.2958rem)] min-[1280px]:gap-[1.2958rem]">
        {information.blocks.map((block) => (
          <InformationBlock key={block.id} block={block} />
        ))}
        {volunteer ? (
          <div
            id="volunteer"
            className={cn(TEXT_BODY, SCROLL_MARGIN, "leading-[1.3] tracking-body")}
          >
            <h3 className="font-bold leading-[1.1] min-[1280px]:leading-[1.3]">
              {volunteer.title}
            </h3>
            <p>{volunteer.description}</p>
            <ul className="list-disc pl-6">
              {volunteer.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
            <AnchorScrollLink
              href={volunteer.action.href}
              className={cn(TEXT_LINK, "mt-2 min-[1280px]:mt-[0.6875rem]")}
            >
              {volunteer.action.label}
            </AnchorScrollLink>
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
    <article className={cn(TEXT_BODY, "leading-[1.3] tracking-body")}>
      <h3 className="font-bold leading-[1.1] min-[1280px]:leading-[1.3]">
        {block.title}
      </h3>
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