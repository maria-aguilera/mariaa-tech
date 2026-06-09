import Image from "next/image";
import Link from "next/link";

type PostCard = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  coverImage: string;
};

export type SeriesPartCard = {
  part: number;
  title: string;
  slug: string;
  published: boolean;
};

export type SeriesCard = {
  /** Series ID — links to /series/{id} */
  id: string;
  title: string;
  description: string;
  partCount: number;
  publishedCount: number;
  /** Cover image to use as the visual for the series card. */
  coverImage?: string;
  /** Individual parts in the series, each linkable directly. */
  parts: SeriesPartCard[];
};

type Props = {
  title: string;
  /** Optional anchor id for in-page nav. */
  anchor?: string;
  /** Featured series rendered as a panel above standalone posts. */
  series?: SeriesCard;
  /** Standalone posts in this topic. */
  posts: PostCard[];
};

export default function TopicSection({ title, anchor, series, posts }: Props) {
  if (!series && posts.length === 0) return null;

  return (
    <section className="topic-section" id={anchor}>
      <h2 className="topic-section__title">
        <span className="topic-section__label">{title}</span>
        <span className="topic-section__rule" aria-hidden="true" />
      </h2>

      {series && (
        <article className="blog-series-panel">
          <Link
            href={`/series/${series.id}`}
            className="blog-series-panel__hero"
            aria-label={`Read the ${series.title} series overview`}
          >
            {series.coverImage && (
              <div className="blog-series-panel__image">
                <Image
                  src={series.coverImage}
                  alt=""
                  width={720}
                  height={420}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                />
              </div>
            )}
            <div className="blog-series-panel__heroBody">
              <span className="blog-series-panel__chip">
                Series · {series.partCount} parts
              </span>
              <h3 className="blog-series-panel__title">{series.title}</h3>
              <p className="blog-series-panel__description">{series.description}</p>
              <span className="blog-series-panel__cta">
                Series overview
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path
                    d="M13 6L19 12L13 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </Link>

          <ol className="blog-series-panel__parts">
            {series.parts.map((p) => {
              const num = String(p.part).padStart(2, "0");
              const content = (
                <>
                  <span className="blog-series-panel__partNum">Part {num}</span>
                  <span className="blog-series-panel__partTitle">{p.title}</span>
                </>
              );
              if (p.published) {
                return (
                  <li key={p.slug} className="blog-series-panel__part">
                    <Link href={`/blog/${p.slug}`} className="blog-series-panel__partLink">
                      {content}
                      <span className="blog-series-panel__partCta" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                );
              }
              return (
                <li
                  key={p.slug}
                  className="blog-series-panel__part blog-series-panel__part--soon"
                >
                  {content}
                  <span className="blog-series-panel__partChip">Coming soon</span>
                </li>
              );
            })}
          </ol>
        </article>
      )}

      {posts.length > 0 && (
        <div className="topic-section__grid">
          {posts.map((post) => (
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
                  {post.tags.slice(0, 4).map((t) => (
                    <span key={`${post.slug}-${t}`} className="blog-card__tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
