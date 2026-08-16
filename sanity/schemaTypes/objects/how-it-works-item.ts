import { defineArrayMember, defineField, defineType } from "sanity";

export const howItWorksSection = defineType({
  name: "howItWorksSection",
  title: "Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "body" },
  },
});

export const howItWorksItem = defineType({
  name: "howItWorksItem",
  title: "Accordion item",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Anchor",
      type: "slug",
      description:
        "Used as the accordion item id. Not a URL — How It Works is a single page.",
      options: { source: "title", maxLength: 60 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      rows: 8,
      description: "Separate paragraphs with a blank line.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Sub-sections",
      type: "array",
      of: [defineArrayMember({ type: "howItWorksSection" })],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "content" },
  },
});
