export interface RsvpFormData {
  name: string;
  email: string;
  citySlug?: string;
  guestCount?: number;
  message?: string;
}

export interface CityPage {
  _id: string;
  title: string;
  slug: string;
  heroHeadline?: string;
  heroDescription?: string;
  isPublished?: boolean;
}
