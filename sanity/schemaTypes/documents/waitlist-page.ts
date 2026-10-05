import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const WAITLIST_PAGE_ID = "waitlistPage";

export const waitlistPage = defineType({
  name: "waitlistPage",
  title: "Waitlist Page",
  type: "document",
  icon: EnvelopeIcon,
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
      description: "Shown as the main page heading above the form.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 5,
      group: "content",
      validation: (rule) => rule.required(),
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
    prepare: ({ subtitle }) => ({ title: "Waitlist Page", subtitle }),
  },
});
