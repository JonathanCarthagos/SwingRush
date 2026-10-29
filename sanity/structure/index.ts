import type { StructureBuilder, StructureResolver } from "sanity/structure";

import { apiVersion } from "@/sanity/env";
import { CHALLENGES_PAGE_ID } from "@/sanity/schemaTypes/documents/challenges-page";
import { HOME_PAGE_ID } from "@/sanity/schemaTypes/documents/home-page";
import { HOW_IT_WORKS_PAGE_ID } from "@/sanity/schemaTypes/documents/how-it-works-page";
import { LOCATIONS_PAGE_ID } from "@/sanity/schemaTypes/documents/locations-page";
import {
  PRIVACY_POLICY_ID,
  TERMS_OF_USE_ID,
} from "@/sanity/schemaTypes/documents/legal-page";
import { WAITLIST_PAGE_ID } from "@/sanity/schemaTypes/documents/waitlist-page";
import { privateDocumentTypes, singletonTypes } from "@/sanity/schemaTypes";

interface WaitlistLocationPane {
  _id: string;
  city: string;
  signupCount: number;
}

interface WaitlistStructureCounts {
  locations: WaitlistLocationPane[];
  unassignedCount: number;
}

function formatSignupCount(count: number) {
  return count.toLocaleString("en-US");
}

function waitlistItemTitle(city: string, count: number) {
  return `${city} (${formatSignupCount(count)})`;
}

function waitlistPaneTitle(city: string, count: number) {
  const noun = count === 1 ? "signup" : "signups";
  return `${city} · ${formatSignupCount(count)} ${noun}`;
}

const WAITLIST_SIGNUP_ORDERING = [
  { field: "consentedAt", direction: "desc" as const },
];

function waitlistSignups(
  S: StructureBuilder,
  { title, filter, params }: { title: string; filter: string; params?: Record<string, string> },
) {
  const list = S.documentList()
    .title(title)
    .schemaType("waitlistContact")
    .filter(filter)
    .defaultOrdering(WAITLIST_SIGNUP_ORDERING)
    .initialValueTemplates([]);

  return params ? list.params(params) : list;
}

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

export const structure: StructureResolver = async (S, context) => {
  const { locations, unassignedCount } = await context
    .getClient({ apiVersion })
    .withConfig({ perspective: "raw" })
    .fetch<WaitlistStructureCounts>(
      `{
        "locations": *[_type == "location" && !(_id in path("drafts.**")) && defined(city)] | order(sortOrder asc) {
          _id,
          city,
          "signupCount": count(*[_type == "waitlistContact" && location._ref == ^._id])
        },
        "unassignedCount": count(*[_type == "waitlistContact" && !defined(location._ref)])
      }`,
    );

  return S.list()
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
              singleton(S, {
                id: WAITLIST_PAGE_ID,
                type: "waitlistPage",
                title: "Waitlist Page",
              }),
              singleton(S, {
                id: PRIVACY_POLICY_ID,
                type: "privacyPolicy",
                title: "Privacy Policy",
              }),
              singleton(S, {
                id: TERMS_OF_USE_ID,
                type: "termsOfUse",
                title: "Terms of Use",
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
      S.listItem()
        .id("waitlists")
        .title("Waitlists")
        .child(
          S.list()
            .title("Waitlists")
            .items([
              ...locations.map((location) =>
                S.listItem()
                  .id(`waitlist-${location._id}`)
                  .title(waitlistItemTitle(location.city, location.signupCount))
                  .child(
                    waitlistSignups(S, {
                      title: waitlistPaneTitle(location.city, location.signupCount),
                      filter:
                        '_type == "waitlistContact" && location._ref == $locationId',
                      params: { locationId: location._id },
                    }),
                  ),
              ),
              S.listItem()
                .id("waitlist-unassigned")
                .title(waitlistItemTitle("Unassigned", unassignedCount))
                .child(
                  waitlistSignups(S, {
                    title: waitlistPaneTitle("Unassigned", unassignedCount),
                    filter:
                      '_type == "waitlistContact" && !defined(location._ref)',
                  }),
                ),
            ]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return (
          id !== undefined &&
          id !== "location" &&
          id !== "challenge" &&
          !singletonTypes.includes(id as (typeof singletonTypes)[number]) &&
          !privateDocumentTypes.includes(
            id as (typeof privateDocumentTypes)[number],
          )
        );
      }),
    ]);
};
