"use server";

import { z } from "zod";

import { WAITLIST_ERROR_MESSAGES } from "@/data/waitlist";
import { getWaitlistLocationOptions } from "@/lib/waitlist";
import type {
  WaitlistField,
  WaitlistFormState,
  WaitlistFormValues,
} from "@/types/waitlist";

function readValues(formData: FormData): WaitlistFormValues {
  const read = (key: WaitlistField) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  return { email: read("email"), phone: read("phone"), location: read("location") };
}

export async function joinWaitlist(
  _previousState: WaitlistFormState,
  formData: FormData,
): Promise<WaitlistFormState> {
  const values = readValues(formData);
  const locations = await getWaitlistLocationOptions();
  const locationSlugs = new Set(locations.map((option) => option.value));

  const waitlistSchema = z.object({
    email: z.email(WAITLIST_ERROR_MESSAGES.email),
    phone: z
      .string()
      .transform((value) => value.replace(/\D/g, ""))
      .pipe(
        z
          .string()
          .min(10, WAITLIST_ERROR_MESSAGES.phone)
          .max(15, WAITLIST_ERROR_MESSAGES.phone),
      ),
    location: z
      .string()
      .refine((value) => locationSlugs.has(value), WAITLIST_ERROR_MESSAGES.location),
  });

  const parsed = waitlistSchema.safeParse(values);

  if (!parsed.success) {
    const errors: Partial<Record<WaitlistField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as WaitlistField;
      errors[field] ??= issue.message;
    }
    return { status: "error", errors, values };
  }

  // TODO(integration): send parsed.data to the waitlist provider (Resend audience or
  // Vivenu, following app/api/rsvp/route.ts). Until then submissions are not stored.

  return { status: "success" };
}
