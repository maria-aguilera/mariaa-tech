import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BlogIndex, { type BlogIndexPost } from "@/components/BlogIndex";
import { blogPosts } from "@/lib/blog-posts";
import { getAllMdxPostMeta } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects, posts, and case studies across machine learning, NLP, data engineering, and the practical side of building AI systems.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Projects · Maria Aguilera",
    description:
      "Projects, posts, and case studies across machine learning, NLP, data engineering, and the practical side of building AI systems.",
    url: "/blog",
  },
};

export default function BlogPage() {
  const mdxPosts = getAllMdxPostMeta();
  const blogSlugs = new Set(blogPosts.map((post) => post.slug));
  const mdxBySlug = new Map(mdxPosts.map((post) => [post.slug, post]));

  const mergedPosts = blogPosts
    .map((post) => mdxBySlug.get(post.slug) ?? post)
    .filter((post) => !("draft" in post && (post as { draft?: boolean }).draft));
  const extraMdxPosts = mdxPosts.filter(
    (post) => !blogSlugs.has(post.slug) && !post.unlisted && !post.draft,
  );
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
      <PageHero title="Projects" subtitle="Projects, posts, and what I'm building" icon="book-open" />

      <section className="blog-body">
        <div className="blog-body__container">
          <BlogIndex posts={indexPosts} minTagCount={2} />
        </div>
      </section>
    </main>
  );
}
