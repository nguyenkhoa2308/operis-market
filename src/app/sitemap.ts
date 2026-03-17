import type { MetadataRoute } from "next";
import { models } from "@/data/models";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://operis.market";

  const modelEntries: MetadataRoute.Sitemap = models.map((model) => ({
    url: `${baseUrl}/${model.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/market`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...modelEntries,
  ];
}
