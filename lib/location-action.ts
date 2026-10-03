import { cn } from "@/lib/utils";
import type { LocationStatus } from "@/types/locations";

/**
 * Status button shared by the Locations list and the city page.
 * Sizes ramp from the mobile frame (137×34, 14px) to the desktop frame (192×34, 20px).
 */
export function locationActionClassName(status: LocationStatus) {
  return cn(
    "text-[0.875rem] min-[768px]:text-[clamp(0.875rem,calc(0.3125rem+1.172vw),1.25rem)] min-[1280px]:text-[1.25rem]",
    "flex h-[2.0625rem] w-[8.5625rem] shrink-0 items-center justify-center whitespace-nowrap border font-body font-medium uppercase leading-[1.1] tracking-[0.08em] transition-colors duration-150 motion-reduce:transition-none",
    "min-[768px]:h-[2.125rem] min-[768px]:w-[clamp(8.5625rem,calc(3.406rem+10.74vw),12rem)] min-[1280px]:w-[12rem] min-[1280px]:border-[1.08px]",
    status === "register"
      ? "border-brand bg-brand text-white"
      : "border-white text-white",
  );
}

export const LOCATION_SOLD_OUT_CLASS_NAME =
  "font-body text-[0.875rem] font-medium uppercase leading-[1.7] tracking-[0.03em] text-brand min-[768px]:flex min-[768px]:h-[clamp(1.5rem,calc(3.516vw-0.1875rem),2.625rem)] min-[768px]:items-center min-[768px]:text-[clamp(0.875rem,calc(0.0625rem+1.5625vw),1.5rem)] min-[768px]:leading-[1.3] min-[1280px]:h-[2.625rem] min-[1280px]:text-[1.5rem]";
