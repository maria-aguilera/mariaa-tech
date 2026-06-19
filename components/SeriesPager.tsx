import Link from "next/link";
import { getSeriesNav } from "@/lib/series-nav";

type Props = { slug: string };

export default function SeriesPager({ slug }: Props) {
  const nav = getSeriesNav(slug);
  if (!nav || nav.list.length < 2) return null;

  const prev = nav.list[nav.currentIndex - 1];
  const next = nav.list[nav.currentIndex + 1];
  const canPrev = prev && prev.published;
  const canNext = next && next.published;

  return (
    <nav className="series-pager" aria-label={`${nav.title} navigation`}>
      <div className="series-pager__inner">
        {canPrev ? (
          <Link
            href={`/blog/${prev.slug}`}
            className="series-pager__edge"
            aria-label={`Previous: ${prev.title}`}
          >
            <span aria-hidden="true">‹</span> Previous
          </Link>
        ) : (
          <span className="series-pager__edge series-pager__edge--disabled" aria-hidden="true">
            <span>‹</span> Previous
          </span>
        )}

        <ol className="series-pager__list">
          {nav.list.map((item, i) => {
            const num = i + 1;
            const isCurrent = i === nav.currentIndex;
            const itemCls = [
              "series-pager__item",
              isCurrent && "series-pager__item--current",
              !isCurrent && !item.published && "series-pager__item--disabled",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <li key={item.slug} className={itemCls}>
                {isCurrent ? (
                  <span className="series-pager__link" aria-current="page">
                    {num}
                  </span>
                ) : item.published ? (
                  <Link
                    href={`/blog/${item.slug}`}
                    className="series-pager__link"
                    aria-label={`Part ${num}: ${item.title}`}
                  >
                    {num}
                  </Link>
                ) : (
                  <span
                    className="series-pager__link"
                    aria-disabled="true"
                    title={`${item.title} — coming soon`}
                  >
                    {num}
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {canNext ? (
          <Link
            href={`/blog/${next.slug}`}
            className="series-pager__edge"
            aria-label={`Next: ${next.title}`}
          >
            Next <span aria-hidden="true">›</span>
          </Link>
        ) : (
          <span className="series-pager__edge series-pager__edge--disabled" aria-hidden="true">
            Next <span>›</span>
          </span>
        )}
      </div>
    </nav>
  );
}
