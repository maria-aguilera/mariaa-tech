"use client";

import Image from "next/image";
import type { JourneyMilestone } from "@/lib/journey-timeline";
import type { ChapterPhotoSet } from "@/lib/journey-photos";

type SketchPathProps = {
  items: JourneyMilestone[];
  photoSets: ChapterPhotoSet[];
};

function flagEmoji(code: string): string {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

export default function SketchPath({ items, photoSets }: SketchPathProps) {
  const getPhotoSet = (i: number) => {
    const item = items[i];
    return (
      photoSets.find((p) => p.key === item.place + item.period) ?? photoSets[i]
    );
  };

  const isCurrent = (period: string) => /present/i.test(period);

  return (
    <div className="journey-timeline" aria-label="Personal journey timeline">
      <h2 className="topic-section__title">
        <span className="topic-section__label">
          {items.length === 7 ? "Six countries, two Madrids, one me" : `${items.length} chapters, one me`}
        </span>
        <span className="topic-section__rule" aria-hidden="true" />
      </h2>

      <ol className="journey-timeline__list">
        {items.map((item, i) => {
          const photos = getPhotoSet(i)?.photos ?? [];
          const emptyNote = getPhotoSet(i)?.emptyNote;
          const current = isCurrent(item.period);

          return (
            <li
              key={`${item.period}-${item.place}`}
              className={`journey-chapter${current ? " journey-chapter--current" : ""}`}
            >
              <div className="journey-chapter__marker" aria-hidden="true">
                <span className="journey-chapter__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="journey-chapter__line" />
              </div>

              <article className="journey-chapter__card">
                <header className="journey-chapter__head">
                  <span className="journey-chapter__flag" aria-hidden="true">
                    {flagEmoji(item.flagCode)}
                  </span>
                  <div className="journey-chapter__heading">
                    <h3 className="journey-chapter__title">
                      {item.city}, {item.country}
                    </h3>
                    <p className="journey-chapter__period">
                      {item.period}
                      {current && (
                        <span className="journey-chapter__nowChip">Now</span>
                      )}
                    </p>
                  </div>
                </header>

                <p className="journey-chapter__memory">{item.memory}</p>

                {photos.length > 0 ? (
                  <div className="journey-chapter__photos">
                    {photos.map((p, idx) => (
                      <figure key={`${p.src}-${idx}`} className="journey-photo">
                        <Image
                          src={p.src}
                          alt={p.caption ?? `${item.city} photo ${idx + 1}`}
                          width={240}
                          height={180}
                          sizes="(min-width: 720px) 30vw, 80vw"
                        />
                        {p.caption ? (
                          <figcaption className="journey-photo__caption">{p.caption}</figcaption>
                        ) : null}
                      </figure>
                    ))}
                  </div>
                ) : emptyNote ? (
                  <p className="journey-chapter__note">{emptyNote}</p>
                ) : null}
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
