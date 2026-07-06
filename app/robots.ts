import type { MetadataRoute } from "next";

const SITE_URL = "https://mariaa.tech";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private work-OS — behind cookie-based unlock. Excluded from indexing.
        disallow: ["/private/", "/api/private/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
