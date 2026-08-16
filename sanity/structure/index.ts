import type { StructureBuilder, StructureResolver } from "sanity/structure";

import { CHALLENGES_PAGE_ID } from "@/sanity/schemaTypes/documents/challenges-page";
import { HOME_PAGE_ID } from "@/sanity/schemaTypes/documents/home-page";
import { HOW_IT_WORKS_PAGE_ID } from "@/sanity/schemaTypes/documents/how-it-works-page";
import { LOCATIONS_PAGE_ID } from "@/sanity/schemaTypes/documents/locations-page";
import { singletonTypes } from "@/sanity/schemaTypes";

function singleton(
  S: StructureBuilder,
  { id, type, title }: { id: string; type: string; title: string },
) {
  return S.listItem()
    .id(id)
    .title(title)
    .schemaType(type)
    .child(S.document().documentId(id).schemaType(type).title(title));
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items([
              singleton(S, { id: HOME_PAGE_ID, type: "homePage", title: "Home" }),
              singleton(S, {
                id: HOW_IT_WORKS_PAGE_ID,
                type: "howItWorksPage",
                title: "How It Works",
              }),
              singleton(S, {
                id: LOCATIONS_PAGE_ID,
                type: "locationsPage",
                title: "Locations Page",
              }),
              singleton(S, {
                id: CHALLENGES_PAGE_ID,
                type: "challengesPage",
                title: "Challenges Page",
              }),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Locations")
        .schemaType("location")
        .child(
          S.documentTypeList("location")
            .title("Locations")
            .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
        ),
      S.listItem()
        .title("Challenges")
        .schemaType("challenge")
        .child(
          S.documentTypeList("challenge")
            .title("Challenges")
            .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return (
          id !== undefined &&
          id !== "location" &&
          id !== "challenge" &&
          !singletonTypes.includes(id as (typeof singletonTypes)[number])
        );
      }),
    ]);
