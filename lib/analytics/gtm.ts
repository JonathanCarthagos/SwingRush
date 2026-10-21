/** Client container (public). Override with `NEXT_PUBLIC_GTM_ID` if it ever changes. */
const DEFAULT_GTM_ID = "GTM-TKQKJFPB";

/** Google Tag Manager container ID (public). */
export const GTM_ID =
  process.env.NEXT_PUBLIC_GTM_ID?.trim() ||
  (process.env.VERCEL_ENV === "production" ? DEFAULT_GTM_ID : "");

export function isGtmEnabled(): boolean {
  return GTM_ID.length > 0;
}
