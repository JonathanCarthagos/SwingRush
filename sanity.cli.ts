import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: process.env.SANITY_STUDIO_HOSTNAME,
  autoUpdates: true,
  typegen: {
    path: "./{app,sanity,lib,components}/**/*.{ts,tsx}",
    schema: "./schema.json",
    generates: "./sanity.types.ts",
  },
});
