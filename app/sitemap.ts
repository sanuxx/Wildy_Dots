import type { MetadataRoute } from "next";
import { categories, SITE } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/gallery", "/framing", "/showrooms", "/foundation", "/contact", "/privacy"];
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...categories.map((c) => ({ url: `${SITE.url}/gallery/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
