import type { MetadataRoute } from "next";

const SITE_URL = "https://recigle.kkweb.io";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 1,
      url: SITE_URL,
    },
  ];
}
