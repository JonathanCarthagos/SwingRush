import Link from "next/link";

import { DisplayHeading } from "@/components/ui/display-heading";
import { formatLocationDateRange } from "@/lib/format-location-date";
import { cn } from "@/lib/utils";
import type {
  LocationListItem as LocationListItemData,
  LocationsPageContent,
} from "@/types/locations";

export interface LocationsPageSectionProps
  extends React.HTMLAttributes<HTMLElement> {
  pageContent: LocationsPageContent;
}

export function LocationsPageSection({
  pageContent,
  className,
  ...props
}: LocationsPageSectionProps) {
  return (
    <section
      className={cn(
        "bg-black px-4 pb-24 pt-nav-offset text-white min-[1280px]:px-0 min-[1280px]:pb-0 min-[1280px]:pt-0",
        className,
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-[25.125rem] pt-10 min-[1280px]:hidden">
        <DisplayHeading
          as="h1"
          text={pageContent.title}
          className="box-border max-w-full px-[0.08em] font-display text-[2.5rem] uppercase leading-[0.86] [text-wrap:balance]"
        />
        <p className="mt-3 max-w-[23.125rem] text-pretty font-body text-base leading-[1.18] tracking-body">
          {pageContent.introduction}
        </p>

        <div className="mt-16">
          {pageContent.locations.length > 0 ? (
            <LocationList locations={pageContent.locations} />
          ) : (
            <p className="border-y border-white/45 py-6 font-body text-base leading-[1.25] tracking-body">
              {pageContent.emptyState}
            </p>
          )}
        </div>
      </div>

      <DesktopLocations pageContent={pageContent} />
    </section>
  );
}

function DesktopLocations({
  pageContent,
}: Pick<LocationsPageSectionProps, "pageContent">) {
  return (
    <div
      data-locations-desktop
      className="mx-auto hidden w-full max-w-[105rem] grid-cols-[minmax(0,749fr)_minmax(0,637fr)] gap-x-locations-desktop-gap px-desktop-gutter min-[1280px]:grid"
    >
      <aside className="sticky top-0 min-w-0 self-start pt-[10.8786rem]">
        <header className="flex min-w-0 flex-col gap-6">
          <DisplayHeading
            as="h1"
            text={pageContent.title}
            className="max-w-[43.7597rem] font-display text-locations-title-desktop uppercase"
          />
          <p className="max-w-full font-body text-locations-intro-desktop">
            {pageContent.introduction}
          </p>
        </header>
      </aside>

      <div className="min-w-0 pb-locations-desktop-pb pt-[10.875rem]">
        {pageContent.locations.length > 0 ? (
          <DesktopLocationList locations={pageContent.locations} />
        ) : (
          <p className="border-y-[1.874px] border-white py-location-row-py font-body text-location-meta-desktop">
            {pageContent.emptyState}
          </p>
        )}
      </div>
    </div>
  );
}

function DesktopLocationList({ locations }: LocationListProps) {
  return (
    <ul
      aria-label="SwingRush locations"
      className="relative before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-[1.874px] before:bg-white before:content-['']"
    >
      {locations.map((location) => (
        <li
          key={location.id}
          className="relative h-location-row-h after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-[1.874px] after:bg-white after:content-['']"
        >
          <DesktopLocationListItem location={location} />
        </li>
      ))}
    </ul>
  );
}

function DesktopLocationListItem({ location }: LocationListItemProps) {
  const dateLabel = formatLocationDateRange(location.dates);

  return (
    <Link
      href={location.cta.href}
      className="group flex h-full min-w-0 flex-col gap-location-row-gap py-location-row-py transition-colors duration-150 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand motion-reduce:transition-none"
    >
      <h2
        className="min-w-0 break-words font-display text-location-city-desktop uppercase"
        translate="no"
      >
        {location.city}
      </h2>
      <span className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,48.187%)] items-end gap-location-row-gap font-body text-location-meta-desktop">
        <time dateTime={location.dates.startDate} className="min-w-0">
          {dateLabel}
        </time>
        <span className="text-right font-bold underline decoration-[7%] underline-offset-2">
          {location.cta.label}
        </span>
      </span>
    </Link>
  );
}

export interface LocationListProps {
  locations: readonly LocationListItemData[];
}

export function LocationList({ locations }: LocationListProps) {
  return (
    <ul aria-label="SwingRush locations" className="border-t border-white/45">
      {locations.map((location) => (
        <li key={location.id} className="border-b border-white/45">
          <LocationListItem location={location} />
        </li>
      ))}
    </ul>
  );
}

export interface LocationListItemProps {
  location: LocationListItemData;
}

export function LocationListItem({ location }: LocationListItemProps) {
  const dateLabel = formatLocationDateRange(location.dates);

  return (
    <Link
      href={location.cta.href}
      className="group flex min-h-[5.5rem] touch-manipulation flex-col justify-between py-4 transition-colors duration-150 [-webkit-tap-highlight-color:transparent] hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand active:bg-white/10 motion-reduce:transition-none"
    >
      <h2
        className="min-w-0 break-words font-display text-[1.875rem] uppercase leading-[0.86]"
        translate="no"
      >
        {location.city}
      </h2>
      <span className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-end gap-3 font-body text-[0.8125rem] leading-none tracking-body">
        <time dateTime={location.dates.startDate} className="min-w-0">
          {dateLabel}
        </time>
        <span className="font-medium underline underline-offset-2">
          {location.cta.label}
        </span>
      </span>
    </Link>
  );
}
