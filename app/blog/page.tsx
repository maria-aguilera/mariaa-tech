import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BlogIndex, { type BlogIndexPost } from "@/components/BlogIndex";
import { blogPosts } from "@/lib/blog-posts";
import { getAllMdxPostMeta } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing on machine learning, data engineering, and the practical side of building AI systems.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog · Maria Aguilera",
    description:
      "Writing on machine learning, data engineering, and the practical side of building AI systems.",
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

  const blogPostsCount = allPosts.filter((post) => post.source === "Blog").length;
  const projectsCount = allPosts.filter((post) => post.source === "Project").length;
  const notesCount = allPosts.filter((post) => post.source === "Notes").length;
  const topicsCount = new Set(allPosts.flatMap((post) => post.tags)).size;

  const stats = [
    { value: String(blogPostsCount), label: "Blog Posts" },
    { value: String(projectsCount), label: "Projects" },
    { value: String(notesCount), label: "Notes" },
    { value: String(topicsCount), label: "Topics" },
  ];

  const indexPosts: BlogIndexPost[] = allPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    tags: post.tags,
    coverImage: post.coverImage,
  }));

  return (
    <main id="main-content" className="blog-page">
      <PageHero title="Technical Blog" subtitle="AI insights and customer stories" icon="book-open" />

      <section className="blog-body">
        <div className="blog-body__container">
          <div className="blog-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="blog-stat">
                <div className="blog-stat__value">{stat.value}</div>
                <div className="blog-stat__label">{stat.label}</div>
              </div>
            ))}
          </div>

          <BlogIndex posts={indexPosts} topTagCount={12} />
        </div>
      </section>
    </main>
  );
}
