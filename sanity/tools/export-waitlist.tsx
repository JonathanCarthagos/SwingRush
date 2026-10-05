"use client";

import { useState } from "react";
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
  sourcePath?: string;
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
  "sourcePath",
] as const satisfies readonly (keyof WaitlistExportRow)[];

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
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [message, setMessage] = useState(
    "Downloads every unpublished waitlist signup.",
  );

  async function download() {
    setStatus("loading");
    setMessage("Preparing the CSV…");

    try {
      const rows = await client
        .withConfig({ perspective: "raw" })
        .fetch<WaitlistExportRow[]>(
          `*[_type == "waitlistContact"] | order(consentedAt desc) {
            _id,
            email,
            phone,
            city,
            locationSlug,
            marketingOptIn,
            smsOptIn,
            consentText,
            consentedAt,
            sourcePath
          }`,
        );
      const drafts = rows.filter((row) => row._id.startsWith("drafts."));

      if (drafts.length === 0) {
        setStatus("ready");
        setMessage("No waitlist signups to export yet.");
        return;
      }

      const blob = new Blob([toCsv(drafts)], {
        type: "text/csv;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `swingrush-waitlist-${date}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      setStatus("ready");
      setMessage(
        `Downloaded ${drafts.length} signup${drafts.length === 1 ? "" : "s"}.`,
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
      <button
        type="button"
        onClick={download}
        disabled={status === "loading"}
        style={{
          padding: "0.6rem 1rem",
          font: "inherit",
          cursor: status === "loading" ? "progress" : "pointer",
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
