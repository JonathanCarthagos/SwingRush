import { defineArrayMember, defineField, defineType } from "sanity";

export const locationInformationBlock = defineType({
  name: "locationInformationBlock",
  title: "Information block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lines",
      title: "Lines",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Each line is rendered on its own row.",
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: "title", lines: "lines" },
    prepare: ({ title, lines }) => ({
      title,
      subtitle: Array.isArray(lines) ? lines.join(" · ") : undefined,
    }),
  },
});

export const locationVolunteer = defineType({
  name: "locationVolunteer",
  title: "Volunteer",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "action",
      title: "Action",
      type: "actionLink",
      validation: (rule) => rule.required(),
    }),
  ],
});
