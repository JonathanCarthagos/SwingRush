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
    { name: "cityPages", title: "City pages" },
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
      name: "locationHero",
      title: "City page hero video",
      type: "videoHero",
      group: "cityPages",
      description:
        "Plays at the top of every city page until a city sets its own Hero video. Upload the landscape video: phones play it too. The mobile video is optional and should also be landscape, because the city hero is a wide frame on every screen.",
    }),
    defineField({
      name: "defaultIntroduction",
      title: "Default city introduction",
      type: "text",
      rows: 5,
      group: "cityPages",
      description: "Shown on a city page when that city has no Introduction of its own.",
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
