import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import TopicSection from "@/components/TopicSection";
import { blogPosts } from "@/lib/blog-posts";
import { getAllMdxPostMeta } from "@/lib/mdx";

const TOPIC_LABELS: Record<string, string> = {
  "machine-learning": "Machine Learning",
  "reinforcement-learning": "Reinforcement Learning",
  networking: "Networking",
  "data-projects": "Data Projects",
  "privacy-security": "Privacy & Security",
};

function dateSortKey(s: string): number {
  if (!s) return 0;
  const m = s.match(/(\w+)?\s*(\d{4})/);
  if (!m) return 0;
  const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
  ];
  const year = Number(m[2]);
  const month = m[1] ? months.indexOf(m[1].toLowerCase()) + 1 : 1;
  return year * 100 + (month > 0 ? month : 1);
}

function slugifyTopic(topic: string) {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

type Params = Promise<{ topic: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { topic } = await params;
  const label = TOPIC_LABELS[topic] ?? topic;
  return {
    title: label,
    description: `All ${label} posts and writing.`,
    alternates: { canonical: `/projects/${topic}` },
  };
}

export default async function TopicPage({ params }: { params: Params }) {
  const { topic: topicSlug } = await params;

  const mdxPosts = getAllMdxPostMeta();
  const mdxBySlug = new Map(mdxPosts.map((p) => [p.slug, p]));
  const blogSlugs = new Set(blogPosts.map((p) => p.slug));
  const mergedPosts = blogPosts.map((p) => mdxBySlug.get(p.slug) ?? p);
  const extraMdxPosts = mdxPosts.filter((p) => !blogSlugs.has(p.slug));
  const allPosts = [...mergedPosts, ...extraMdxPosts];

  const matchingPosts = allPosts.filter((p) => {
    const t = ("topic" in p && p.topic) || "Other";
    return slugifyTopic(t) === topicSlug;
  });

  if (matchingPosts.length === 0) notFound();

  matchingPosts.sort((a, b) => dateSortKey(b.date) - dateSortKey(a.date));

  const title = TOPIC_LABELS[topicSlug] ?? matchingPosts[0]?.topic ?? topicSlug;

  return (
    <main id="main-content" className="blog-page">
      <PageHero
        title={title}
        subtitle={`${matchingPosts.length} ${matchingPosts.length === 1 ? "post" : "posts"} in this topic`}
        icon="book-open"
      />

      <section className="blog-body">
        <div className="blog-body__container">
          <TopicSection
            title={title}
            anchor={topicSlug}
            posts={matchingPosts.map((p) => ({
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt,
              date: p.date,
              tags: p.tags,
              coverImage: p.coverImage,
            }))}
          />
        </div>
      </section>
    </main>
  );
}
