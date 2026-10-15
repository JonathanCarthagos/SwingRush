import { SITE_URL } from "@/lib/site";

/** Organization + WebSite graph for the root layout. */
export function siteStructuredDataGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "SwingRush",
        url: SITE_URL,
        logo: `${SITE_URL}/opengraph-image.jpg`,
        description:
          "The world’s first arena golf gauntlet — ten skills challenges, one finish line.",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "SwingRush",
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}
