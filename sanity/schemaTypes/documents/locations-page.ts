import { PinIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const LOCATIONS_PAGE_ID = "locationsPage";

export const locationsPage = defineType({
  name: "locationsPage",
  title: "Locations Page",
  type: "document",
  icon: PinIcon,
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
      description: "Shown when no location is published.",
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
    prepare: ({ subtitle }) => ({ title: "Locations Page", subtitle }),
  },
});
