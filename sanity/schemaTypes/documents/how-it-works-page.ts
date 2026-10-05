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
      type: "text",
      rows: 3,
      group: "content",
      description:
        "Shown as the main page heading in the hero. Line breaks create multiple lines.",
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "videoHero",
      group: "content",
    }),
    defineField({
      name: "arena",
      title: "Arena",
      type: "headlineBlock",
      group: "content",
      description: "The brand-coloured block that overlaps the hero video.",
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
