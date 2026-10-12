import { cn } from "@/lib/utils";
import type { LocationStatus } from "@/types/locations";

/**
 * Status button shared by the Locations list and the city page.
 * Sizes ramp from the mobile frame (137×34, 14px) to the desktop frame (192×34, 20px).
 */
// Same left-to-right brand fill as the shared Button, without changing this button's size.
const WAITLIST_HOVER_FILL =
  "relative isolate overflow-hidden border-white text-white [transition:color_480ms_cubic-bezier(0.23,1,0.32,1),border-color_480ms_cubic-bezier(0.23,1,0.32,1),transform_160ms_cubic-bezier(0.23,1,0.32,1)] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-brand before:content-[''] before:[transition:scale_480ms_cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)]:hover:border-brand [@media(hover:hover)]:hover:text-brand-deep [@media(hover:hover)]:hover:before:scale-x-100 focus-visible:border-brand focus-visible:text-brand-deep focus-visible:before:scale-x-100 active:scale-[0.97] motion-reduce:transition-none motion-reduce:before:transition-none motion-reduce:active:scale-100";

export function locationActionClassName(status: LocationStatus) {
  return cn(
    "text-[0.875rem] min-[768px]:text-[clamp(0.875rem,calc(0.3125rem+1.172vw),1.25rem)] min-[1280px]:text-[1.25rem]",
    "flex h-[2.0625rem] w-[8.5625rem] shrink-0 items-center justify-center whitespace-nowrap border font-body font-medium uppercase leading-[1.1] tracking-[0.08em]",
    "min-[768px]:h-[2.125rem] min-[768px]:w-[clamp(8.5625rem,calc(3.406rem+10.74vw),12rem)] min-[1280px]:w-[12rem] min-[1280px]:border-[1.08px]",
    status === "register"
      ? "border-brand bg-brand text-white transition-colors duration-150 motion-reduce:transition-none"
      : WAITLIST_HOVER_FILL,
  );
}

export const LOCATION_SOLD_OUT_CLASS_NAME =
  "font-body text-[0.875rem] font-medium uppercase leading-[1.7] tracking-[0.03em] text-brand min-[768px]:flex min-[768px]:h-[clamp(1.5rem,calc(3.516vw-0.1875rem),2.625rem)] min-[768px]:items-center min-[768px]:text-[clamp(0.875rem,calc(0.0625rem+1.5625vw),1.5rem)] min-[768px]:leading-[1.3] min-[1280px]:h-[2.625rem] min-[1280px]:text-[1.5rem]";
