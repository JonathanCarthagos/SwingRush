import { defineField, defineType } from "sanity";

export const locationTicketRelease = defineType({
  name: "locationTicketRelease",
  title: "Ticket release",
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
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "releaseDate",
      title: "Release date",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "action",
      title: "Action",
      type: "actionLink",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "releaseDate" },
  },
});
