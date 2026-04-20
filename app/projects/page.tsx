import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { blogPosts } from "@/lib/blog-posts";
import { getAllMdxPostMeta } from "@/lib/mdx";

export default function ProjectsPage() {
  const mdxPosts = getAllMdxPostMeta();
  const blogSlugs = new Set(blogPosts.map((post) => post.slug));
  const mdxBySlug = new Map(mdxPosts.map((post) => [post.slug, post]));

  const mergedPosts = blogPosts.map((post) => mdxBySlug.get(post.slug) ?? post);
  const extraMdxPosts = mdxPosts.filter((post) => !blogSlugs.has(post.slug));
  const allPosts = [...mergedPosts, ...extraMdxPosts];
  const projectPosts = allPosts.filter((post) => post.source === "Project");

  return (
    <main className="blog-page">
      <PageHero title="Projects" subtitle="Builds, experiments, and case studies" icon="file-text" />

      <section className="blog-body">
        <div className="blog-body__container">
          <div className="page-content">
            <section className="page-section talks-section">
              <div className="talks-section__header">
                <h2>What belongs here</h2>
                <p className="talks-section__lead">
                  Projects are the work samples behind the portfolio: the things I built, tested,
                  or explored deeply enough to turn into a proper write-up.
                </p>
              </div>
            </section>

            <div className="blog-grid">
              {projectPosts.map((post) => (
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
        </div>
      </section>
    </main>
  );
}
