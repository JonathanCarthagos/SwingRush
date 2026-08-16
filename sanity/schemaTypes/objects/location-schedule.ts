import { defineArrayMember, defineField, defineType } from "sanity";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export const locationScheduleSession = defineType({
  name: "locationScheduleSession",
  title: "Session",
  type: "object",
  fields: [
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "startTime",
      title: "Start time",
      type: "string",
      description: "24-hour format, e.g. 09:00.",
      validation: (rule) =>
        rule.required().regex(TIME_PATTERN, { name: "HH:mm" }),
    }),
    defineField({
      name: "endTime",
      title: "End time",
      type: "string",
      description: "24-hour format, e.g. 12:00.",
      validation: (rule) =>
        rule.required().regex(TIME_PATTERN, { name: "HH:mm" }),
    }),
  ],
  preview: {
    select: { title: "category", start: "startTime", end: "endTime" },
    prepare: ({ title, start, end }) => ({
      title,
      subtitle: `${start ?? "--:--"} - ${end ?? "--:--"}`,
    }),
  },
});

export const locationScheduleDay = defineType({
  name: "locationScheduleDay",
  title: "Day",
  type: "object",
  fields: [
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sessions",
      title: "Sessions",
      type: "array",
      of: [defineArrayMember({ type: "locationScheduleSession" })],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: "date", sessions: "sessions" },
    prepare: ({ title, sessions }) => ({
      title,
      subtitle: `${sessions?.length ?? 0} sessions`,
    }),
  },
});
