import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { mdxComponents } from "@/components/mdx/MdxComponents";
import { cheatComponents } from "@/components/mdx/CheatComponents";
import {
  getAllCheatsheetMeta,
  getCheatsheetBySlug,
} from "@/lib/cheatsheets";

type CheatsheetPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CheatsheetPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const sheet = getCheatsheetBySlug(decodedSlug);

  if (!sheet) {
    return {};
  }

  return {
    title: `${sheet.meta.title} · Cheat sheet`,
    description: sheet.meta.subtitle,
    alternates: { canonical: `/cheatsheets/${decodedSlug}` },
  };
}

export function generateStaticParams() {
  return getAllCheatsheetMeta().map((meta) => ({ slug: meta.slug }));
}

export default async function CheatsheetPage({ params }: CheatsheetPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const sheet = getCheatsheetBySlug(decodedSlug);

  if (!sheet) {
    notFound();
  }

  const { meta, content } = sheet;
  const sourceHref = meta.sourcePost
    ? `/blog/${meta.sourcePost}`
    : meta.sourceProject
    ? `/projects/${meta.sourceProject}`
    : null;

  return (
    <main id="main-content" className="cheat-page">
      <header className="cheat-header">
        <nav className="cheat-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="cheat-breadcrumbs__sep" aria-hidden="true">›</span>
          <Link href="/cheatsheets">Cheat sheets</Link>
          <span className="cheat-breadcrumbs__sep" aria-hidden="true">›</span>
          <span className="cheat-breadcrumbs__current">{meta.title}</span>
        </nav>

        <div className="cheat-header__inner">
          <p className="cheat-header__eyebrow">Cheat sheet</p>
          <h1 className="cheat-header__title">{meta.title}</h1>
          {meta.subtitle && (
            <p className="cheat-header__subtitle">{meta.subtitle}</p>
          )}

          <div className="cheat-header__meta">
            {sourceHref && (
              <Link className="cheat-header__source" href={sourceHref}>
                ← {meta.sourceLabel ?? "Read the full post"}
              </Link>
            )}
            {meta.updated && (
              <span className="cheat-header__updated">
                Updated {meta.updated}
              </span>
            )}
          </div>
        </div>
      </header>

      {meta.image && (
        <section className="cheat-preview" aria-label="Printable cheat sheet">
          <figure className="cheat-preview__figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="cheat-preview__image"
              src={meta.image}
              alt={`${meta.title} — printable cheat sheet`}
              loading="eager"
            />
          </figure>
          <div className="cheat-preview__actions">
            <a
              className="cheat-preview__download"
              href={meta.image}
              download
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download PNG</span>
            </a>
            <p className="cheat-preview__hint">
              Or read the searchable version below.
            </p>
          </div>
        </section>
      )}

      <article className="cheat-body">
        <MDXRemote
          source={content}
          components={
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { ...mdxComponents, ...cheatComponents } as Record<string, any>
          }
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm, remarkMath],
              rehypePlugins: [rehypeKatex],
            },
          }}
        />
      </article>

      <footer className="cheat-footer">
        <p>
          mariaa.tech &middot;{" "}
          {sourceHref ? (
            <Link href={sourceHref}>{meta.sourceLabel ?? "Source post"}</Link>
          ) : (
            "Source"
          )}
        </p>
        <p className="cheat-footer__hint">
          Press <kbd>⌘ P</kbd> to print as PDF
        </p>
      </footer>
    </main>
  );
}
