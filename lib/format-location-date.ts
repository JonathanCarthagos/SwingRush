import type { IsoDate, IsoTime } from "@/types/location-detail";
import type { LocationDateRange } from "@/types/locations";

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  timeZone: "UTC",
});

const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const scheduleDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  hour12: true,
  timeZone: "UTC",
});

function parseDate(date: IsoDate) {
  return new Date(`${date}T00:00:00Z`);
}

export function formatLocationDateRange({
  startDate,
  endDate,
}: LocationDateRange) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth();

  if (sameMonth) {
    return `${monthFormatter.format(start)} ${start.getUTCDate()} - ${end.getUTCDate()}, ${end.getUTCFullYear()}`;
  }

  if (sameYear) {
    return `${monthFormatter.format(start)} ${start.getUTCDate()} - ${monthFormatter.format(end)} ${end.getUTCDate()}, ${end.getUTCFullYear()}`;
  }

  return `${fullDateFormatter.format(start)} - ${fullDateFormatter.format(end)}`;
}

export function formatLocationDate(date: IsoDate) {
  return fullDateFormatter.format(parseDate(date));
}

export function formatScheduleDate(date: IsoDate) {
  return scheduleDateFormatter.format(parseDate(date));
}

export function formatScheduleTime(time: IsoTime) {
  return timeFormatter.format(new Date(`1970-01-01T${time}:00Z`));
}
