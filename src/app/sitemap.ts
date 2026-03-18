import type { MetadataRoute } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://operis.market";

  let modelEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_BASE}/models?limit=1000`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      const models = json.data ?? [];
      modelEntries = models.map((model: { slug: string }) => ({
        url: `${baseUrl}/${model.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // Fallback: no model entries if API is down
  }

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
