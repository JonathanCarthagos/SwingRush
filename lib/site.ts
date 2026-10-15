const DEFAULT_SITE_URL = "https://www.swingrushgolf.com";

/** Canonical origin for metadata, sitemap, and robots. No trailing slash. */
function resolveSiteUrl(): string {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return DEFAULT_SITE_URL;
}

export const SITE_URL = resolveSiteUrl();
