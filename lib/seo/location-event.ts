import { SITE_URL } from "@/lib/site";
import type { LocationDetailPageContent } from "@/types/location-detail";

export function locationEventStructuredData(content: LocationDetailPageContent) {
  const url = `${SITE_URL}/locations/${content.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `SwingRush ${content.city}`,
    description: content.seo.description,
    startDate: content.dates.startDate,
    endDate: content.dates.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: content.venueName,
      address: {
        "@type": "PostalAddress",
        addressLocality: content.city,
      },
    },
    organizer: {
      "@type": "Organization",
      name: "SwingRush",
      url: SITE_URL,
    },
    url,
  };
}
