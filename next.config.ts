import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static export: every route is pre-rendered HTML (fast, cheap to host, SEO-friendly).
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
