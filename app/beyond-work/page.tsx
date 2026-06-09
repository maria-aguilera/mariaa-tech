import type { Metadata } from "next";
import Link from "next/link";
import AIPerspectiveCards from "@/components/AIPerspectiveCards";
import BeyondWorkJourney from "@/components/BeyondWorkJourney";
import IdentityStrip from "@/components/IdentityStrip";
import PageHero from "@/components/PageHero";
import PinterestCarousel, { type PinSlide } from "@/components/PinterestCarousel";
import StatStrip from "@/components/StatStrip";
import { timelineItems } from "@/lib/journey-timeline";
import { getPinsFromBoard } from "@/lib/pinterest";
import { pinterestSlides } from "@/lib/pinterest-pins";

export const metadata: Metadata = {
  title: "Beyond Work",
  description:
    "The life, interests, and routines that sit outside the main portfolio — chess, design, languages, and the places that shaped me.",
  alternates: { canonical: "/beyond-work" },
  openGraph: {
    title: "Beyond Work · Maria Aguilera",
    description:
      "The life, interests, and routines that sit outside the main portfolio — chess, design, languages, and the places that shaped me.",
    url: "/beyond-work",
  },
};

const CHESS_USERNAME = "marimari3399";

const continentByCountry: Record<string, string> = {
  Spain: "Europe",
  Brazil: "South America",
  Greece: "Europe",
  Mexico: "North America",
  Switzerland: "Europe",
};

const LANGUAGES_SPOKEN = 4;

const pinterestBoards = [
  {
    title: "Interior Design Favorites",
    url: "https://es.pinterest.com/mariaaguilera979797/dise%C3%B1o-de-interiores-que-me-gustan/",
  },
  {
    title: "Design Finds · Objects & Furniture",
    url: "https://es.pinterest.com/mariaaguilera979797/design-finds-objects-furniture/",
  },
];

type ChessProfile = {
  rapidRating: number | null;
  dailyRating: number | null;
  countryCode: string | null;
};

async function getChessProfile(username: string): Promise<ChessProfile> {
  try {
    const [playerRes, statsRes] = await Promise.all([
      fetch(`https://api.chess.com/pub/player/${username}`, {
        headers: { "User-Agent": "maria-portfolio/1.0" },
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.chess.com/pub/player/${username}/stats`, {
        headers: { "User-Agent": "maria-portfolio/1.0" },
        next: { revalidate: 3600 },
      }),
    ]);
    const player = playerRes.ok ? await playerRes.json() : null;
    const stats = statsRes.ok ? await statsRes.json() : null;
    const countryMatch: string | undefined = player?.country?.match(/\/country\/([A-Z]{2})/)?.[1];
    return {
      rapidRating: stats?.chess_rapid?.last?.rating ?? null,
      dailyRating: stats?.chess_daily?.last?.rating ?? null,
      countryCode: countryMatch ? countryMatch.toLowerCase() : null,
    };
  } catch {
    return { rapidRating: null, dailyRating: null, countryCode: null };
  }
}

export default async function BeyondWorkPage() {
  const [chess, ...boardPinLists] = await Promise.all([
    getChessProfile(CHESS_USERNAME),
    ...pinterestBoards.map((b) => getPinsFromBoard(b.url, 12)),
  ]);

  const slides: PinSlide[] =
    pinterestSlides.length > 0
      ? pinterestSlides
      : pinterestBoards.flatMap((board, i) =>
          boardPinLists[i].slice(0, 10).map((src) => ({
            src,
            boardTitle: board.title,
            boardUrl: board.url,
          })),
        );

  const countriesLived = new Set(timelineItems.map((m) => m.country)).size;
  const continents = new Set(
    timelineItems.map((m) => continentByCountry[m.country] ?? "Other"),
  ).size;

  return (
    <main id="main-content" className="blog-page">
      <PageHero
        title="Beyond Work"
        subtitle="The life, interests, and routines that sit outside the main portfolio"
        icon="compass"
      />

      <section className="blog-body">
        <div className="blog-body__container">
          <div className="page-content">
            <StatStrip continents={continents} countries={countriesLived} />

            <IdentityStrip
              chessUsername={CHESS_USERNAME}
              chessRapid={chess.rapidRating}
              chessDaily={chess.dailyRating}
              chessCountryCode={chess.countryCode}
              countriesLived={countriesLived}
              continents={continents}
              languages={LANGUAGES_SPOKEN}
            />

            <PinterestCarousel slides={slides} />

            <BeyondWorkJourney items={timelineItems} />

            <AIPerspectiveCards />

            <section className="bw-closing" aria-label="Closing note">
              <p>
                Life is still in motion — more chapters will be added as they happen. For
                the work side of things, head over to{" "}
                <Link href="/about">About →</Link>
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
