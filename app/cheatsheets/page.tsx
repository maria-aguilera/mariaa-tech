import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getAllCheatsheetMeta } from "@/lib/cheatsheets";

export const metadata: Metadata = {
  title: "Cheat sheets · Maria Aguilera",
  description:
    "One-page summaries of every blog post and project.",
  alternates: { canonical: "/cheatsheets" },
};

const TOPIC_ORDER = [
  "Machine Learning",
  "MLOps",
  "Forecasting",
  "Reinforcement Learning",
  "Graph Analytics",
  "Data Cleaning",
  "Networking",
  "Algorithms",
  "Econometrics",
];

const topicRank = (topic: string | undefined) => {
  if (!topic) return TOPIC_ORDER.length;
  const idx = TOPIC_ORDER.indexOf(topic);
  return idx === -1 ? TOPIC_ORDER.length : idx;
};

/**
 * Extract part number from a title like "Part 3 · Feature Engineering..." → 3.
 * Returns null when the title has no part prefix.
 */
const partNumber = (title: string): number | null => {
  const match = title.match(/^Part\s+(\d+)\s*[·:|-]/i);
  return match ? Number.parseInt(match[1], 10) : null;
};

export default function CheatsheetsIndexPage() {
  const sheets = getAllCheatsheetMeta().sort((a, b) => {
    // Within ML topic, sort by part number first
    if (a.topic === "Machine Learning" && b.topic === "Machine Learning") {
      const pa = partNumber(a.title);
      const pb = partNumber(b.title);
      if (pa !== null && pb !== null) return pa - pb;
      if (pa !== null) return -1;
      if (pb !== null) return 1;
    }
    // Otherwise sort by topic priority, then title
    const tDiff = topicRank(a.topic) - topicRank(b.topic);
    if (tDiff !== 0) return tDiff;
    return a.title.localeCompare(b.title);
  });

  return (
    <main id="main-content" className="cheat-index">
      <PageHero
        title="Cheat sheets"
        subtitle="One-page summaries of every blog post and project."
        icon="layers"
      />

      <section className="cheat-index__inner">
        {sheets.length === 0 ? (
          <p className="cheat-index__empty">No cheat sheets yet — coming soon.</p>
        ) : (
          <ul className="cheat-index__list">
            {sheets.map((sheet) => (
              <li key={sheet.slug} className="cheat-index__item">
                <Link
                  className="cheat-index__card"
                  href={`/cheatsheets/${sheet.slug}`}
                >
                  {sheet.topic && (
                    <span className="cheat-index__topic">{sheet.topic}</span>
                  )}
                  <h2 className="cheat-index__title">
                    {sheet.title.replace(/\s*—\s*Cheat Sheet\s*$/i, "")}
                  </h2>
                  {sheet.subtitle && (
                    <p className="cheat-index__subtitle">{sheet.subtitle}</p>
                  )}
                  {sheet.updated && (
                    <span className="cheat-index__updated">
                      Updated {sheet.updated}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
