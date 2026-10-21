import { stegaClean } from "@sanity/client/stega";

/**
 * Owners XNarrow Black Italic, plus a little room for the slant.
 * Used only to keep a hero title inside the frame. It does not set the line breaks.
 */
const DISPLAY_EM_PER_CHAR = 0.42;

/** Words only. Line breaks and preview markers never reach the hero. */
export function heroWords(value: string): string {
  return stegaClean(value).replace(/\s+/g, " ").trim();
}

/** Width, in em, of one hero line. A longer CMS title scales down instead of overflowing. */
export function heroLineEm(line: string): number {
  return Math.max(heroWords(line).length, 1) * DISPLAY_EM_PER_CHAR;
}

/**
 * Locked mobile Home lockup: three lines. The known headline keeps its approved
 * breaks. Any other headline still stacks in three lines, so an editor's Enter
 * key cannot change the mobile composition.
 */
export function homeMobileHeading(value: string): string {
  const words = heroWords(value);

  if (/^enter the golf arena$/i.test(words)) return "ENTER\nTHE GOLF\nARENA";

  const parts = words.split(" ").filter(Boolean);

  if (parts.length <= 1) return words;
  if (parts.length === 2) return parts.join("\n");

  return `${parts[0]}\n${parts.slice(1, -1).join(" ")}\n${parts[parts.length - 1]}`;
}

/** Tablet and desktop Home: two lines, broken after the first "THE". */
export function homeWideHeading(value: string): string {
  const words = heroWords(value);
  return words.replace(/^(.*?\bTHE)\s+(.+)$/i, "$1\n$2");
}

export function homeWideLineEm(value: string): number {
  const lines = homeWideHeading(value).split("\n");
  return Math.max(...lines.map((line) => heroLineEm(line)));
}

/** Page heroes are one line from 768px. Challenges still stacks after the first word on phones. */
export function pageHeroHeading(value: string, stackOnMobile: boolean): string {
  const words = heroWords(value);

  if (!stackOnMobile) return words;

  const breakAt = words.indexOf(" ");

  if (breakAt === -1) return words;

  return `${words.slice(0, breakAt)}\n${words.slice(breakAt + 1)}`;
}
