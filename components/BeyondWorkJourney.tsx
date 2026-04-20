"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { ArrowLeft, ArrowRight, GraduationCap, MapPin, Sparkles } from "lucide-react";
import type { JourneyMilestone } from "@/lib/journey-timeline";
import styles from "./BeyondWorkJourney.module.css";

type BeyondWorkJourneyProps = {
  items: JourneyMilestone[];
};

export default function BeyondWorkJourney({ items }: BeyondWorkJourneyProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];
  const progress = items.length > 1 ? (activeIndex / (items.length - 1)) * 100 : 0;
  const progressStyle = {
    "--journey-progress": `${progress}%`,
  } as CSSProperties;

  const showPrevious = () => {
    setActiveIndex((current) => (current === 0 ? items.length - 1 : current - 1));
  };

  const showNext = () => {
    setActiveIndex((current) => (current === items.length - 1 ? 0 : current + 1));
  };

  return (
    <section className={styles.journey} aria-label="Life timeline">
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Personal Timeline</p>
        <h2>How moving across countries shaped me</h2>
        <p className={styles.lead}>
          This is the more personal version of the site: the international moves, schools, and
          environments that shaped how I adapt, learn, and connect with people.
        </p>
      </div>

      <div className={styles.layout}>
        <div className={styles.rail} style={progressStyle}>
          <div className={styles.nav} role="list" aria-label="Timeline chapters">
            {items.map((item, index) => (
              <button
                key={`${item.period}-${item.place}`}
                type="button"
                className={`${styles.step} ${index === activeIndex ? styles.stepActive : ""}`}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
              >
                <span className={styles.markerWrap} aria-hidden="true">
                  <span className={styles.marker} />
                </span>
                <span className={styles.stepPeriod}>{item.period}</span>
                <span className={styles.stepPlace}>{item.place}</span>
                <span className={styles.stepMeta}>{item.school}</span>
              </button>
            ))}
          </div>
        </div>

        <article className={styles.stage} key={`${activeItem.period}-${activeItem.place}`}>
          <div className={styles.stageGlow} aria-hidden="true" />
          <div className={styles.stageTop}>
            <div className={styles.stageHeading}>
              <p className={styles.stagePeriod}>{activeItem.period}</p>
              <h3 className={styles.stageTitle}>{activeItem.place}</h3>
            </div>

            <div className={styles.count}>
              {activeIndex + 1} / {items.length}
            </div>
          </div>

          <div className={styles.pills}>
            <span className={styles.pill}>
              <MapPin aria-hidden="true" />
              <span>{activeItem.location}</span>
            </span>
            <span className={styles.pill}>
              <GraduationCap aria-hidden="true" />
              <span>{activeItem.school}</span>
            </span>
            <span className={styles.pill}>
              <Sparkles aria-hidden="true" />
              <span>What shaped me</span>
            </span>
          </div>

          <p className={styles.stageDescription}>{activeItem.description}</p>

          <ul className={styles.list}>
            {activeItem.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>

          <div className={styles.controls}>
            <span className={styles.controlsHint}>Hover, tap, or cycle through the chapters.</span>

            <div className={styles.controlGroup}>
              <button type="button" className={styles.control} onClick={showPrevious}>
                <ArrowLeft aria-hidden="true" />
                <span>Previous</span>
              </button>
              <button type="button" className={styles.control} onClick={showNext}>
                <span>Next</span>
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
