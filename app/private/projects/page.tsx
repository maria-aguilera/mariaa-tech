import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getPrivateMdxPostMeta } from "@/lib/mdx";
import { series as allSeries } from "@/lib/series";

export const metadata: Metadata = {
  title: "Private · Projects",
  description: "The private work-OS — not indexed.",
  robots: { index: false, follow: false },
};

function dateSortKey(s: string): number {
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
}

export default function PrivateProjectsPage() {
  const posts = getPrivateMdxPostMeta().sort(
    (a, b) => dateSortKey(b.date) - dateSortKey(a.date),
  );
  const privateSeries = allSeries.filter((s) => s.private);

  // Group posts by series (using frontmatter `series` string) so the private
  // index mirrors the public one — series-first, then loose posts.
  const seriesTitleSet = new Set(privateSeries.map((s) => s.title));
  const looseposts = posts.filter((p) => !p.series || !seriesTitleSet.has(p.series));

  return (
    <main id="main-content" className="blog-page">
      <PageHero
        title="Private work-OS"
        subtitle="Interview prep, drafts, notes — nothing here is public or indexed."
        icon="file-text"
      />

      <section className="blog-body">
        <div className="blog-body__container" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Private series first */}
          {privateSeries.map((s) => {
            const publishedCount = s.posts.filter((p) => p.published).length;
            return (
              <article
                key={s.id}
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(30, 41, 59, 0.12)",
                  borderRadius: 14,
                  padding: "1.5rem",
                }}
              >
                <div style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", color: "#2563eb", background: "rgba(37, 99, 235, 0.1)", padding: "3px 8px", borderRadius: 999 }}>
                  {publishedCount} OF {s.posts.length} PUBLISHED · PRIVATE
                </div>
                <h2 style={{ marginTop: 12, marginBottom: 8, fontSize: "1.4rem" }}>
                  <Link href={`/private/series/${s.id}`} style={{ color: "#0f172a", textDecoration: "none" }}>
                    {s.title}
                  </Link>
                </h2>
                <p style={{ color: "#475569", marginBottom: 12 }}>{s.description}</p>
                <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
                  {s.posts.map((p) => {
                    const num = String(p.part).padStart(2, "0");
                    if (p.published) {
                      return (
                        <li key={p.slug}>
                          <Link
                            href={`/private/blog/${p.slug}`}
                            style={{
                              display: "flex",
                              gap: 12,
                              padding: "6px 8px",
                              borderRadius: 6,
                              color: "#0f172a",
                              textDecoration: "none",
                            }}
                          >
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", minWidth: 60 }}>PART {num}</span>
                            <span style={{ flex: 1 }}>{p.title}</span>
                            <span style={{ color: "#94a3b8" }}>→</span>
                          </Link>
                        </li>
                      );
                    }
                    return (
                      <li
                        key={p.slug}
                        style={{
                          display: "flex",
                          gap: 12,
                          padding: "6px 8px",
                          color: "#94a3b8",
                        }}
                      >
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, minWidth: 60 }}>PART {num}</span>
                        <span style={{ flex: 1 }}>{p.title}</span>
                        <span style={{ fontSize: "0.75rem" }}>Coming soon</span>
                      </li>
                    );
                  })}
                </ol>
              </article>
            );
          })}

          {/* Loose private posts */}
          {looseposts.length > 0 ? (
            <article
              style={{
                background: "#ffffff",
                border: "1px solid rgba(30, 41, 59, 0.12)",
                borderRadius: 14,
                padding: "1.5rem",
              }}
            >
              <h2 style={{ marginTop: 0, fontSize: "1.2rem" }}>Loose private posts</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                {looseposts.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/private/blog/${p.slug}`}
                      style={{ color: "#0f172a", textDecoration: "none" }}
                    >
                      <strong>{p.title}</strong>
                      {p.date ? (
                        <span style={{ color: "#94a3b8", fontSize: "0.85rem", marginLeft: 8 }}>
                          {p.date}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}
        </div>
      </section>
    </main>
  );
}
