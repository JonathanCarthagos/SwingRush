import { defineQuery } from "next-sanity";

export const CITY_PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "cityPage" && isPublished == true && defined(slug.current)]{
    "slug": slug.current
  }
`);

export const CITY_PAGE_QUERY = defineQuery(`
  *[_type == "cityPage" && slug.current == $slug && isPublished == true][0]{
    _id,
    title,
    "slug": slug.current,
    heroHeadline,
    heroDescription,
    isPublished
  }
`);
