import { stegaClean } from "@sanity/client/stega";

import { cn } from "@/lib/utils";

type DisplayHeadingTag = "h1" | "h2" | "h3";
type DisplayHeadingAlign = "center" | "start";

export interface DisplayHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  as: DisplayHeadingTag;
  text: string;
  align?: DisplayHeadingAlign;
  lineClassName?: string;
  wordClassName?: string;
  wrap?: boolean;
}

export function DisplayHeading({
  as: Heading,
  text,
  align = "start",
  className,
  lineClassName,
  wordClassName,
  wrap = false,
  ...props
}: DisplayHeadingProps) {
  // Draft mode (Sanity Studio) embeds invisible characters in CMS strings. They widen nowrap
  // display titles and push them off-center, and they pollute the aria-label, so strip them.
  const clean = stegaClean(text);
  const lines = clean.split(/\r?\n/).map((line) => line.trim());
  const isCentered = align === "center";

  return (
    <Heading
      className={cn(
        "notranslate",
        isCentered && "display-heading--center mx-auto w-fit max-w-full text-center",
        className,
      )}
      aria-label={clean.replace(/\s+/g, " ").trim()}
      translate="no"
      {...props}
    >
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className={cn("block", isCentered && "w-full text-center", lineClassName)}
          aria-hidden="true"
        >
          <span
            className={cn(
              "relative",
              wrap ? "block" : "inline-block align-bottom",
            )}
          >
            <span className={cn("relative z-0", wordClassName)}>{line}</span>
          </span>
        </span>
      ))}
    </Heading>
  );
}
