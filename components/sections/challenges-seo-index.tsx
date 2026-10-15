import type { ChallengeItem } from "@/types/challenges";

export interface ChallengesSeoIndexProps {
  items: readonly ChallengeItem[];
}

/**
 * Always-on copy for crawlers below 1280px, where the accordion mounts panels only when open.
 * Visually hidden; desktop uses the full split-flap layout in the DOM.
 */
export function ChallengesSeoIndex({ items }: ChallengesSeoIndexProps) {
  if (items.length === 0) return null;

  return (
    <div className="sr-only min-[1280px]:hidden">
      <h2>Skills challenges</h2>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <h3>
              {item.number}. {item.title}
            </h3>
            <p>{item.description}</p>
            <p>
              {item.club} · {item.shot} · {item.distance}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
