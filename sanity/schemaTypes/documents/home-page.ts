import { HomeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const HOME_PAGE_ID = "homePage";

export const homePage = defineType({
  name: "homePage",
  title: "Home",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
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
    }),
    defineField({
      name: "stories",
      title: "Stories",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "homeStory" })],
      description:
        "The tap-to-expand cards between the arena block and the closing call to action.",
    }),
    defineField({
      name: "cta",
      title: "Call to action",
      type: "ctaBlock",
      group: "content",
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
    prepare: ({ subtitle }) => ({ title: "Home", subtitle }),
  },
});
