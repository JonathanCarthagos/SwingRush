import { defineQuery } from "next-sanity";

export const HOME_PAGE_QUERY = defineQuery(`
  *[_id == "homePage"][0]{
    seo{title, description},
    hero{
      heading,
      "posterSrc": poster.asset->url,
      "webmSrc": webm.asset->url,
      "mp4Src": mp4.asset->url
    },
    arena{heading, description},
    stories[]{
      _key,
      title,
      subtitle,
      body,
      media,
      "image": image{"src": asset->url, alt}
    },
    cta{
      heading,
      description,
      action{label, href}
    }
  }
`);

export const HOW_IT_WORKS_PAGE_QUERY = defineQuery(`
  *[_id == "howItWorksPage"][0]{
    seo{title, description},
    hero{
      heading,
      "posterSrc": poster.asset->url,
      "webmSrc": webm.asset->url,
      "mp4Src": mp4.asset->url
    },
    arena{heading, description},
    introduction,
    items[]{
      _key,
      title,
      "slug": slug.current,
      content,
      sections[]{_key, heading, body}
    }
  }
`);

export const LOCATIONS_PAGE_QUERY = defineQuery(`
  {
    "page": *[_id == "locationsPage"][0]{
      title,
      introduction,
      emptyState,
      seo{title, description}
    },
    "locations": *[_type == "location" && defined(slug.current)]|order(sortOrder asc){
      _id,
      city,
      "slug": slug.current,
      dates{startDate, endDate},
      ctaLabel
    }
  }
`);

export const LOCATION_SLUGS_QUERY = defineQuery(`
  *[_type == "location" && defined(slug.current)]|order(sortOrder asc){
    "slug": slug.current
  }
`);

export const LOCATION_SITEMAP_QUERY = defineQuery(`
  *[_type == "location" && defined(slug.current)]|order(sortOrder asc){
    "slug": slug.current,
    _updatedAt
  }
`);

export const LOCATION_BY_SLUG_QUERY = defineQuery(`
  *[_type == "location" && slug.current == $slug][0]{
    _id,
    city,
    "slug": slug.current,
    detailStatus,
    venueName,
    introduction,
    ctaLabel,
    dates{startDate, endDate},
    seo{title, description},
    hero{
      ariaLabel,
      "posterSrc": poster.asset->url,
      "webmSrc": webm.asset->url,
      "mp4Src": mp4.asset->url
    },
    primaryAction{label, href},
    features[]{
      _key,
      title,
      description,
      "image": image{
        "src": asset->url,
        alt,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height
      }
    },
    schedule{
      title,
      days[]{
        _key,
        date,
        sessions[]{_key, category, startTime, endTime}
      }
    },
    ticketInfo{
      title,
      releases[]{
        _key,
        title,
        description,
        releaseDate,
        action{label, href}
      }
    },
    importantInformation{
      title,
      blocks[]{_key, title, lines},
      volunteer{
        title,
        description,
        benefits,
        action{label, href}
      }
    }
  }
`);

export const CHALLENGES_PAGE_QUERY = defineQuery(`
  {
    "page": *[_id == "challengesPage"][0]{
      title,
      introduction,
      emptyState,
      seo{title, description}
    },
    "challenges": *[_type == "challenge" && defined(slug.current)]|order(sortOrder asc){
      _id,
      "slug": slug.current,
      sortOrder,
      title,
      club,
      shot,
      distance,
      targetHeight{open, elite},
      timeLimit,
      description,
      "image": image{"src": asset->url, alt}
    }
  }
`);
