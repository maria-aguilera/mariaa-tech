"use client";

export type PinSlide = {
  src: string;
  boardTitle: string;
  boardUrl: string;
};

type PinterestCarouselProps = {
  slides: PinSlide[];
};

export default function PinterestCarousel({ slides }: PinterestCarouselProps) {
  if (slides.length === 0) return null;

  // Pick the board most represented in the curated pins for the "See more" link.
  const boardTallies = new Map<string, { count: number; url: string; title: string }>();
  for (const slide of slides) {
    const existing = boardTallies.get(slide.boardTitle);
    if (existing) {
      existing.count += 1;
    } else {
      boardTallies.set(slide.boardTitle, {
        count: 1,
        url: slide.boardUrl,
        title: slide.boardTitle,
      });
    }
  }
  const featured = [...boardTallies.values()].sort((a, b) => b.count - a.count)[0];

  return (
    <section className="pin-board" aria-label="Pinterest design taste">
      <h2 className="topic-section__title">
        <span className="topic-section__label">My design taste</span>
        <span className="topic-section__rule" aria-hidden="true" />
        <a
          href={featured.url}
          target="_blank"
          rel="noopener noreferrer"
          className="pin-board__more"
        >
          See more
        </a>
      </h2>

      <div className="pin-board__row">
        {slides.map((slide, i) => (
          <a
            key={`${slide.src}-${i}`}
            href={slide.boardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pin-tile"
            aria-label={`Open ${slide.boardTitle} on Pinterest`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt=""
              className="pin-tile__img"
              loading="lazy"
              draggable={false}
            />
          </a>
        ))}
      </div>
    </section>
  );
}
