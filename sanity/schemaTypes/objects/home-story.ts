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
      name: "body",
      title: "Body",
      type: "text",
      rows: 5,
      description: "Revealed when the visitor taps “Learn More”.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "string",
      initialValue: "image",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Animated scoreboard", value: "scoreboard" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "contentImage",
      hidden: ({ parent }) => parent?.media !== "image",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle", media: "image" },
  },
});
