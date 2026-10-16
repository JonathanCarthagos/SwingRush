import { OlistIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const CHALLENGES_PAGE_ID = "challengesPage";

export const challengesPage = defineType({
  name: "challengesPage",
  title: "Challenges Page",
  type: "document",
  icon: OlistIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Page title (H1)",
      type: "string",
      group: "content",
      description: "Shown as the main page heading in the hero.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introduction",
      title: "Introduction (reserved)",
      type: "text",
      rows: 5,
      group: "content",
      description:
        "Not shown on the public Challenges page today. Keep for future layout or SEO notes only.",
    }),
    defineField({
      name: "emptyState",
      title: "Empty state",
      type: "string",
      group: "content",
      description: "Shown when no challenge is published.",
    }),
    defineField({
      name: "closingCta",
      title: "Closing call to action",
      type: "ctaBlock",
      group: "content",
      description: "Inverted band at the bottom of the page.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: { subtitle: "seo.title" },
    prepare: ({ subtitle }) => ({ title: "Challenges Page", subtitle }),
  },
});
