import { defineField, defineType } from "sanity";

export const headlineBlock = defineType({
  name: "headlineBlock",
  title: "Headline block",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "text",
      rows: 2,
      description: "Each line break becomes a new line in the display type.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "description" },
  },
});
