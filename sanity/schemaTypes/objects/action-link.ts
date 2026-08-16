import { LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const actionLink = defineType({
  name: "actionLink",
  title: "Action",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Destination",
      type: "string",
      description:
        "Full URL (https://...), internal path (/locations) or anchor (#ticket-info).",
      validation: (rule) =>
        rule
          .required()
          .regex(/^(https?:\/\/|mailto:|tel:|\/|#)/, {
            name: "URL, path or anchor",
          }),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
