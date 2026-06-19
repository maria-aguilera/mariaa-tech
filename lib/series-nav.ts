import { series as allSeries } from "./series";

export type SeriesNavItem = {
  part: number;
  title: string;
  slug: string;
  published: boolean;
};

export type SeriesNav = {
  /** Title of the series (or sub-series, if the slug is a child). */
  title: string;
  /** Top-level series id (links back to /series/{id}). */
  seriesId: string;
  /** Linear list of posts to paginate through. */
  list: SeriesNavItem[];
  /** Index of the current post within `list`. */
  currentIndex: number;
};

const flatten = (posts: { part: number; title: string; slug: string; published: boolean }[]): SeriesNavItem[] =>
  posts.map(({ part, title, slug, published }) => ({ part, title, slug, published }));

export function getSeriesNav(slug: string): SeriesNav | null {
  for (const s of allSeries) {
    const topIndex = s.posts.findIndex((p) => p.slug === slug);
    if (topIndex !== -1) {
      return {
        title: s.title,
        seriesId: s.id,
        list: flatten(s.posts),
        currentIndex: topIndex,
      };
    }
    for (const parent of s.posts) {
      if (!parent.children) continue;
      const childIndex = parent.children.findIndex((c) => c.slug === slug);
      if (childIndex !== -1) {
        return {
          title: parent.title,
          seriesId: s.id,
          list: flatten(parent.children),
          currentIndex: childIndex,
        };
      }
    }
  }
  return null;
}
