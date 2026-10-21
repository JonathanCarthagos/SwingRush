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
      description:
        "The words of this heading. The site centers every line and scales a long line down so it stays inside the band. A line break starts a new centered line. It does not change the alignment.",
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
