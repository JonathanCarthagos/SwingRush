import { SearchIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  icon: SearchIcon,
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "string",
      description: "Shown in search results and browser tabs. 50-60 characters.",
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      description: "Shown under the title in search results. 150-160 characters.",
      validation: (rule) => rule.required().max(200),
    }),
  ],
});
