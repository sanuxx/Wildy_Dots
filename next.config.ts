import type { NextConfig } from "next";

// GitHub Pages build: the workflow sets NEXT_PUBLIC_BASE_PATH (e.g. "/wildy-dots-site").
// Local dev leaves it unset, so nothing below changes day-to-day behaviour.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const isExport = basePath !== "";

const nextConfig: NextConfig = {
  ...(isExport && {
    output: "export" as const,
    trailingSlash: true,
    basePath,
    images: { loader: "custom" as const, loaderFile: "./image-loader.ts" },
  }),
  // These need a server runtime, so they can't be used in a static export.
  cacheComponents: !isExport,
  partialPrefetching: !isExport,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
