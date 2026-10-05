import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const WAITLIST_CONTACT_TYPE = "waitlistContact";

export const waitlistContact = defineType({
  name: WAITLIST_CONTACT_TYPE,
  title: "Waitlist signup",
  type: "document",
  icon: EnvelopeIcon,
  description:
    "Created by the public waitlist form. These stay unpublished so email and phone are not readable from the public API.",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "reference",
      to: [{ type: "location" }],
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "locationSlug",
      title: "Location slug",
      type: "string",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "marketingOptIn",
      title: "Email opt-in",
      type: "boolean",
      readOnly: true,
      validation: (rule) =>
        rule.required().custom((value) =>
          value === true ? true : "Email consent is required",
        ),
    }),
    defineField({
      name: "smsOptIn",
      title: "SMS opt-in",
      type: "boolean",
      readOnly: true,
      validation: (rule) =>
        rule.required().custom((value) =>
          value === true ? true : "SMS consent is required",
        ),
    }),
    defineField({
      name: "consentText",
      title: "Consent text",
      type: "text",
      rows: 4,
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "consentedAt",
      title: "Consented at",
      type: "datetime",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sourcePath",
      title: "Source",
      type: "string",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      name: "consentedAtDesc",
      title: "Newest first",
      by: [{ field: "consentedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "email",
      city: "city",
      consentedAt: "consentedAt",
    },
    prepare: ({ title, city, consentedAt }) => ({
      title,
      subtitle: [city, consentedAt].filter(Boolean).join(" · "),
    }),
  },
});
