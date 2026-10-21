import { HelpCircleIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const HOW_IT_WORKS_PAGE_ID = "howItWorksPage";

export const howItWorksPage = defineType({
  name: "howItWorksPage",
  title: "How It Works",
  type: "document",
  icon: HelpCircleIcon,
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
      description:
        "The words of the hero. Shown on one line, centered. Line breaks are not used.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "videoHero",
      group: "content",
    }),
    defineField({
      name: "arena",
      title: "Closing call to action",
      type: "ctaBlock",
      group: "content",
      description: "Inverted band at the bottom of the page.",
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 4,
      group: "content",
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "howItWorksItem" })],
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
    prepare: ({ subtitle }) => ({ title: "How It Works", subtitle }),
  },
});
