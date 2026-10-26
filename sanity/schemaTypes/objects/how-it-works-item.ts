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
      description:
        "One fact per line, written as Label: value. Each line becomes a bullet at every screen size. A single paragraph stays a paragraph.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "body" },
  },
});

export const howItWorksItem = defineType({
  name: "howItWorksItem",
  title: "Item",
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
        "Page anchor only. Renaming the title does not change this item’s photo. Leave the anchor as it is unless a link to this block needs a new name.",
      options: { maxLength: 60 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      rows: 8,
      description:
        "Separate paragraphs with a blank line. This text stays paragraphs, not a bullet list.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Sub-sections",
      type: "array",
      of: [defineArrayMember({ type: "howItWorksSection" })],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "contentImage",
      description:
        "Optional. Leave it empty to keep the photo already paired with this item. Uploading a file replaces that photo. Renaming the title does not.",
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "actionLink",
      description: "Optional underlined link below the copy.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "content" },
  },
});
