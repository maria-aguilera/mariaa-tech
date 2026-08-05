import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BlogIndex, { type BlogIndexPost } from "@/components/BlogIndex";
import { blogPosts } from "@/lib/blog-posts";
import { getPublicMdxPostMeta } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Writing on machine learning, data engineering, and the practical side of building AI systems.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects · Maria Aguilera",
    description:
      "Writing on machine learning, data engineering, and the practical side of building AI systems.",
    url: "/projects",
  },
};

export default function BlogIndexPage() {
  const mdxPosts = getPublicMdxPostMeta();
  const blogSlugs = new Set(blogPosts.map((post) => post.slug));
  const mdxBySlug = new Map(mdxPosts.map((post) => [post.slug, post]));

  // Prefer MDX version when both exist (MDX has the up-to-date metadata).
  const mergedPosts = blogPosts
    .map((post) => mdxBySlug.get(post.slug) ?? post)
    .filter((post) => !("draft" in post && (post as { draft?: boolean }).draft));
  const extraMdxPosts = mdxPosts.filter(
    (post) => !blogSlugs.has(post.slug) && !post.unlisted && !post.draft,
  );
  // Posts that belong to an editorial series live under /guides — hide them
  // here so /projects only shows standalone posts and one-off case studies.
  const allPosts = [...mergedPosts, ...extraMdxPosts].filter(
    (post) => !("series" in post && (post as { series?: string }).series),
  );

  const indexPosts: BlogIndexPost[] = allPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    tags: post.tags,
    coverImage: post.coverImage,
    source: post.source,
  }));

  return (
    <main id="main-content" className="blog-page">
      <PageHero title="Projects" subtitle="Builds, experiments, and case studies" icon="file-text" />

      <section className="blog-body">
        <div className="blog-body__container">
          <BlogIndex posts={indexPosts} minTagCount={4} defaultSource="Blog" />
        </div>
      </section>
    </main>
  );
}
