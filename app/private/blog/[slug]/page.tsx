import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import PageHero from "@/components/PageHero";
import { mdxComponents } from "@/components/mdx/MdxComponents";
import { getPrivateMdxPostMeta, getMdxPostBySlug } from "@/lib/mdx";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPrivateMdxPostMeta().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getMdxPostBySlug(decodeURIComponent(slug));
  if (!post?.meta.private) {
    return { robots: { index: false, follow: false } };
  }
  return {
    title: `${post.meta.title} · Private`,
    description: post.meta.subtitle,
    robots: { index: false, follow: false },
  };
}

export default async function PrivateBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = getMdxPostBySlug(decodedSlug);

  // Only render posts that are actually flagged private.
  if (!post || !post.meta.private) notFound();

  const { meta, content } = post;

  return (
    <main id="main-content" className="post-page">
      <PageHero title={meta.title} subtitle={meta.subtitle} icon="book-open" />

      <article className="post">
        <nav className="post-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/private/projects">Private</Link>
          <span className="post-breadcrumbs__sep" aria-hidden="true">›</span>
          <span className="post-breadcrumbs__current">{meta.title}</span>
        </nav>

        <div className="post-card">
          <div className="post-card__meta">
            <span>Maria Aguilera</span>
            {meta.date ? <span>· {meta.date}</span> : null}
            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "#2563eb",
                background: "rgba(37, 99, 235, 0.1)",
                padding: "3px 8px",
                borderRadius: 999,
              }}
            >
              PRIVATE
            </span>
          </div>

          <div className="post-content">
            <MDXRemote
              source={content}
              components={
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                mdxComponents as Record<string, any>
              }
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm, remarkMath],
                  rehypePlugins: [rehypeKatex],
                },
              }}
            />
          </div>
        </div>
      </article>
    </main>
  );
}
