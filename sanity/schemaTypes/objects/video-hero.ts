import { PlayIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const videoHero = defineType({
  name: "videoHero",
  title: "Hero",
  type: "object",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "text",
      rows: 3,
      description: "Each line break becomes a new line in the display type.",
    }),
    defineField({
      name: "ariaLabel",
      title: "Accessible label",
      type: "string",
      description: "Describes the video for screen readers.",
    }),
    defineField({
      name: "poster",
      title: "Poster image",
      type: "image",
      options: { hotspot: true },
      description:
        "Shown while the video loads and to visitors who prefer reduced motion.",
    }),
    defineField({
      name: "webm",
      title: "Video (WebM)",
      type: "file",
      options: { accept: "video/webm" },
    }),
    defineField({
      name: "mp4",
      title: "Video (MP4)",
      type: "file",
      options: { accept: "video/mp4" },
    }),
    defineField({
      name: "mobilePoster",
      title: "Mobile poster image",
      type: "image",
      options: { hotspot: true },
      description:
        "Shown below 768px while the mobile video loads and for visitors who prefer reduced motion.",
    }),
    defineField({
      name: "mobileWebm",
      title: "Mobile video (WebM)",
      type: "file",
      options: { accept: "video/webm" },
    }),
    defineField({
      name: "mobileMp4",
      title: "Mobile video (MP4)",
      type: "file",
      options: { accept: "video/mp4" },
    }),
  ],
});
