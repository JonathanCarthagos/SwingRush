import {
  CHALLENGES_PAGE_CONTENT,
  CHALLENGE_PLACEHOLDER_IMAGE,
} from "@/data/challenges";
import { cmsFetch, type CmsReadOptions } from "@/lib/cms/fetch";
import { text } from "@/lib/cms/utils";
import { CHALLENGES_PAGE_QUERY } from "@/sanity/lib/queries";
import type { ChallengeItem, ChallengesPageContent } from "@/types/challenges";

interface RawChallenge {
  _id: string;
  slug?: string | null;
  sortOrder?: number | null;
  title?: string | null;
  club?: string | null;
  shot?: string | null;
  distance?: string | null;
  targetHeight?: { open?: string | null; elite?: string | null } | null;
  timeLimit?: string | null;
  description?: string | null;
  image?: { src?: string | null; alt?: string | null } | null;
}

interface RawChallengesPage {
  page?: {
    title?: string | null;
    introduction?: string | null;
    emptyState?: string | null;
    seo?: { title?: string | null; description?: string | null } | null;
  } | null;
  challenges?: RawChallenge[] | null;
}

function adaptChallenges(
  challenges: RawChallenge[] | null | undefined,
): ChallengeItem[] {
  if (!challenges?.length) return [];

  return challenges.flatMap((challenge, index) => {
    const title = text(challenge.title);
    if (!title) return [];

    const position = challenge.sortOrder ?? index + 1;

    return [
      {
        id: text(challenge.slug) ?? challenge._id,
        number: String(position).padStart(2, "0"),
        title,
        image: text(challenge.image?.src) ?? CHALLENGE_PLACEHOLDER_IMAGE,
        imageAlt: text(challenge.image?.alt) ?? "",
        club: text(challenge.club) ?? "",
        shot: text(challenge.shot) ?? "",
        distance: text(challenge.distance) ?? "",
        targetHeight: {
          open: text(challenge.targetHeight?.open) ?? "",
          elite: text(challenge.targetHeight?.elite) ?? "",
        },
        timeLimit: text(challenge.timeLimit) ?? "",
        description: text(challenge.description) ?? "",
      },
    ];
  });
}

function adaptChallengesPage(
  raw: RawChallengesPage | null,
): ChallengesPageContent {
  const fallback = CHALLENGES_PAGE_CONTENT;
  if (!raw) return fallback;

  const items = adaptChallenges(raw.challenges);

  return {
    seo: {
      title: text(raw.page?.seo?.title) ?? fallback.seo.title,
      description: text(raw.page?.seo?.description) ?? fallback.seo.description,
    },
    title: text(raw.page?.title) ?? fallback.title,
    introduction: text(raw.page?.introduction) ?? fallback.introduction,
    emptyState: text(raw.page?.emptyState) ?? fallback.emptyState,
    items: items.length > 0 ? items : fallback.items,
  };
}

export async function getChallengesPage(
  options: CmsReadOptions = {},
): Promise<ChallengesPageContent> {
  const raw = await cmsFetch<RawChallengesPage>({
    query: CHALLENGES_PAGE_QUERY,
    clean: options.clean,
  });

  return adaptChallengesPage(raw);
}
