import { PinIcon } from "@sanity/icons";
import {
  defineArrayMember,
  defineField,
  defineType,
  type SanityDocument,
  type ValidationContext,
} from "sanity";

type LocationDocument = SanityDocument & { detailStatus?: string };

function isComplete(context: ValidationContext) {
  return (context.document as LocationDocument | undefined)?.detailStatus === "complete";
}

function requiredWhenComplete(value: unknown, context: ValidationContext) {
  if (!isComplete(context)) return true;
  const isEmpty = value === undefined || value === null || (Array.isArray(value) && value.length === 0);
  return isEmpty ? "Required while the detail page is set to Complete" : true;
}

const hiddenUnlessComplete = ({ document }: { document?: SanityDocument }) =>
  (document as LocationDocument | undefined)?.detailStatus !== "complete";

export const location = defineType({
  name: "location",
  title: "Location",
  type: "document",
  icon: PinIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "detail", title: "Detail page" },
    { name: "schedule", title: "Schedule & tickets" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "city",
      title: "City",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      description: "Becomes the URL: /locations/{slug}",
      options: { source: "city", maxLength: 60 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      type: "number",
      group: "content",
      description: "Lower numbers appear first on the Locations page.",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "dates",
      title: "Event dates",
      type: "object",
      group: "content",
      options: { columns: 2 },
      fields: [
        defineField({
          name: "startDate",
          title: "Start date",
          type: "date",
          options: { dateFormat: "YYYY-MM-DD" },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "endDate",
          title: "End date",
          type: "date",
          options: { dateFormat: "YYYY-MM-DD" },
          validation: (rule) =>
            rule.required().custom((endDate, context) => {
              const startDate = (context.parent as { startDate?: string } | undefined)?.startDate;
              if (!startDate || !endDate) return true;
              return endDate >= startDate ? true : "End date must not be before the start date";
            }),
        }),
      ],
    }),
    defineField({
      name: "ctaLabel",
      title: "List button label",
      type: "string",
      group: "content",
      initialValue: "Join Waitlist",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "registrationStatus",
      title: "Registration status",
      type: "string",
      group: "content",
      initialValue: "waitlist",
      options: {
        list: [
          { title: "Join Waitlist", value: "waitlist" },
          { title: "Register", value: "register" },
          { title: "Sold out", value: "soldOut" },
        ],
        layout: "radio",
      },
      description:
        "Controls the button on the Locations list: waitlist = outlined Join Waitlist; register = red Register button; sold out = red 'Sold out' label above the Join Waitlist button.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "detailStatus",
      title: "Detail page",
      type: "string",
      group: "content",
      initialValue: "comingSoon",
      options: {
        list: [
          { title: "Coming soon", value: "comingSoon" },
          { title: "Complete", value: "complete" },
        ],
        layout: "radio",
      },
      description:
        "Every city shows the waitlist page. Complete switches to the full sales page (schedule, tickets, information) once Registration status is Register.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "venueName",
      title: "Venue",
      type: "string",
      group: "content",
      validation: (rule) => rule.custom(requiredWhenComplete),
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 5,
      group: "content",
      description: "Leave empty to use the default introduction from the Locations Page.",
      validation: (rule) => rule.custom(requiredWhenComplete),
    }),
    defineField({
      name: "hero",
      title: "Hero video",
      type: "videoHero",
      group: "content",
      description:
        "Optional. Replaces the shared city page hero video from the Locations Page. Upload desktop and mobile WebM and MP4 files, plus posters, when a city needs its own clip.",
    }),
    defineField({
      name: "primaryAction",
      title: "Primary action",
      type: "actionLink",
      group: "detail",
      hidden: hiddenUnlessComplete,
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      group: "detail",
      of: [defineArrayMember({ type: "locationFeature" })],
      hidden: hiddenUnlessComplete,
      validation: (rule) => rule.custom(requiredWhenComplete),
    }),
    defineField({
      name: "schedule",
      title: "Schedule",
      type: "object",
      group: "schedule",
      hidden: hiddenUnlessComplete,
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "Schedule",
        }),
        defineField({
          name: "days",
          title: "Days",
          type: "array",
          of: [defineArrayMember({ type: "locationScheduleDay" })],
        }),
      ],
    }),
    defineField({
      name: "ticketInfo",
      title: "Ticket info",
      type: "object",
      group: "schedule",
      hidden: hiddenUnlessComplete,
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "Ticket Info",
        }),
        defineField({
          name: "releases",
          title: "Releases",
          type: "array",
          of: [defineArrayMember({ type: "locationTicketRelease" })],
        }),
      ],
    }),
    defineField({
      name: "importantInformation",
      title: "Important information",
      type: "object",
      group: "detail",
      hidden: hiddenUnlessComplete,
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "Important Information",
        }),
        defineField({
          name: "blocks",
          title: "Blocks",
          type: "array",
          of: [defineArrayMember({ type: "locationInformationBlock" })],
        }),
        defineField({
          name: "volunteer",
          title: "Volunteer",
          type: "locationVolunteer",
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  orderings: [
    {
      name: "sortOrder",
      title: "Sort order",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "city",
      startDate: "dates.startDate",
      detailStatus: "detailStatus",
      registrationStatus: "registrationStatus",
    },
    prepare: ({ title, startDate, detailStatus, registrationStatus }) => ({
      title,
      subtitle: [
        startDate,
        registrationStatus === "soldOut"
          ? "Sold out"
          : registrationStatus === "register"
            ? "Register"
            : "Join Waitlist",
        detailStatus === "complete" ? "Complete" : "Coming soon",
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
