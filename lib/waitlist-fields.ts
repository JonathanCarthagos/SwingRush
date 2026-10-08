import { z } from "zod";

import {
  WAITLIST_ERROR_MESSAGES,
  WAITLIST_OPT_IN_ERROR,
} from "@/data/waitlist";
import type { WaitlistFormErrorField } from "@/types/waitlist";

const LOCATION_SLUG = /^[a-z0-9-]+$/;

export function normalizeWaitlistEmail(value: string) {
  const cleaned = value
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u00a0/g, " ")
    .trim();
  const wrapped = cleaned.match(/<([^<>\s]+@[^<>\s]+)>/);
  return (wrapped?.[1] ?? cleaned).trim();
}

export function validateWaitlistFields(input: {
  email: string;
  phone: string;
  location: string;
  optIn: boolean;
}): Partial<Record<WaitlistFormErrorField, string>> {
  const errors: Partial<Record<WaitlistFormErrorField, string>> = {};
  const email = normalizeWaitlistEmail(input.email);
  const digits = input.phone.replace(/\D/g, "");

  if (!z.email().safeParse(email).success) {
    errors.email = WAITLIST_ERROR_MESSAGES.email;
  }
  if (digits.length < 10 || digits.length > 15) {
    errors.phone = WAITLIST_ERROR_MESSAGES.phone;
  }
  if (!LOCATION_SLUG.test(input.location.trim())) {
    errors.location = WAITLIST_ERROR_MESSAGES.location;
  }
  if (errors.email || errors.phone || errors.location) return errors;

  if (!input.optIn) errors.optIn = WAITLIST_OPT_IN_ERROR;
  return errors;
}
