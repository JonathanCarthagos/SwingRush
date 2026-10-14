"use server";

import { createHash } from "node:crypto";

import {
  WAITLIST_CONSENT_TEXT,
  WAITLIST_SAVE_ERROR,
} from "@/data/waitlist";
import { cmsFetch } from "@/lib/cms/fetch";
import { normalizeWaitlistEmail, validateWaitlistFields } from "@/lib/waitlist-fields";
import { WAITLIST_LOCATION_QUERY } from "@/sanity/lib/queries";
import { getWriteClient } from "@/sanity/lib/write-client";
import type {
  WaitlistField,
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

function readValues(formData: FormData): WaitlistFormValues {
  const read = (key: WaitlistField) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  return {
    email: normalizeWaitlistEmail(read("email")),
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

function statusCodeOf(error: unknown) {
  if (typeof error === "object" && error && "statusCode" in error) {
    const statusCode = (error as { statusCode?: unknown }).statusCode;
    return typeof statusCode === "number" ? statusCode : undefined;
  }
  return undefined;
}

function safeLogMessage(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  return message
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted]")
    .replace(/\d{7,}/g, "[redacted]");
}

function logWaitlistFailure(details: {
  requestId: string;
  locationSlug: string;
  stage: "location" | "read" | "write";
  statusCode?: number;
  message: string;
}) {
  console.error({ source: "joinWaitlist", ...details });
}

interface ExistingSignup {
  consentedAt?: string;
  submissionCount?: number;
}

export async function joinWaitlist(
  _previousState: WaitlistFormState,
  formData: FormData,
): Promise<WaitlistFormState> {
  const requestId = crypto.randomUUID();
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success" };
  }

  const values = readValues(formData);
  const fieldErrors = validateWaitlistFields({
    email: values.email,
    phone: values.phone,
    location: values.location,
    optIn: formData.get("optIn") === "on",
  });
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", errors: fieldErrors, values };
  }

  const email = values.email.toLowerCase();
  const phone = values.phone.replace(/\D/g, "");
  let location: { _id?: string; city?: string | null; slug?: string | null } | null;
  try {
    location = await cmsFetch<{
      _id?: string;
      city?: string | null;
      slug?: string | null;
    }>({
      query: WAITLIST_LOCATION_QUERY,
      params: { slug: values.location },
      clean: true,
      onError: "throw",
    });
  } catch (error) {
    logWaitlistFailure({
      requestId,
      locationSlug: values.location,
      stage: "location",
      statusCode: statusCodeOf(error),
      message: safeLogMessage(error, "Location lookup failed"),
    });
    return {
      status: "error",
      errors: {},
      message: WAITLIST_SAVE_ERROR,
      values,
    };
  }

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
    logWaitlistFailure({
      requestId,
      locationSlug,
      stage: "write",
      message: "SANITY_API_WRITE_TOKEN is not configured",
    });
    return {
      status: "error",
      errors: {},
      message: WAITLIST_SAVE_ERROR,
      values,
    };
  }

  const documentId = waitlistDocumentId(email, locationSlug);
  let existing: ExistingSignup | null = null;
  try {
    existing = await writeClient.fetch<ExistingSignup | null>(
      `*[_id == $id][0]{ consentedAt, submissionCount }`,
      { id: documentId },
    );
  } catch (error) {
    logWaitlistFailure({
      requestId,
      locationSlug,
      stage: "read",
      statusCode: statusCodeOf(error),
      message: safeLogMessage(error, "Signup lookup failed"),
    });
    return {
      status: "error",
      errors: {},
      message: WAITLIST_SAVE_ERROR,
      values,
    };
  }

  const now = new Date().toISOString();
  const alreadyRegistered = existing != null;
  try {
    await writeClient.createOrReplace({
      _id: documentId,
      _type: "waitlistContact",
      email,
      phone,
      city,
      location: { _type: "reference", _ref: locationId },
      locationSlug,
      marketingOptIn: true,
      smsOptIn: true,
      consentText: WAITLIST_CONSENT_TEXT,
      consentedAt:
        typeof existing?.consentedAt === "string" ? existing.consentedAt : now,
      lastSubmittedAt: now,
      submissionCount: alreadyRegistered
        ? (existing?.submissionCount ?? 1) + 1
        : 1,
      sourcePath: readSourcePath(formData),
    });
  } catch (error) {
    logWaitlistFailure({
      requestId,
      locationSlug,
      stage: "write",
      statusCode: statusCodeOf(error),
      message: safeLogMessage(error, "Signup write failed"),
    });
    return {
      status: "error",
      errors: {},
      message: WAITLIST_SAVE_ERROR,
      values,
    };
  }

  if (alreadyRegistered) return { status: "duplicate", city };
  return { status: "success" };
}
