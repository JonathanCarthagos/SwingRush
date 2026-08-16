import type { IsoDate, IsoTime } from "@/types/location-detail";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ISO_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export function text(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function isoDate(value: string | null | undefined): IsoDate | undefined {
  const trimmed = text(value);
  return trimmed && ISO_DATE_PATTERN.test(trimmed)
    ? (trimmed as IsoDate)
    : undefined;
}

export function isoTime(value: string | null | undefined): IsoTime | undefined {
  const trimmed = text(value);
  return trimmed && ISO_TIME_PATTERN.test(trimmed)
    ? (trimmed as IsoTime)
    : undefined;
}

export function toId(value: string, fallback: string): string {
  const id = value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
  return id || fallback;
}

export function compact<T>(items: readonly (T | undefined)[]): T[] {
  return items.filter((item): item is T => item !== undefined);
}
