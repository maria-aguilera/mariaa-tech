import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BlogIndex, { type BlogIndexPost } from "@/components/BlogIndex";
import { blogPosts } from "@/lib/blog-posts";
import { getAllMdxPostMeta } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Builds, experiments, and case studies across machine learning, forecasting, reinforcement learning, and graph analysis.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Projects · Maria Aguilera",
    description:
      "Builds, experiments, and case studies across machine learning, forecasting, reinforcement learning, and graph analysis.",
    url: "/blog",
  },
};

export default function BlogPage() {
  const mdxPosts = getAllMdxPostMeta();
  const blogSlugs = new Set(blogPosts.map((post) => post.slug));
  const mdxBySlug = new Map(mdxPosts.map((post) => [post.slug, post]));

  const mergedPosts = blogPosts.map((post) => mdxBySlug.get(post.slug) ?? post);
  const extraMdxPosts = mdxPosts.filter((post) => !blogSlugs.has(post.slug));
  const allPosts = [...mergedPosts, ...extraMdxPosts];

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
          <BlogIndex posts={indexPosts} minTagCount={2} />
        </div>
      </section>
    </main>
  );
}
