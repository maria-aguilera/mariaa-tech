"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type BlogIndexPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  coverImage: string;
};

type Props = {
  posts: BlogIndexPost[];
  /** Number of tag chips shown by default. Remaining tags accessible via "More". */
  topTagCount?: number;
};

const ALL = "All";

export default function BlogIndex({ posts, topTagCount = 12 }: Props) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState(ALL);
  const [sortDesc, setSortDesc] = useState(true);
  const [showAllTags, setShowAllTags] = useState(false);

  const { topTags, restTags } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const t of post.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    const sorted = Array.from(counts.entries()).sort((a, b) =>
      b[1] - a[1] || a[0].localeCompare(b[0])
    );
    const names = sorted.map(([name]) => name);
    return { topTags: names.slice(0, topTagCount), restTags: names.slice(topTagCount) };
  }, [posts, topTagCount]);

  const visibleTags = [ALL, ...topTags, ...(showAllTags ? restTags : [])];

  // Parse a string like "June 2026" / "2020" / "January 2024" into a sortable number.
  const dateSortKey = (s: string) => {
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
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matchesQuery = (p: BlogIndexPost) =>
      !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
    const matchesTag = (p: BlogIndexPost) => tag === ALL || p.tags.includes(tag);
    const list = posts.filter((p) => matchesQuery(p) && matchesTag(p));
    list.sort((a, b) => {
      const cmp = dateSortKey(b.date) - dateSortKey(a.date);
      return sortDesc ? cmp : -cmp;
    });
    return list;
  }, [posts, query, tag, sortDesc]);

  return (
    <>
      <div className="blog-search">
        <span className="blog-search__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
        <input
          type="search"
          placeholder="Search by title…"
          aria-label="Search by title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="blog-controls">
        <div className="blog-control">
          <span className="blog-control__label">Sort:</span>
          <button type="button" className="blog-control__pill">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 3V7" stroke="currentColor" strokeWidth="2" />
              <path d="M16 3V7" stroke="currentColor" strokeWidth="2" />
              <path d="M3 11H21" stroke="currentColor" strokeWidth="2" />
            </svg>
            Date
          </button>
          <button
            type="button"
            className="blog-control__pill blog-control__pill--icon"
            aria-label={`Sort ${sortDesc ? "ascending" : "descending"}`}
            onClick={() => setSortDesc((v) => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" style={{ transform: sortDesc ? "none" : "scaleY(-1)" }}>
              <path d="M8 7L12 3L16 7" stroke="currentColor" strokeWidth="2" />
              <path d="M12 3V21" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <div className="blog-tags">
          <span className="blog-control__label">Tag:</span>
          <div className="blog-tags__list" role="list">
            {visibleTags.map((t) => (
              <button
                key={t}
                type="button"
                className={`blog-tag ${t === tag ? "blog-tag--active" : ""}`}
                onClick={() => setTag(t)}
              >
                {t}
              </button>
            ))}
            {restTags.length > 0 && (
              <button
                type="button"
                className="blog-tag"
                onClick={() => setShowAllTags((v) => !v)}
              >
                {showAllTags ? "Show less" : `+ ${restTags.length} more`}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="blog-grid">
        {filtered.length === 0 ? (
          <p className="blog-card__excerpt">No posts match that filter.</p>
        ) : (
          filtered.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
              <div className="blog-card__image">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={720}
                  height={420}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                />
                <span className="blog-card__corner" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" />
                    <path d="M10 7H17V14" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
              </div>
              <div className="blog-card__body">
                <h3 className="blog-card__title">{post.title}</h3>
                <div className="blog-card__meta">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 3V7" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 3V7" stroke="currentColor" strokeWidth="2" />
                    <path d="M3 11H21" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>{post.date}</span>
                </div>
                <p className="blog-card__excerpt">{post.excerpt}</p>
                <div className="blog-card__tags">
                  {post.tags.map((t) => (
                    <span key={`${post.slug}-${t}`} className="blog-card__tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
