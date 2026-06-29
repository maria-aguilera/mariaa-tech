"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type SeriesCardPost = {
  part: number;
  title: string;
  slug: string;
  published: boolean;
  coverImage?: string;
};

type Props = {
  id: string;
  title: string;
  description: string;
  posts: SeriesCardPost[];
};

const FALLBACK_COVER = "/featured-media.svg";

export default function SeriesCard({ id, title, description, posts }: Props) {
  const total = posts.length;
  const publishedCount = posts.filter((p) => p.published).length;

  // Only published posts are reachable; start at the first published one.
  const publishedPosts = posts.filter((p) => p.published);
  const [index, setIndex] = useState(0);

  if (publishedPosts.length === 0) {
    // Edge case: no published posts yet — render a plain card.
    return (
      <article className="series-card series-card--empty">
        <span className="series-card__chip">{publishedCount} of {total} published</span>
        <h2 className="series-card__title">{title}</h2>
        <p className="series-card__desc">{description}</p>
        <Link href={`/series/${id}`} className="series-card__cta">View all parts →</Link>
      </article>
    );
  }

  const current = publishedPosts[index];
  const cover = current.coverImage || FALLBACK_COVER;

  const go = (delta: number) => {
    setIndex((i) => (i + delta + publishedPosts.length) % publishedPosts.length);
  };

  return (
    <article className="series-card">
      <header className="series-card__header">
        <span className="series-card__chip">{publishedCount} of {total} published</span>
        <h2 className="series-card__title">{title}</h2>
        <p className="series-card__desc">{description}</p>
      </header>

      <Link href={`/blog/${current.slug}`} className="series-card__cover-link" aria-label={`Read Part ${current.part}: ${current.title}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={`${title} · Part ${current.part}: ${current.title}`}
          className="series-card__cover"
          loading="lazy"
        />
      </Link>

      <div className="series-card__controls">
        <button
          type="button"
          className="series-card__arrow"
          onClick={() => go(-1)}
          aria-label="Previous part"
          disabled={publishedPosts.length <= 1}
        >
          <ChevronLeft size={18} />
        </button>

        <div className="series-card__current">
          <span className="series-card__current-num">Part {String(current.part).padStart(2, "0")}</span>
          <span className="series-card__current-title">{current.title}</span>
        </div>

        <button
          type="button"
          className="series-card__arrow"
          onClick={() => go(1)}
          aria-label="Next part"
          disabled={publishedPosts.length <= 1}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="series-card__footer">
        <Link href={`/blog/${current.slug}`} className="series-card__read">
          Read this part →
        </Link>
        <Link href={`/series/${id}`} className="series-card__all">
          View all parts
        </Link>
      </div>
    </article>
  );
}
