"use client";

import { useEffect, useState } from "react";
import { definePlugin, useClient } from "sanity";

import { apiVersion } from "@/sanity/env";

interface WaitlistExportRow {
  _id: string;
  email?: string;
  phone?: string;
  city?: string;
  locationSlug?: string;
  marketingOptIn?: boolean;
  smsOptIn?: boolean;
  consentText?: string;
  consentedAt?: string;
  lastSubmittedAt?: string;
  submissionCount?: number;
  sourcePath?: string;
}

interface WaitlistLocationOption {
  _id: string;
  city: string;
  slug: string;
}

const COLUMNS = [
  "email",
  "phone",
  "city",
  "locationSlug",
  "marketingOptIn",
  "smsOptIn",
  "consentText",
  "consentedAt",
  "lastSubmittedAt",
  "submissionCount",
  "sourcePath",
] as const satisfies readonly (keyof WaitlistExportRow)[];

const LOCATIONS_QUERY = `*[_type == "location" && defined(slug.current) && defined(city)] | order(sortOrder asc) {
  _id,
  city,
  "slug": slug.current
}`;

const SIGNUPS_QUERY = `*[_type == "waitlistContact" && locationSlug == $slug] | order(consentedAt desc) {
  _id,
  email,
  phone,
  city,
  locationSlug,
  marketingOptIn,
  smsOptIn,
  consentText,
  consentedAt,
  lastSubmittedAt,
  submissionCount,
  sourcePath
}`;

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function toCsv(rows: readonly WaitlistExportRow[]) {
  const header = COLUMNS.join(",");
  const body = rows.map((row) =>
    COLUMNS.map((column) => csvCell(row[column])).join(","),
  );
  return [header, ...body].join("\n");
}

function ExportWaitlistTool() {
  const client = useClient({ apiVersion });
  const [locations, setLocations] = useState<WaitlistLocationOption[]>([]);
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [message, setMessage] = useState(
    "Choose a city, then download its unpublished signups.",
  );

  useEffect(() => {
    let cancelled = false;

    client
      .fetch<WaitlistLocationOption[]>(LOCATIONS_QUERY)
      .then((rows) => {
        if (!cancelled) setLocations(rows);
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
          setMessage("Locations could not be loaded. Try again in a moment.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [client]);

  const selected = locations.find((location) => location.slug === slug);

  async function download() {
    if (!selected) return;

    setStatus("loading");
    setMessage("Preparing the CSV…");

    try {
      const rows = await client
        .withConfig({ perspective: "raw" })
        .fetch<WaitlistExportRow[]>(SIGNUPS_QUERY, { slug: selected.slug });
      const drafts = rows.filter((row) => row._id.startsWith("drafts."));

      if (drafts.length === 0) {
        setStatus("ready");
        setMessage(`No waitlist signups for ${selected.city} yet.`);
        return;
      }

      const blob = new Blob([toCsv(drafts)], {
        type: "text/csv;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `swingrush-waitlist-${selected.slug}-${date}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      setStatus("ready");
      setMessage(
        `Downloaded ${drafts.length} signup${drafts.length === 1 ? "" : "s"} for ${selected.city}.`,
      );
    } catch (error) {
      console.error(
        "Waitlist export failed.",
        error instanceof Error ? error.name : "Unknown error",
      );
      setStatus("error");
      setMessage("The export failed. Try again in a moment.");
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "36rem" }}>
      <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.75rem" }}>
        Export waitlist
      </h1>
      <p role="status" style={{ margin: "0 0 1.25rem", lineHeight: 1.4 }}>
        {message}
      </p>
      <label htmlFor="waitlist-export-location" style={{ display: "block", marginBottom: "0.4rem" }}>
        City
      </label>
      <select
        id="waitlist-export-location"
        value={slug}
        onChange={(event) => setSlug(event.target.value)}
        disabled={locations.length === 0 || status === "loading"}
        style={{
          display: "block",
          width: "100%",
          maxWidth: "20rem",
          marginBottom: "1.25rem",
          padding: "0.55rem 0.7rem",
          font: "inherit",
        }}
      >
        <option value="">Select a city</option>
        {locations.map((location) => (
          <option key={location._id} value={location.slug}>
            {location.city}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={download}
        disabled={!selected || status === "loading"}
        style={{
          padding: "0.6rem 1rem",
          font: "inherit",
          cursor: !selected || status === "loading" ? "not-allowed" : "pointer",
        }}
      >
        {status === "loading" ? "Preparing…" : "Download CSV"}
      </button>
    </div>
  );
}

export const waitlistExportTool = definePlugin({
  name: "waitlist-export",
  tools: [
    {
      name: "waitlist-export",
      title: "Export waitlist",
      component: ExportWaitlistTool,
    },
  ],
});
