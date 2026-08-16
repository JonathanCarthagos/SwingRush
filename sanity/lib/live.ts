import { defineLive } from "next-sanity/live";

import { client } from "@/sanity/lib/client";
import { apiVersion } from "@/sanity/env";

const readToken = process.env.SANITY_API_READ_TOKEN || false;

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    apiVersion,
  }),
  serverToken: readToken,
  // Token is only sent to the browser when <SanityLive includeDrafts /> is mounted.
  browserToken: readToken,
});
