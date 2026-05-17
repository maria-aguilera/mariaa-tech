"use client";

import { useState } from "react";
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

const PIN_POSITIONS: { x: number; y: number }[] = [
  { x: 140, y: 270 },
  { x: 310, y: 130 },
  { x: 490, y: 270 },
  { x: 670, y: 130 },
  { x: 850, y: 270 },
  { x: 1030, y: 130 },
];

const PATH_D =
  "M 60 200 " +
  "Q 90 260 140 270 " +
  "C 200 270 260 130 310 130 " +
  "C 360 130 430 270 490 270 " +
  "C 540 270 610 130 670 130 " +
  "C 720 130 790 270 850 270 " +
  "C 900 270 980 130 1030 130 " +
  "Q 1090 130 1140 200";

export default function SketchPath({ items, photoSets }: SketchPathProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div className="sketch-path" aria-label="Personal journey timeline">
      <header className="sketch-path__header">
        <p className="sketch-path__eyebrow">Personal timeline</p>
        <h2 className="sketch-path__title">Five countries, one me</h2>
      </header>

      <div className="sketch-path__svg-wrap">
        <svg
          viewBox="0 0 1200 380"
          preserveAspectRatio="xMidYMid meet"
          className="sketch-path__svg"
          role="img"
        >
          <path
            d={PATH_D}
            className="sketch-path__line"
            fill="none"
          />

          {items.map((item, i) => {
            const pos = PIN_POSITIONS[i] ?? { x: 0, y: 0 };
            const isActive = activeIdx === i;
            return (
              <g
                key={`${item.period}-${item.place}`}
                transform={`translate(${pos.x}, ${pos.y})`}
                className={`sketch-pin${isActive ? " sketch-pin--active" : ""}`}
                onMouseEnter={() => setActiveIdx(i)}
                onFocus={() => setActiveIdx(i)}
                onClick={() => setActiveIdx((p) => (p === i ? null : i))}
                role="button"
                tabIndex={0}
                aria-label={`${item.city}, ${item.country}, ${item.period}`}
              >
                <ellipse
                  cx="0"
                  cy="18"
                  rx="9"
                  ry="2.5"
                  className="sketch-pin__shadow"
                />
                <path
                  d="M 0,-44 C -16,-44 -26,-32 -26,-20 C -26,-8 -14,8 0,18 C 14,8 26,-8 26,-20 C 26,-32 16,-44 0,-44 Z"
                  className="sketch-pin__shape"
                />
                <circle
                  cx="0"
                  cy="-20"
                  r="14"
                  className="sketch-pin__hole"
                />
                <text
                  x="0"
                  y="-20"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="20"
                  className="sketch-pin__flag"
                  aria-hidden="true"
                >
                  {flagEmoji(item.flagCode)}
                </text>

                <text
                  x="0"
                  y={44}
                  textAnchor="middle"
                  className="sketch-pin__city"
                >
                  {item.city.toUpperCase()},{" "}
                  {item.country.toUpperCase()}
                </text>
                <text
                  x="0"
                  y={62}
                  textAnchor="middle"
                  className="sketch-pin__year"
                >
                  {item.period}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="sketch-path__popover-wrap">
        {activeIdx !== null
          ? (() => {
              const item = items[activeIdx];
              const set = photoSets.find((p) => p.key === item.place + item.period) ??
                photoSets[activeIdx];
              const photos = set?.photos ?? [];
              return (
                <article className="sketch-popover" aria-live="polite">
                  <header className="sketch-popover__header">
                    <span className="sketch-popover__flag" aria-hidden="true">
                      {flagEmoji(item.flagCode)}
                    </span>
                    <div className="sketch-popover__heading">
                      <h3>
                        {item.city}, {item.country}
                      </h3>
                      <p className="sketch-popover__period">{item.period}</p>
                    </div>
                  </header>

                  <p className="sketch-popover__memory">{item.memory}</p>

                  {photos.length > 0 ? (
                    <div className="sketch-popover__photos">
                      {photos.map((p, idx) => (
                        <figure key={`${p.src}-${idx}`} className="sketch-photo">
                          <Image
                            src={p.src}
                            alt={p.caption ?? `${item.city} photo ${idx + 1}`}
                            width={240}
                            height={180}
                            sizes="(min-width: 720px) 30vw, 80vw"
                          />
                          {p.caption ? (
                            <figcaption className="sketch-photo__caption">
                              <span className="sketch-photo__arrow" aria-hidden="true">↖</span>
                              {p.caption}
                            </figcaption>
                          ) : null}
                        </figure>
                      ))}
                    </div>
                  ) : set?.emptyNote ? (
                    <p className="sketch-popover__note">{set.emptyNote}</p>
                  ) : null}
                </article>
              );
            })()
          : (
            <p className="sketch-path__hint">
              Hover or tap a pin to see the chapter — flag fills in, photos come up.
            </p>
          )}
      </div>
    </div>
  );
}
