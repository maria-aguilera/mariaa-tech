"use client";

import Image from "next/image";
import { startTransition, useState, type CSSProperties } from "react";
import type { JourneyMilestone } from "@/lib/journey-timeline";
import styles from "./SketchJourneyTimeline.module.css";

type SketchJourneyTimelineProps = {
  items: JourneyMilestone[];
};

const routePaths = [
  { id: "red-top", color: "#c53a33", d: "M 340 -60 C 395 30 470 145 530 330" },
  { id: "yellow-top", color: "#edc72b", d: "M 705 365 C 840 332 930 338 1085 356" },
  { id: "blue-mid", color: "#334cb3", d: "M 205 505 C 390 470 555 528 715 505" },
  { id: "blue-left", color: "#334cb3", d: "M -40 470 C 80 470 135 580 240 825" },
  { id: "yellow-diagonal", color: "#edc72b", d: "M 330 810 C 475 665 565 585 720 505" },
  { id: "red-right", color: "#c53a33", d: "M 723 508 C 802 575 812 690 1000 820" },
  { id: "blue-low", color: "#334cb3", d: "M 734 690 C 855 720 945 694 1065 736" },
];

const mindsetWords = ["Perspective", "Adaptation", "Craft", "Motion"];

type DoodlePlacement = {
  id: string;
  kind: "walker" | "dog";
  x: string;
  y: string;
  flip?: boolean;
};

const doodles: DoodlePlacement[] = [
  { id: "walker-01", kind: "walker", x: "36%", y: "37%" },
  { id: "walker-02", kind: "walker", x: "53%", y: "46%" },
  { id: "walker-03", kind: "walker", x: "70%", y: "41%", flip: true },
  { id: "walker-04", kind: "walker", x: "29%", y: "66%" },
  { id: "walker-05", kind: "walker", x: "63%", y: "73%" },
  { id: "walker-06", kind: "walker", x: "24%", y: "92%" },
  { id: "walker-07", kind: "walker", x: "81%", y: "88%" },
  { id: "dog-01", kind: "dog", x: "72%", y: "89%" },
];

function formatIndex(index: number) {
  return `${index + 1}`.padStart(2, "0");
}

function formatCount(count: number) {
  return `${count}`.padStart(2, "0");
}

function getNodeStyle(item: JourneyMilestone) {
  return {
    "--node-x": `${item.coordinates.x}%`,
    "--node-y": `${item.coordinates.y}%`,
    "--node-underline": item.stroke,
  } as CSSProperties;
}

