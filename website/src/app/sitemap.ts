import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...getContent().docs.map((d) => ({
      url: `${SITE_URL}${d.url}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
