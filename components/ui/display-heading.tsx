import { cn } from "@/lib/utils";

type DisplayHeadingTag = "h1" | "h2" | "h3";

export interface DisplayHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  as: DisplayHeadingTag;
  text: string;
  lineClassName?: string;
  wordClassName?: string;
}

export function DisplayHeading({
  as: Heading,
  text,
  className,
  lineClassName,
  wordClassName,
  ...props
}: DisplayHeadingProps) {
  const lines = text.split(/\r?\n/).map((line) => line.trim());

  return (
    <Heading
      className={className ? `notranslate ${className}` : "notranslate"}
      aria-label={text.replace(/\s+/g, " ").trim()}
      translate="no"
      {...props}
    >
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className={cn("block", lineClassName)}
          aria-hidden="true"
        >
          <span className="relative inline-block align-bottom">
            <span className={cn("relative z-0", wordClassName)}>{line}</span>
          </span>
        </span>
      ))}
    </Heading>
  );
}
