import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import PageHero from "@/components/PageHero";
import { mdxComponents } from "@/components/mdx/MdxComponents";
import { blogPosts, type BlogPostBlock } from "@/lib/blog-posts";
import { highlightCode } from "@/lib/code-highlight";
import { getAllMdxPostMeta, getMdxPostBySlug } from "@/lib/mdx";
import { extractTocFromMdx } from "@/lib/toc";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const mdxPost = getMdxPostBySlug(decodedSlug);
  const meta = mdxPost?.meta;
  const fallback = blogPosts.find((item) => item.slug === decodedSlug);
  const title = meta?.title ?? fallback?.title;
  const description = meta?.subtitle ?? fallback?.subtitle ?? fallback?.excerpt;
  const coverImage = meta?.coverImage ?? fallback?.coverImage;

  if (!title) {
    return {};
  }

  return {
    title,
    description,
    alternates: { canonical: `/blog/${decodedSlug}` },
    openGraph: {
      type: "article",
      title: `${title} · Maria Aguilera`,
      description,
      url: `/blog/${decodedSlug}`,
      images: coverImage ? [coverImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Maria Aguilera`,
      description,
      images: coverImage ? [coverImage] : undefined,
    },
  };
}

export function generateStaticParams() {
  const mdxPosts = getAllMdxPostMeta();
  const slugs = new Set([
    ...blogPosts.map((post) => post.slug),
    ...mdxPosts.map((post) => post.slug),
  ]);

  return Array.from(slugs).map((slug) => ({ slug }));
}

const renderBlock = async (block: BlogPostBlock, key: string) => {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={key} className="post-content__paragraph">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul key={key} className="post-content__list">
          {block.items.map((item) => (
            <li key={`${key}-${item}`}>{item}</li>
          ))}
        </ul>
      );
    case "code":
      return (
        <div
          key={key}
          className="post-content__code"
          dangerouslySetInnerHTML={{
            __html: await highlightCode(block.code, block.language),
          }}
        />
      );
    case "image":
      return (
        <figure key={key} className="post-figure">
          <Image
            src={block.src}
            alt={block.alt}
            width={1200}
            height={700}
            sizes="(min-width: 1024px) 720px, 90vw"
          />
          {block.caption ? (
            <figcaption className="post-figure__caption">{block.caption}</figcaption>
          ) : null}
        </figure>
      );
    case "subheading":
      return (
        <h3 key={key} className="post-content__subheading">
          {block.text}
        </h3>
      );
    case "links":
      return (
        <ul key={key} className="post-links">
          {block.items.map((item) => (
            <li key={`${key}-${item.href}`}>
              <a href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const mdxPost = getMdxPostBySlug(decodedSlug);

  if (mdxPost) {
    const { meta, content } = mdxPost;
    const toc = extractTocFromMdx(content);
    const isNavy = meta.style === "navy";
    const heroBanner = meta.bannerImage || meta.coverImage;

    return (
      <main
        id="main-content"
        className={`post-page${isNavy ? " post-page--navy" : ""}`}
      >
        <PageHero title={meta.title} subtitle={meta.subtitle} icon="book-open" />

        <article className="post">
          <nav className="post-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="post-breadcrumbs__sep" aria-hidden="true">
              ›
            </span>
            <Link href="/blog">Blog</Link>
            <span className="post-breadcrumbs__sep" aria-hidden="true">
              ›
            </span>
            <span className="post-breadcrumbs__current">{meta.title}</span>
          </nav>

          <div className="post-card">
            <div className="post-card__media">
              <Image
                src={heroBanner}
                alt={meta.title}
                width={1400}
                height={700}
                sizes="(min-width: 1024px) 960px, 100vw"
                priority
              />
              <div className="post-card__mediaOverlay" aria-hidden="true" />
            </div>

            <div className="post-card__meta">
              <div className="post-card__metaRow">
                <div className="post-card__metaItem">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span className="post-card__metaLabel">Maria Aguilera</span>
                </div>
                <div className="post-card__metaItem">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 3V7" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 3V7" stroke="currentColor" strokeWidth="2" />
                    <path d="M3 11H21" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>{meta.date}</span>
                </div>
              </div>
              <p className="post-card__summary">{meta.subtitle}</p>
            </div>

            <div className="post-card__body">
              {toc.length ? (
                <div className="post-toc">
                  <h3>Table of Contents</h3>
                  <ul>
                    {toc.map((item, index) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`}>
                          {index + 1}. {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="post-content">
                {meta.updated ? (
                  <p className="post-content__note">
                    Last update: {meta.updated}. All opinions are my own.
                  </p>
                ) : null}

                <MDXRemote
                  source={content}
                  components={mdxComponents as Record<string, any>}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm, remarkMath],
                      rehypePlugins: [rehypeKatex],
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </article>
      </main>
    );
  }

  const postBySlug = blogPosts.find((item) => item.slug === decodedSlug);
  const index = Number(decodedSlug);
  const postByIndex =
    Number.isInteger(index) && index >= 0 && index < blogPosts.length
      ? blogPosts[index]
      : null;
  const post = postBySlug ?? postByIndex;

  if (!post) {
    notFound();
  }

  return (
    <main className="post-page">
      <PageHero title={post.title} subtitle={post.subtitle} icon="book-open" />

      <article className="post">
        <nav className="post-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="post-breadcrumbs__sep" aria-hidden="true">
            ›
          </span>
          <Link href="/blog">Blog</Link>
          <span className="post-breadcrumbs__sep" aria-hidden="true">
            ›
          </span>
          <span className="post-breadcrumbs__current">{post.title}</span>
        </nav>

        <div className="post-card">
          <div className="post-card__media">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1400}
              height={700}
              sizes="(min-width: 1024px) 960px, 100vw"
              priority
            />
            <div className="post-card__mediaOverlay" aria-hidden="true" />
          </div>

          <div className="post-card__meta">
            <div className="post-card__metaRow">
              <div className="post-card__metaItem">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="post-card__metaLabel">Maria Aguilera</span>
              </div>
              <div className="post-card__metaItem">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 3V7" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 3V7" stroke="currentColor" strokeWidth="2" />
                  <path d="M3 11H21" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>{post.date}</span>
              </div>
            </div>
            <p className="post-card__summary">{post.subtitle}</p>
          </div>

          <div className="post-card__body">
            <div className="post-toc">
              <h3>Table of Contents</h3>
              <ul>
                {post.sections.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>
                      {index + 1}. {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="post-content">
              {post.updated ? (
                <p className="post-content__note">Last update: {post.updated}. All opinions are my own.</p>
              ) : null}

              {await Promise.all(
                post.sections.map(async (section, index) => (
                  <section key={section.id} className="post-section">
                    <h2 id={section.id}>
                      {index + 1}. {section.title}
                    </h2>
                    {await Promise.all(
                      section.blocks.map((block, blockIndex) =>
                        renderBlock(block, `${section.id}-${blockIndex}`)
                      )
                    )}
                  </section>
                ))
              )}
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
