import type { SeoContent } from "@/types/seo";
import type { WaitlistField, WaitlistPageContent } from "@/types/waitlist";

export const WAITLIST_PAGE_SEO = {
  title: "Join the Waitlist | SwingRush",
  description:
    "Join the SwingRush waitlist to be notified when we announce event dates and ticket sales.",
} as const satisfies SeoContent;

export const WAITLIST_PAGE_CONTENT = {
  title: "Become a Swingrusher",
  introduction:
    "Exact dates and locations to be announced. In the meantime, enter your email and join the waitlist to be notified when we announce dates and ticket sales.",
  fields: {
    email: { label: "Email", placeholder: "Email" },
    phone: { label: "Phone number", placeholder: "Phone Number" },
    location: { label: "Location", placeholder: "Location" },
  },
  submitLabel: "Join Waitlist",
  pendingLabel: "Joining…",
  success: {
    title: "You’re on the list",
    message:
      "We'll let you know as soon as we announce dates and ticket sales.",
  },
} as const satisfies WaitlistPageContent;

export const WAITLIST_ERROR_MESSAGES = {
  email: "Enter a valid email address, like name@example.com.",
  phone: "Enter a phone number with 10 to 15 digits.",
  location: "Choose the location you want to hear about.",
} as const satisfies Record<WaitlistField, string>;
