import { OlistIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const challenge = defineType({
  name: "challenge",
  title: "Challenge",
  type: "document",
  icon: OlistIcon,
  description:
    "Challenges do not get their own page. Each one becomes a row in the accordion on /challenges.",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "specs", title: "Specs" },
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
      name: "slug",
      title: "Reference key",
      type: "slug",
      group: "content",
      description:
        "Internal identifier for the accordion row. It is not a URL — challenges have no page of their own.",
      options: { source: "title", maxLength: 60 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Number",
      type: "number",
      group: "content",
      description: "Displayed as 01, 02, 03 … and controls the accordion order.",
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "contentImage",
      group: "content",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "club",
      title: "Club",
      type: "string",
      group: "specs",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shot",
      title: "Shot",
      type: "string",
      group: "specs",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "distance",
      title: "Distance",
      type: "string",
      group: "specs",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "targetHeight",
      title: "Target height",
      type: "object",
      group: "specs",
      options: { columns: 2 },
      fields: [
        defineField({
          name: "open",
          title: "Open division",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "elite",
          title: "Elite division",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "timeLimit",
      title: "Time limit",
      type: "string",
      group: "specs",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      name: "sortOrder",
      title: "Number",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", sortOrder: "sortOrder", media: "image" },
    prepare: ({ title, sortOrder, media }) => ({
      title: `${String(sortOrder ?? "").padStart(2, "0")} ${title ?? ""}`.trim(),
      media,
    }),
  },
});
