"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import {
  defineDocuments,
  defineLocations,
  presentationTool,
} from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { schemaTypes, singletonTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

function singletonPageLocations(title: string, href: string) {
  return defineLocations({
    locations: [{ title, href }],
    message: "This document controls the page below.",
  });
}

export default defineConfig({
  name: "swingrush",
  title: "SwingRush",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: "/locations/:slug",
            filter: '_type == "location" && slug.current == $slug',
          },
        ]),
        locations: {
          homePage: singletonPageLocations("Home", "/"),
          howItWorksPage: singletonPageLocations(
            "How It Works",
            "/how-it-works",
          ),
          locationsPage: singletonPageLocations("Locations", "/locations"),
          challengesPage: singletonPageLocations("Challenges", "/challenges"),
          location: defineLocations({
            select: { title: "city", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title ?? "Location",
                  href: `/locations/${doc?.slug}`,
                },
                { title: "Locations", href: "/locations" },
              ],
            }),
          }),
          challenge: singletonPageLocations("Challenges", "/challenges"),
        },
      },
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) =>
          !singletonTypes.includes(
            schemaType as (typeof singletonTypes)[number],
          ),
      ),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletonTypes.includes(schemaType as (typeof singletonTypes)[number])
        ? actions.filter(
            ({ action }) => (action ? SINGLETON_ACTIONS.has(action) : false),
          )
        : actions,
    newDocumentOptions: (items) =>
      items.filter(
        ({ templateId }) =>
          !singletonTypes.includes(
            (templateId ?? "") as (typeof singletonTypes)[number],
          ),
      ),
  },
});
