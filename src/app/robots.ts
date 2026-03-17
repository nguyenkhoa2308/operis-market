import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api-keys",
        "/settings",
        "/billing",
        "/usage",
        "/logs",
        "/updates",
        "/login",
        "/register",
        "/verify-email",
      ],
    },
    sitemap: "https://operis.market/sitemap.xml",
  };
}
