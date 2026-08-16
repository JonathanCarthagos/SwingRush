import { ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const contentImage = defineType({
  name: "contentImage",
  title: "Image",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describes the image for screen readers and search engines.",
      validation: (rule) => rule.required(),
    }),
  ],
});
