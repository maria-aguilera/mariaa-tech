import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BlogIndex, { type BlogIndexPost } from "@/components/BlogIndex";
import { blogPosts } from "@/lib/blog-posts";
import { getAllMdxPostMeta } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing on machine learning, data engineering, and the practical side of building AI systems.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Blog · Maria Aguilera",
    description:
      "Writing on machine learning, data engineering, and the practical side of building AI systems.",
    url: "/projects",
  },
};

export default function BlogIndexPage() {
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
      <PageHero title="Blog" subtitle="Writing on ML, data work, and what I'm building" icon="book-open" />

      <section className="blog-body">
        <div className="blog-body__container">
          <BlogIndex posts={indexPosts} minTagCount={2} defaultSource="Blog" />
        </div>
      </section>
    </main>
  );
}