function DoodleWalker({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 96"
      className={`${styles.doodleSvg} ${flipped ? styles.doodleFlipped : ""}`}
      aria-hidden="true"
    >
      <circle cx="21" cy="10" r="4.6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M20 15 L21 50 L15 73 M21 50 L29 72 M20 28 L13 44 M21 28 L31 39"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DoodleDog() {
  return (
    <svg viewBox="0 0 64 38" className={styles.doodleSvg} aria-hidden="true">
      <path
        d="M13 25 L20 18 L34 18 L42 13 L49 16 L47 22 L55 23 L51 26 L43 26 L39 31 L31 25 L20 25 L14 29 L11 26 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="46" cy="15" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default function SketchJourneyTimeline({ items }: SketchJourneyTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];

  const showIndex = (index: number) => {
    startTransition(() => {
      setActiveIndex(index);
    });
  };

  return (
    <section className={styles.timeline} aria-label="Personal map timeline">
      <div className={styles.canvasScroller}>
        <article className={styles.canvas}>
          <div className={styles.paper} aria-hidden="true" />

          <svg
            className={styles.routes}
            viewBox="0 0 1000 860"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {routePaths.map((path) => (
              <g key={path.id}>
                <path d={path.d} className={styles.routeShadow} stroke={path.color} />
                <path d={path.d} className={styles.routeStroke} stroke={path.color} />
              </g>
            ))}
          </svg>

          <div className={styles.hero}>
            <p className={styles.eyebrow}>{"// Personal Map"}</p>
            <h2>
              A journey
              <br />
              that <em>shaped</em> me.
            </h2>
            <p className={styles.heroLead}>
              Places, people and moments that built the way I think, adapt and create.
            </p>

            <div className={styles.activeExcerpt}>
              <span>
                {formatIndex(activeIndex)} / {formatCount(items.length)} · {activeItem.city}
              </span>
              <p>{activeItem.memory}</p>
            </div>
          </div>

          <div className={styles.mindset} aria-hidden="true">
            {mindsetWords.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>

          <div className={styles.nodesLayer}>
            {items.map((item, index) => (
              <button
                key={`${item.period}-${item.place}`}
                type="button"
                className={`${styles.node} ${index === activeIndex ? styles.nodeActive : ""}`}
                style={getNodeStyle(item)}
                aria-pressed={index === activeIndex}
                aria-label={`Show ${item.city}, ${item.period}`}
                onClick={() => showIndex(index)}
                onMouseEnter={() => showIndex(index)}
              >
                <span className={styles.nodePhotoWrap}>
                  <Image
                    src={item.photo}
                    alt={`${item.city} chapter`}
                    width={176}
                    height={176}
                    className={styles.nodePhoto}
                  />
                </span>

                <span className={styles.nodeLabel}>
                  <span className={styles.nodeIndex}>{formatIndex(index)}</span>
                  <strong>{item.city}</strong>
                  <span className={styles.nodePeriod}>{item.period}</span>
                  <span className={styles.nodeUnderline} aria-hidden="true" />
                </span>

                <span className={styles.nodeStem} aria-hidden="true" />
                <span className={styles.nodeDot} aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className={styles.doodles} aria-hidden="true">
            {doodles.map((doodle) => (
              <span
                key={doodle.id}
                className={styles.doodle}
                style={{ left: doodle.x, top: doodle.y } as CSSProperties}
              >
                {doodle.kind === "dog" ? <DoodleDog /> : <DoodleWalker flipped={doodle.flip} />}
              </span>
            ))}
          </div>

          <aside className={styles.quoteBlock}>
            <p className={styles.quote}>
              Every move
              <br />a new perspective.
              <br />
              <br />
              Every place
              <br />a new version of me.
            </p>
            <p className={styles.quoteDetail}>{activeItem.note}</p>
          </aside>

          <div className={styles.scrollCue} aria-hidden="true">
            <span>Scroll to explore</span>
            <span className={styles.scrollArrow}>↓</span>
          </div>

          <div className={styles.progress}>
            <div className={styles.progressDots} role="tablist" aria-label="Journey chapters">
              {items.map((item, index) => (
                <button
                  key={`${item.period}-${item.city}-dot`}
                  type="button"
                  className={`${styles.progressDot} ${index === activeIndex ? styles.progressDotActive : ""}`}
                  aria-label={`Open ${item.city}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => showIndex(index)}
                />
              ))}
            </div>
            <p>
              {formatIndex(activeIndex)} / {formatCount(items.length)}
            </p>
          </div>
        </article>
      </div>

      <div className={styles.mobileChapterList}>
        {items.map((item, index) => (
          <button
            key={`${item.period}-${item.place}-mobile`}
            type="button"
            className={`${styles.mobileChapter} ${index === activeIndex ? styles.mobileChapterActive : ""}`}
            onClick={() => showIndex(index)}
          >
            <span className={styles.mobileChapterPhoto}>
              <Image src={item.photo} alt="" width={88} height={88} className={styles.nodePhoto} />
            </span>

            <span className={styles.mobileChapterCopy}>
              <span className={styles.mobileChapterIndex}>{formatIndex(index)}</span>
              <strong>{item.city}</strong>
              <span>{item.period}</span>
              <p>{item.memory}</p>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
