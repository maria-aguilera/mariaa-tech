import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { blogPosts } from "@/lib/blog-posts";
import { getAllMdxPostMeta } from "@/lib/mdx";

export default function BlogPage() {
  const mdxPosts = getAllMdxPostMeta();
  const blogSlugs = new Set(blogPosts.map((post) => post.slug));
  const mdxBySlug = new Map(mdxPosts.map((post) => [post.slug, post]));

  const mergedPosts = blogPosts.map((post) => mdxBySlug.get(post.slug) ?? post);
  const extraMdxPosts = mdxPosts.filter((post) => !blogSlugs.has(post.slug));
  const allPosts = [...mergedPosts, ...extraMdxPosts];

  const uniqueTags = Array.from(
    new Set(allPosts.flatMap((post) => post.tags))
  ).sort((a, b) => a.localeCompare(b));

  const tags = ["All", ...uniqueTags];

  const blogPostsCount = allPosts.filter((post) => post.source === "Blog").length;
  const projectsCount = allPosts.filter((post) => post.source === "Project").length;
  const notesCount = allPosts.filter((post) => post.source === "Notes").length;

  const stats = [
    { value: String(blogPostsCount), label: "Blog Posts" },
    { value: String(projectsCount), label: "Projects" },
    { value: String(notesCount), label: "Notes" },
    { value: String(new Set(allPosts.flatMap((post) => post.tags)).size), label: "Topics" },
  ];

  return (
    <main className="blog-page">
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

          <div className="blog-search">
            <span className="blog-search__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            <input type="search" placeholder="Search by title..." aria-label="Search by title" />
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
              <button type="button" className="blog-control__pill blog-control__pill--icon" aria-label="Sort direction">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M8 7L12 3L16 7" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 3V21" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>

            <div className="blog-tags">
              <span className="blog-control__label">Tag:</span>
              <div className="blog-tags__list" role="list">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`blog-tag ${tag === "All" ? "blog-tag--active" : ""}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="blog-grid">
            {allPosts.map((post) => (
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
                    {post.tags.map((tag) => (
                      <span key={`${post.slug}-${tag}`} className="blog-card__tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
