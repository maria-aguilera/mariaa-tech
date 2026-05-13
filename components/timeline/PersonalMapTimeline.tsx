import Image from "next/image";
import type { CSSProperties } from "react";
import type { JourneyMilestone } from "@/lib/journey-timeline";
import styles from "./PersonalMapTimeline.module.css";

type PersonalMapTimelineProps = {
  items: JourneyMilestone[];
};

type CanvasPoint = {
  x: number;
  y: number;
};

const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 620;

const segmentColors = ["#c94d45", "#dcb831", "#c94d45", "#3652b4", "#dcb831"];
const segmentOffsets = [
  { x: -42, y: -84 },
  { x: 22, y: 62 },
  { x: -34, y: 24 },
  { x: 22, y: 70 },
  { x: 44, y: 92 },
];

function formatIndex(index: number) {
  return `${index + 1}`.padStart(2, "0");
}

function toCanvasPoint(item: JourneyMilestone): CanvasPoint {
  return {
    x: (item.coordinates.x / 100) * VIEWBOX_WIDTH,
    y: (item.coordinates.y / 100) * VIEWBOX_HEIGHT,
  };
}

function buildSegmentPath(start: CanvasPoint, end: CanvasPoint, index: number) {
  const offset = segmentOffsets[index] ?? { x: 0, y: 0 };
  const controlX = (start.x + end.x) / 2 + offset.x;
  const controlY = (start.y + end.y) / 2 + offset.y;

  return `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;
}

function getStopStyle(item: JourneyMilestone) {
  return {
    "--stop-x": `${item.coordinates.x}%`,
    "--stop-y": `${item.coordinates.y}%`,
    "--stop-start": item.palette.start,
    "--stop-end": item.palette.end,
  } as CSSProperties;
}

function MarkerPhoto({ item }: { item: JourneyMilestone }) {
  if (!item.photo) {
    const initials = item.city
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return <span className={styles.markerFallback}>{initials}</span>;
  }

  return (
    <Image
      src={item.photo}
      alt={`${item.city} memory`}
      width={152}
      height={152}
      className={styles.markerImage}
      sizes="(max-width: 960px) 72px, 84px"
    />
  );
}

function FlagBadge({ code }: { code: JourneyMilestone["flagCode"] }) {
  return (
    <span className={styles.flagGraphic} aria-hidden="true">
      <svg viewBox="0 0 32 32" focusable="false">
        {code === "es" ? (
          <>
            <rect width="32" height="32" fill="#aa151b" />
            <rect y="8" width="32" height="16" fill="#f1bf00" />
          </>
        ) : null}

        {code === "br" ? (
          <>
            <rect width="32" height="32" fill="#1b8f48" />
            <polygon points="16,5 27,16 16,27 5,16" fill="#f4c318" />
            <circle cx="16" cy="16" r="6" fill="#2447a5" />
            <path d="M 10 17.4 C 13.4 14.9 18.2 14.7 22 16.1" stroke="#ffffff" strokeWidth="1.3" fill="none" />
          </>
        ) : null}

        {code === "gr" ? (
          <>
            <rect width="32" height="32" fill="#2f6fd8" />
            <rect y="4" width="32" height="4" fill="#ffffff" />
            <rect y="12" width="32" height="4" fill="#ffffff" />
            <rect y="20" width="32" height="4" fill="#ffffff" />
            <rect y="28" width="32" height="4" fill="#ffffff" />
            <rect width="14" height="14" fill="#2f6fd8" />
            <rect x="5" width="4" height="14" fill="#ffffff" />
            <rect y="5" width="14" height="4" fill="#ffffff" />
          </>
        ) : null}

        {code === "mx" ? (
          <>
            <rect width="10.6667" height="32" fill="#1f8f52" />
            <rect x="10.6667" width="10.6667" height="32" fill="#ffffff" />
            <rect x="21.3334" width="10.6667" height="32" fill="#ce2b37" />
            <circle cx="16" cy="16" r="2.1" fill="#b98432" />
          </>
        ) : null}

        {code === "ch" ? (
          <>
            <rect width="32" height="32" fill="#d31d33" />
            <rect x="13" y="7" width="6" height="18" fill="#ffffff" />
            <rect x="7" y="13" width="18" height="6" fill="#ffffff" />
          </>
        ) : null}
      </svg>
    </span>
  );
}

function DesktopStop({ item, index }: { item: JourneyMilestone; index: number }) {
  return (
    <div
      className={`${styles.stop} ${item.labelSide === "left" ? styles.stopLabelLeft : ""}`}
      style={getStopStyle(item)}
      aria-label={`${item.city}, ${item.country}, ${item.period}`}
    >
      <div className={styles.marker}>
        <span className={styles.markerHalo} aria-hidden="true" />
        <span className={styles.markerFrame}>
          <MarkerPhoto item={item} />
        </span>
        <span className={styles.flagBadge}>
          <FlagBadge code={item.flagCode} />
        </span>
      </div>

      <div className={styles.label}>
        <span className={styles.index}>{formatIndex(index)}</span>
        <span className={styles.city}>{item.city}</span>
        <span className={styles.years}>{item.period}</span>
      </div>
    </div>
  );
}

function MobileStop({ item, index }: { item: JourneyMilestone; index: number }) {
  return (
    <div className={styles.mobileStop} aria-label={`${item.city}, ${item.country}, ${item.period}`}>
      <div className={styles.mobileMarker}>
        <span className={styles.markerHalo} aria-hidden="true" />
        <span className={styles.markerFrame}>
          <MarkerPhoto item={item} />
        </span>
        <span className={styles.flagBadge}>
          <FlagBadge code={item.flagCode} />
        </span>
      </div>

      <div className={styles.mobileLabel}>
        <span className={styles.index}>{formatIndex(index)}</span>
        <span className={styles.city}>{item.city}</span>
        <span className={styles.years}>{item.period}</span>
      </div>
    </div>
  );
}

export default function PersonalMapTimeline({ items }: PersonalMapTimelineProps) {
  const points = items.map(toCanvasPoint);
  const segments = points.slice(1).map((point, index) => ({
    id: `${items[index].city}-${items[index + 1].city}`,
    d: buildSegmentPath(points[index], point, index),
    color: segmentColors[index] ?? items[index + 1].stroke,
  }));

  return (
    <section className={styles.section} aria-label="Personal map poster">
      <div className={styles.poster}>
        <svg
          className={styles.routeSvg}
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {segments.map((segment) => (
            <g key={segment.id}>
              <path d={segment.d} className={styles.routeGlow} stroke={segment.color} />
              <path d={segment.d} className={styles.routeLine} stroke={segment.color} />
            </g>
          ))}
        </svg>

        {items.map((item, index) => (
          <DesktopStop key={`${item.city}-${item.period}`} item={item} index={index} />
        ))}

        <p className={styles.closingPhrase}>
          Every move, a new perspective.
          <br />
          Every place, a new version of me.
        </p>
      </div>

      <div className={styles.mobilePoster}>
        <svg className={styles.mobileRoute} viewBox="0 0 180 720" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M 84 18 C 58 72 126 118 90 176 C 56 232 130 292 92 352 C 62 410 120 478 86 540 C 62 592 102 650 86 708"
            className={styles.mobileRouteGlow}
            stroke="#3652b4"
          />
          <path
            d="M 84 18 C 58 72 126 118 90 176 C 56 232 130 292 92 352 C 62 410 120 478 86 540 C 62 592 102 650 86 708"
            className={styles.mobileRouteLine}
            stroke="#3652b4"
          />
          <path d="M 142 48 C 132 92 110 124 90 176" className={styles.mobileAccent} stroke="#c94d45" />
          <path d="M 32 286 C 58 318 74 332 92 352" className={styles.mobileAccent} stroke="#dcb831" />
          <path d="M 138 500 C 114 516 100 528 86 540" className={styles.mobileAccent} stroke="#c94d45" />
        </svg>

        <div className={styles.mobileStops}>
          {items.map((item, index) => (
            <MobileStop key={`${item.city}-${item.period}-mobile`} item={item} index={index} />
          ))}
        </div>

        <p className={styles.mobileClosingPhrase}>
          Every move, a new perspective.
          <br />
          Every place, a new version of me.
        </p>
      </div>
    </section>
  );
}
