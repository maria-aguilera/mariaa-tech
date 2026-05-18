import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-posts";
import { getAllMdxPostMeta } from "@/lib/mdx";

const SITE_URL = "https://mariaa.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: now, priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: now, priority: 0.9 },
    { url: `${SITE_URL}/projects`, lastModified: now, priority: 0.9 },
    { url: `${SITE_URL}/beyond-work`, lastModified: now, priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: now, priority: 0.3 },
  ];

  const mdxSlugs = new Set(getAllMdxPostMeta().map((post) => post.slug));
  const allPostSlugs = new Set<string>([
    ...blogPosts.map((post) => post.slug),
    ...mdxSlugs,
  ]);

  const postRoutes: MetadataRoute.Sitemap = Array.from(allPostSlugs).map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
