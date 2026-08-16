import type { SeoContent } from "@/types/seo";

export interface ChallengeItem {
  id: string;
  number: string;
  title: string;
  image: string;
  imageAlt: string;
  club: string;
  shot: string;
  distance: string;
  targetHeight: {
    open: string;
    elite: string;
  };
  timeLimit: string;
  description: string;
}

export interface ChallengesPageContent {
  seo: SeoContent;
  title: string;
  introduction: string;
  emptyState: string;
  items: readonly ChallengeItem[];
}
