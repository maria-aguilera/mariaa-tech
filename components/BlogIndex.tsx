"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const POSTS_PER_PAGE = 12;

export type PostSource = "Blog" | "Project" | "Notes";

export type BlogIndexPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  coverImage: string;
  source: PostSource;
};

type Props = {
  posts: BlogIndexPost[];
  /** Hide tags appearing in fewer than this many posts (still accessible via "More"). */
  minTagCount?: number;
  /** Pre-select a source filter when the page loads. */
  defaultSource?: SourceFilter;
};

const ALL_TAGS = "All";
const ALL_SOURCES = "All" as const;

type SourceFilter = typeof ALL_SOURCES | PostSource;

const STATS: { key: SourceFilter; label: string }[] = [
  { key: ALL_SOURCES, label: "Everything" },
  { key: "Blog", label: "Blog Posts" },
  { key: "Project", label: "Projects" },
  { key: "Notes", label: "Notes" },
];

export default function BlogIndex({ posts, minTagCount = 2, defaultSource = ALL_SOURCES }: Props) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState(ALL_TAGS);
  const [source, setSource] = useState<SourceFilter>(defaultSource);
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);

  /* All tags with >= minTagCount posts are shown; the row scrolls
   * horizontally so we don't need to truncate (kozodoi's pattern). */

  const tagCounts = useMemo(() => {
    const c = new Map<string, number>();
    for (const post of posts) {
      for (const t of post.tags) c.set(t, (c.get(t) ?? 0) + 1);
    }
    return c;
  }, [posts]);

  const { topTags } = useMemo(() => {
    const sorted = Array.from(tagCounts.entries()).sort((a, b) =>
      b[1] - a[1] || a[0].localeCompare(b[0])
    );
    const top = sorted
      .filter(([, n]) => n >= minTagCount)
      .map(([name]) => name);
    return { topTags: top };
  }, [tagCounts, minTagCount]);

  const visibleTags = [ALL_TAGS, ...topTags];

  const sourceCounts = useMemo(() => {
    const c: Record<SourceFilter, number> = { All: posts.length, Blog: 0, Project: 0, Notes: 0 };
    for (const p of posts) c[p.source]++;
    return c;
  }, [posts]);

  const topicsCount = tagCounts.size;

  // Parse a date string like "June 2026" / "2020" / "January 2024" into a sortable number.
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
    const list = posts.filter((p) => {
      if (source !== ALL_SOURCES && p.source !== source) return false;
      if (tag !== ALL_TAGS && !p.tags.includes(tag)) return false;
      if (q && !p.title.toLowerCase().includes(q) && !p.excerpt.toLowerCase().includes(q)) return false;
      return true;
    });
    list.sort((a, b) => {
      const cmp = dateSortKey(b.date) - dateSortKey(a.date);
      return sortDesc ? cmp : -cmp;
    });
    return list;
  }, [posts, query, tag, source, sortDesc]);

  // Reset to page 1 whenever the filter/search/sort changes.
  useEffect(() => {
    setPage(1);
  }, [query, tag, source, sortDesc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * POSTS_PER_PAGE;
  const pagePosts = filtered.slice(pageStart, pageStart + POSTS_PER_PAGE);

  // Build a compact page-button list: always include 1, totalPages, and
  // a small window around the current page; collapse the rest with "…".
  const pageButtons = useMemo<(number | "ellipsis")[]>(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const window = new Set<number>([1, totalPages, safePage]);
    if (safePage > 1) window.add(safePage - 1);
    if (safePage < totalPages) window.add(safePage + 1);
    const sorted = [...window].sort((a, b) => a - b);
    const out: (number | "ellipsis")[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("ellipsis");
      out.push(sorted[i]);
    }
    return out;
  }, [totalPages, safePage]);

  return (
    <>
      <div className="blog-stats">
        {STATS.map((s) => {
          const value =
            s.key === ALL_SOURCES ? topicsCount : sourceCounts[s.key];
          const labelForCount =
            s.key === ALL_SOURCES ? "Topics" : s.label;
          return (
            <button
              key={s.key}
              type="button"
              className={`blog-stat blog-stat--button${source === s.key ? " blog-stat--active" : ""}`}
              onClick={() => setSource(s.key)}
              aria-pressed={source === s.key}
            >
              <div className="blog-stat__value">{s.key === ALL_SOURCES ? sourceCounts.All : sourceCounts[s.key]}</div>
              <div className="blog-stat__label">{s.label}</div>
            </button>
          );
        })}
      </div>

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
            {/* CalendarArrowDown / CalendarArrowUp — matches kozodoi */}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 11H21" stroke="currentColor" strokeWidth="2" />
              {sortDesc ? (
                <>
                  <path d="M12 14V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9.5 16.5L12 19L14.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </>
              ) : (
                <>
                  <path d="M12 19V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9.5 16.5L12 14L14.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </>
              )}
            </svg>
          </button>
        </div>

        <span className="blog-controls__divider" aria-hidden="true" />

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
          </div>
        </div>

        {(query !== "" || tag !== ALL_TAGS || source !== ALL_SOURCES || !sortDesc) && (
          <button
            type="button"
            className="blog-controls__clear"
            onClick={() => {
              setQuery("");
              setTag(ALL_TAGS);
              setSource(ALL_SOURCES);
              setSortDesc(true);
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="blog-grid">
        {filtered.length === 0 ? (
          <p className="blog-card__excerpt">No posts match that filter.</p>
        ) : (
          pagePosts.map((post) => (
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

      {totalPages > 1 && (
        <nav className="blog-pagination" aria-label="Pagination">
          <button
            type="button"
            className="blog-pagination__btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Previous</span>
          </button>

          <ul className="blog-pagination__pages">
            {pageButtons.map((b, i) =>
              b === "ellipsis" ? (
                <li key={`e-${i}`} className="blog-pagination__ellipsis">…</li>
              ) : (
                <li key={b}>
                  <button
                    type="button"
                    className={`blog-pagination__pageBtn ${b === safePage ? "blog-pagination__pageBtn--active" : ""}`}
                    onClick={() => setPage(b)}
                    aria-current={b === safePage ? "page" : undefined}
                  >
                    {b}
                  </button>
                </li>
              )
            )}
          </ul>

          <button
            type="button"
            className="blog-pagination__btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
          >
            <span>Next</span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </nav>
      )}
    </>
  );
}
