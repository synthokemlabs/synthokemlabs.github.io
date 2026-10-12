import type { NextConfig } from "next";

// Set NEXT_PUBLIC_BASE_PATH (e.g. "/v2") to build the site for a sub-path; empty builds for the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  // Fully static export: every route is pre-rendered HTML (fast, cheap to host, SEO-friendly).
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  basePath,
};

export default nextConfig;
