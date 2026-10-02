import type { NextConfig } from "next";

import { imageJpegQuality } from "./scripts/image-compression.mjs";

// Shared with scripts/compress-images.mjs so source files and delivery match.

const nextConfig: NextConfig = {
  images: {
    qualities: [imageJpegQuality],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
