import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { NOT_FOUND_CONTENT } from "@/data/not-found";
import { cn } from "@/lib/utils";

// Desktop values come from the 1680px frame; mobile follows the site's mobile type scale, ramped across the tablet range.
const STACK_GAP =
  "gap-5 min-[768px]:gap-[clamp(1.25rem,calc(2.34375vw+0.125rem),2rem)] min-[1280px]:gap-8";

export function NotFoundSection() {
  const { code, title, lines, action } = NOT_FOUND_CONTENT;

  return (
    <main className="flex flex-1 bg-black pt-nav-offset text-white min-[768px]:pt-[clamp(3.375rem,calc(-0.5625rem+8.203125vw),6rem)] min-[1280px]:pt-24">
      <div
        className={cn(
          "mx-auto flex w-full max-w-[105rem] flex-col items-center justify-center px-4 py-12 text-center min-[768px]:px-tablet-gutter min-[768px]:py-[clamp(3rem,calc(14.0625vw-3.75rem),7.5rem)] min-[1280px]:px-desktop-gutter min-[1280px]:py-[clamp(2.5rem,8dvh,7.5rem)]",
          STACK_GAP,
        )}
      >
        <p
          translate="no"
          className="notranslate px-[0.08em] font-display text-[11.25rem] leading-[0.84] min-[768px]:text-[clamp(11.25rem,23.4375vw,18.75rem)] min-[1280px]:text-[18.75rem]"
        >
          <span className="sr-only">Error </span>
          {code}
        </p>
        <h1 className="max-w-[13.45em] font-body text-2xl font-extrabold leading-none tracking-body [text-wrap:balance] min-[768px]:text-[clamp(1.5rem,3.125vw,2.5rem)] min-[1280px]:text-[2.5rem]">
          {title}
        </h1>
        <p className="font-body text-[1.0625rem] leading-[1.3] tracking-body [text-wrap:balance] min-[768px]:text-[clamp(1.0625rem,calc(2.9297vw-0.34375rem),2rem)] min-[1280px]:text-[2rem]">
          {lines.map((line, index) => (
            <span key={line} className="min-[768px]:block">
              {index > 0 ? " " : null}
              {line}
            </span>
          ))}
        </p>
        <Link
          href={action.href}
          className={cn(
            buttonVariants({ variant: "inverse" }),
            "h-[2.125rem] px-4 py-0 text-[0.875rem] whitespace-nowrap transition-opacity duration-150 hover:opacity-90 focus-visible:outline-white min-[768px]:px-[clamp(1rem,calc(1.09375vw+0.475rem),1.35rem)] min-[768px]:text-[clamp(0.875rem,calc(1.171875vw+0.3125rem),1.25rem)] min-[1280px]:px-[1.35rem] min-[1280px]:text-xl",
          )}
        >
          {action.label}
        </Link>
      </div>
    </main>
  );
}
