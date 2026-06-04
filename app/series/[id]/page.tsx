import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { series } from "@/lib/series";

type SeriesPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return series.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
  const { id } = await params;
  const s = series.find((entry) => entry.id === id);
  if (!s) return {};
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: `/series/${s.id}` },
    openGraph: {
      title: `${s.title} · Maria Aguilera`,
      description: s.description,
      url: `/series/${s.id}`,
    },
  };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { id } = await params;
  const s = series.find((entry) => entry.id === id);
  if (!s) notFound();

  return (
    <main id="main-content" className="blog-page">
      <PageHero title={s.title} subtitle={s.description} icon="book-open" />

      <section className="blog-body">
        <div className="blog-body__container">
          <div className="series-detail">
            <p className="series-detail__intro">
              {s.posts.length} parts. Posts marked <em>Coming soon</em> are still being written.
            </p>

            <ol className="series-detail__list">
              {s.posts.map((p) => {
                const num = String(p.part).padStart(2, "0");
                const content = (
                  <>
                    <span className="series-detail__num">Part {num}</span>
                    <span className="series-detail__title">{p.title}</span>
                  </>
                );
                if (p.published) {
                  return (
                    <li key={p.slug} className="series-detail__item">
                      <Link href={`/blog/${p.slug}`} className="series-detail__link">
                        {content}
                        <span className="series-detail__cta">Read →</span>
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={p.slug} className="series-detail__item series-detail__item--soon">
                    {content}
                    <span className="series-detail__chip">Coming soon</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}
