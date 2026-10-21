import { defineField, defineType } from "sanity";

export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "Call to action",
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
    defineField({
      name: "action",
      title: "Button",
      type: "actionLink",
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "action.label" },
  },
});
