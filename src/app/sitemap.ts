import type { MetadataRoute } from "next";
import { PRODUCT_ROUTES, STATIC_ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [...STATIC_ROUTES, ...PRODUCT_ROUTES].map((r) => ({ url: absoluteUrl(r.path), lastModified, priority: r.priority }));
}
