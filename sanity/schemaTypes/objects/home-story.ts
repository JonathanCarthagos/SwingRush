import { defineField, defineType } from "sanity";

export const homeStory = defineType({
  name: "homeStory",
  title: "Story",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "contentImage",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "link",
      title: "Learn more",
      type: "actionLink",
      description: "The underlined link under the subtitle.",
      initialValue: { label: "Learn More", href: "/how-it-works" },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle", media: "image" },
  },
});
