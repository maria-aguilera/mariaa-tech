import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SeriesCard, { type SeriesCardPost } from "@/components/SeriesCard";
import { series } from "@/lib/series";
import { getPublicMdxPostMeta } from "@/lib/mdx";
import { blogPosts } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Guides · Maria Aguilera",
  description:
    "Multi-part walkthroughs across machine learning, NLP, and more — each one a complete guide from course notes to code.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Guides · Maria Aguilera",
    description:
      "Multi-part walkthroughs across machine learning, NLP, and more — each one a complete guide from course notes to code.",
    url: "/guides",
  },
};

function buildSlugToCover(): Map<string, string> {
  const map = new Map<string, string>();
  for (const post of getPublicMdxPostMeta()) {
    if (post.coverImage) map.set(post.slug, post.coverImage);
  }
  for (const post of blogPosts) {
    if (!map.has(post.slug) && post.coverImage) map.set(post.slug, post.coverImage);
  }
  return map;
}

export default function SeriesIndexPage() {
  const slugToCover = buildSlugToCover();

  return (
    <main id="main-content" className="series-index">
      <PageHero
        title="Guides"
        subtitle="Multi-part walkthroughs. Each one starts at the intuition and walks you all the way down to the code."
        icon="book-open"
      />

      <section className="series-index__inner">
        <ul className="series-index__list">
          {series.filter((s) => !s.private).map((s) => {
            const posts: SeriesCardPost[] = s.posts.map((p) => ({
              part: p.part,
              title: p.title,
              slug: p.slug,
              published: p.published,
              coverImage: slugToCover.get(p.slug),
            }));
            return (
              <li key={s.id}>
                <SeriesCard
                  id={s.id}
                  title={s.title}
                  description={s.description}
                  posts={posts}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
