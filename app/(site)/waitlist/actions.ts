"use server";

import { createHash } from "node:crypto";

import { z } from "zod";

import {
  WAITLIST_CONSENT_TEXT,
  WAITLIST_ERROR_MESSAGES,
  WAITLIST_OPT_IN_ERROR,
  WAITLIST_SAVE_ERROR,
} from "@/data/waitlist";
import { cmsFetch } from "@/lib/cms/fetch";
import { getWaitlistLocationOptions } from "@/lib/waitlist";
import { WAITLIST_LOCATION_QUERY } from "@/sanity/lib/queries";
import { getWriteClient } from "@/sanity/lib/write-client";
import type {
  WaitlistField,
  WaitlistFormErrorField,
  WaitlistFormState,
  WaitlistFormValues,
} from "@/types/waitlist";

const WAITLIST_SOURCE_PATH = "/waitlist";
const LOCATION_SOURCE_PATH = /^\/locations\/[a-z0-9-]+$/;
const HONEYPOT_FIELD = "sr_hp";

function readSourcePath(formData: FormData) {
  const value = formData.get("sourcePath");
  return typeof value === "string" && LOCATION_SOURCE_PATH.test(value)
    ? value
    : WAITLIST_SOURCE_PATH;
}

function normalizeEmail(value: string) {
  const cleaned = value
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u00a0/g, " ")
    .trim();
  const wrapped = cleaned.match(/<([^<>\s]+@[^<>\s]+)>/);
  return (wrapped?.[1] ?? cleaned).trim();
}

function readValues(formData: FormData): WaitlistFormValues {
  const read = (key: WaitlistField) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  return {
    email: normalizeEmail(read("email")),
    phone: read("phone"),
    location: read("location"),
  };
}

function waitlistDocumentId(email: string, locationSlug: string) {
  const hash = createHash("sha256")
    .update(`${email}\n${locationSlug}`)
    .digest("hex");
  return `drafts.waitlist.${hash}`;
}

export async function joinWaitlist(
  _previousState: WaitlistFormState,
  formData: FormData,
): Promise<WaitlistFormState> {
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success" };
  }

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
    const errors: Partial<Record<WaitlistFormErrorField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as WaitlistField;
      errors[field] ??= issue.message;
    }
    return { status: "error", errors, values };
  }

  if (formData.get("optIn") !== "on") {
    return {
      status: "error",
      errors: { optIn: WAITLIST_OPT_IN_ERROR },
      values,
    };
  }

  const email = parsed.data.email.toLowerCase();
  const location = await cmsFetch<{
    _id?: string;
    city?: string | null;
    slug?: string | null;
  }>({
    query: WAITLIST_LOCATION_QUERY,
    params: { slug: parsed.data.location },
    clean: true,
  });
  const city = location?.city?.trim();
  const locationSlug = location?.slug?.trim();
  const locationId = location?._id;

  if (!locationId || !city || !locationSlug) {
    return {
      status: "error",
      errors: {},
      message: WAITLIST_SAVE_ERROR,
      values,
    };
  }

  const writeClient = getWriteClient();
  if (!writeClient) {
    console.error("Waitlist save failed. SANITY_API_WRITE_TOKEN is not configured.");
    return {
      status: "error",
      errors: {},
      message: WAITLIST_SAVE_ERROR,
      values,
    };
  }

  try {
    await writeClient.createOrReplace({
      _id: waitlistDocumentId(email, locationSlug),
      _type: "waitlistContact",
      email,
      phone: parsed.data.phone,
      city,
      location: { _type: "reference", _ref: locationId },
      locationSlug,
      marketingOptIn: true,
      smsOptIn: true,
      consentText: WAITLIST_CONSENT_TEXT,
      consentedAt: new Date().toISOString(),
      sourcePath: readSourcePath(formData),
    });
  } catch (error) {
    const statusCode =
      typeof error === "object" && error && "statusCode" in error
        ? (error as { statusCode?: number }).statusCode
        : undefined;
    console.error("Waitlist save failed.", statusCode ?? "");
    return {
      status: "error",
      errors: {},
      message: WAITLIST_SAVE_ERROR,
      values,
    };
  }

  return { status: "success" };
}
