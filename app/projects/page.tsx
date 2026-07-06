import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import TopicSection, { type SeriesCard } from "@/components/TopicSection";
import { blogPosts } from "@/lib/blog-posts";
import { getPublicMdxPostMeta } from "@/lib/mdx";
import { series as allSeries } from "@/lib/series";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Builds, experiments, and case studies across machine learning, forecasting, reinforcement learning, and graph analysis.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects · Maria Aguilera",
    description:
      "Builds, experiments, and case studies across machine learning, forecasting, reinforcement learning, and graph analysis.",
    url: "/projects",
  },
};

// Ordered topic list. Posts with topics not listed here fall into "Other".
const TOPIC_ORDER = [
  "Machine Learning",
  "NLP",
  "Reinforcement Learning",
  "Networking",
  "Data Projects",
  "Privacy & Security",
] as const;

// Sort key derived from a date string like "June 2024" / "2020".
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
  const allPosts = [...mergedPosts, ...extraMdxPosts];

  // Group by topic.
  const byTopic = new Map<string, typeof allPosts>();
  for (const post of allPosts) {
    const topic = ("topic" in post && post.topic) || "Other";
    if (!byTopic.has(topic)) byTopic.set(topic, []);
    byTopic.get(topic)!.push(post);
  }

  // Sort each topic's posts newest-first.
  for (const [, posts] of byTopic) {
    posts.sort((a, b) => dateSortKey(b.date) - dateSortKey(a.date));
  }

  // Build the section list in deterministic order.
  const orderedTopics = [
    ...TOPIC_ORDER.filter((t) => byTopic.has(t)),
    ...[...byTopic.keys()].filter((t) => !TOPIC_ORDER.includes(t as (typeof TOPIC_ORDER)[number])),
  ];

  // For the Machine Learning topic, suppress posts that belong to the series
  // (the series card represents them).
  const mlSeries = allSeries.find((s) => s.id === "ml-from-scratch");
  const mlSeriesSlugs = new Set(mlSeries?.posts.map((p) => p.slug) ?? []);

  return (
    <main id="main-content" className="blog-page">
      <PageHero title="Projects" subtitle="Builds, experiments, and case studies" icon="file-text" />

      <section className="blog-body">
        <div className="blog-body__container">
          {orderedTopics.map((topic) => {
            const allTopicPosts = byTopic.get(topic) ?? [];

            // Featured series for this topic (only Machine Learning for now).
            let seriesCard: SeriesCard | undefined;
            let visiblePosts = allTopicPosts;

            if (topic === "Machine Learning" && mlSeries) {
              const publishedCount = mlSeries.posts.filter((p) => p.published).length;
              // Cover image: use the first post in the series as the visual.
              const firstSlug = mlSeries.posts[0]?.slug;
              const cover =
                firstSlug && mdxBySlug.get(firstSlug)?.coverImage;
              seriesCard = {
                id: mlSeries.id,
                title: mlSeries.title,
                description: mlSeries.description,
                partCount: mlSeries.posts.length,
                publishedCount,
                coverImage: cover,
                parts: mlSeries.posts.map((p) => ({
                  part: p.part,
                  title: p.title,
                  slug: p.slug,
                  published: p.published,
                  children: p.children?.map((c) => ({
                    part: c.part,
                    title: c.title,
                    slug: c.slug,
                    published: c.published,
                  })),
                })),
              };
              // Hide individual series posts from the topic grid.
              visiblePosts = allTopicPosts.filter((p) => !mlSeriesSlugs.has(p.slug));
            }

            const topicSlug = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <TopicSection
                key={topic}
                title={topic}
                anchor={topicSlug}
                series={seriesCard}
                posts={visiblePosts.map((p) => ({
                  slug: p.slug,
                  title: p.title,
                  excerpt: p.excerpt,
                  date: p.date,
                  tags: p.tags,
                  coverImage: p.coverImage,
                }))}
                maxVisible={5}
                topicSlug={topicSlug}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
