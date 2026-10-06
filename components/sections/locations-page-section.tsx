import Link from "next/link";

import { formatLocationDateRange } from "@/lib/format-location-date";
import {
  LOCATION_SOLD_OUT_CLASS_NAME,
  locationActionClassName,
} from "@/lib/location-action";
import { cn } from "@/lib/utils";
import type {
  LocationListItem as LocationListItemData,
  LocationsPageContent,
} from "@/types/locations";

export interface LocationsPageSectionProps
  extends React.HTMLAttributes<HTMLElement> {
  pageContent: LocationsPageContent;
}

// Sizes ramp from the mobile frame (402px) to the desktop frame (1680px) across the tablet range.
const TEXT_DATE =
  "text-[1.0625rem] min-[768px]:text-[clamp(1.0625rem,calc(0.40625rem+1.3671875vw),1.5rem)] min-[1280px]:text-[1.5rem]";

export function LocationsPageSection({
  pageContent,
  className,
  ...props
}: LocationsPageSectionProps) {
  return (
    <section
      className={cn(
        "bg-black px-4 py-[4.375rem] text-white min-[768px]:px-tablet-gutter min-[768px]:py-[clamp(4.375rem,calc(15.55vw-3.09rem),9.352rem)] min-[1280px]:px-[5%] min-[1280px]:py-[9.352rem]",
        className,
      )}
      {...props}
    >
      <div className="w-full">
        {pageContent.locations.length > 0 ? (
          <LocationList locations={pageContent.locations} />
        ) : (
          <p
            className={cn(
              TEXT_DATE,
              "border-y border-white py-6 font-body leading-[1.3] tracking-body",
            )}
          >
            {pageContent.emptyState}
          </p>
        )}
      </div>
    </section>
  );
}

export interface LocationListProps {
  locations: readonly LocationListItemData[];
}

export function LocationList({ locations }: LocationListProps) {
  return (
    <ul aria-label="SwingRush locations" className="flex flex-col">
      {locations.map((location) => (
        <li
          key={location.id}
          // The divider is painted over the row padding, so it adds no height (as in the frame).
          className="relative after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white after:content-[''] last:after:hidden min-[1280px]:after:h-[1.874px]"
        >
          <LocationListItem location={location} />
        </li>
      ))}
    </ul>
  );
}

export interface LocationListItemProps {
  location: LocationListItemData;
}

const ROW_CLASS_NAME =
  "flex touch-manipulation items-end justify-between gap-4 py-2.5 [-webkit-tap-highlight-color:transparent] min-[768px]:gap-6 min-[768px]:py-[clamp(0.625rem,calc(1.707vw-0.1944rem),1.1714rem)] min-[1280px]:gap-[1.875rem] min-[1280px]:py-[1.1714rem]";

export function LocationListItem({ location }: LocationListItemProps) {
  const dateLabel = formatLocationDateRange(location.dates);

  return (
    <>
      <Link
        href={location.cta.href}
        className={cn(
          ROW_CLASS_NAME,
          "group transition-colors duration-150 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand motion-reduce:transition-none min-[1280px]:hidden",
        )}
      >
        <LocationListItemDetails city={location.city} dateLabel={dateLabel} startDate={location.dates.startDate} />
        <LocationListItemAction
          cta={location.cta}
          status={location.status}
          variant="mobile"
        />
      </Link>

      <div className={cn(ROW_CLASS_NAME, "hidden min-[1280px]:flex")}>
        <LocationListItemDetails city={location.city} dateLabel={dateLabel} startDate={location.dates.startDate} />
        <LocationListItemAction
          cta={location.cta}
          status={location.status}
          variant="desktop"
        />
      </div>
    </>
  );
}

interface LocationListItemDetailsProps {
  city: string;
  dateLabel: string;
  startDate: string;
}

function LocationListItemDetails({
  city,
  dateLabel,
  startDate,
}: LocationListItemDetailsProps) {
  return (
    <span className="flex min-w-0 flex-1 flex-col gap-1 min-[768px]:gap-[clamp(0.25rem,calc(0.0625rem+0.4vw),0.46856rem)] min-[1280px]:gap-[0.46856rem]">
      <h2
        className="break-words font-display text-[min(2.5rem,calc((100vw-11.5625rem)/5.4))] uppercase leading-[1.05] min-[768px]:text-[clamp(2.5rem,calc(6.836vw-0.78rem),4.6875rem)] min-[1280px]:text-[4.6875rem] min-[1280px]:leading-[1.0533]"
        translate="no"
      >
        {city}
      </h2>
      <time
        dateTime={startDate}
        className={cn(TEXT_DATE, "font-body leading-[1.3] tracking-body min-[768px]:min-h-[2.125rem]")}
      >
        {dateLabel}
      </time>
    </span>
  );
}

interface LocationListItemActionProps {
  cta: LocationListItemData["cta"];
  status: LocationListItemData["status"];
  variant: "mobile" | "desktop";
}

function LocationListItemAction({
  cta,
  status,
  variant,
}: LocationListItemActionProps) {
  const actionClassName = cn(
    locationActionClassName(status),
    "mb-1.5 min-[768px]:mb-0",
    variant === "mobile" &&
      status !== "register" &&
      "group-hover:border-black group-hover:text-black",
    variant === "desktop" &&
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
    variant === "desktop" &&
      (status === "register"
        ? "transition-colors duration-150 hover:border-brand-dark hover:bg-brand-dark motion-reduce:transition-none"
        : "transition-colors duration-150 hover:bg-white hover:text-black motion-reduce:transition-none"),
  );

  return (
    <span className="flex shrink-0 flex-col items-end min-[1280px]:gap-[0.46856rem]">
      {status === "soldOut" ? (
        <span className={LOCATION_SOLD_OUT_CLASS_NAME}>Sold out</span>
      ) : null}
      {variant === "desktop" ? (
        <Link href={cta.href} className={actionClassName}>
          {cta.label}
        </Link>
      ) : (
        <span className={actionClassName}>{cta.label}</span>
      )}
    </span>
  );
}
