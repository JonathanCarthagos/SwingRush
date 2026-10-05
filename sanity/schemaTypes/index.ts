import { challenge } from "./documents/challenge";
import { challengesPage } from "./documents/challenges-page";
import { homePage } from "./documents/home-page";
import { howItWorksPage } from "./documents/how-it-works-page";
import { location } from "./documents/location";
import { locationsPage } from "./documents/locations-page";
import { waitlistPage } from "./documents/waitlist-page";
import {
  WAITLIST_CONTACT_TYPE,
  waitlistContact,
} from "./documents/waitlist-contact";
import { actionLink } from "./objects/action-link";
import { contentImage } from "./objects/content-image";
import { ctaBlock } from "./objects/cta-block";
import { headlineBlock } from "./objects/headline-block";
import { homeStory } from "./objects/home-story";
import { howItWorksItem, howItWorksSection } from "./objects/how-it-works-item";
import { locationFeature } from "./objects/location-feature";
import {
  locationInformationBlock,
  locationVolunteer,
} from "./objects/location-information";
import {
  locationScheduleDay,
  locationScheduleSession,
} from "./objects/location-schedule";
import { locationTicketRelease } from "./objects/location-ticket-release";
import { seo } from "./objects/seo";
import { videoHero } from "./objects/video-hero";

export const singletonTypes = [
  "homePage",
  "howItWorksPage",
  "locationsPage",
  "challengesPage",
  "waitlistPage",
] as const;

export const privateDocumentTypes = [WAITLIST_CONTACT_TYPE] as const;

export const schemaTypes = [
  homePage,
  howItWorksPage,
  locationsPage,
  challengesPage,
  waitlistPage,
  location,
  challenge,
  waitlistContact,
  seo,
  actionLink,
  contentImage,
  videoHero,
  headlineBlock,
  ctaBlock,
  homeStory,
  howItWorksItem,
  howItWorksSection,
  locationFeature,
  locationScheduleDay,
  locationScheduleSession,
  locationTicketRelease,
  locationInformationBlock,
  locationVolunteer,
];
