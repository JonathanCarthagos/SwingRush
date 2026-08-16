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
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 5,
      group: "content",
    }),
    defineField({
      name: "emptyState",
      title: "Empty state",
      type: "string",
      group: "content",
      description: "Shown when no challenge is published.",
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
