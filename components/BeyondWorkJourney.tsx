import Link from "next/link";
import type { JourneyMilestone } from "@/lib/journey-timeline";
import styles from "./BeyondWorkJourney.module.css";

type BeyondWorkJourneyProps = {
  items: JourneyMilestone[];
};

export default function BeyondWorkJourney({ items }: BeyondWorkJourneyProps) {
  const first = items[0];
  const last = items[items.length - 1];

  return (
    <section className={styles.journey} aria-label="Personal map preview">
      <div className={styles.card}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Personal Map</p>
          <h2>An illustrated version of the journey.</h2>
          <p className={styles.lead}>
            The countries, schools, languages, and environments behind this story now live in a
            separate map page, designed more like a poster than another timeline block.
          </p>

          <p className={styles.meta}>
            {items.length} places from {first.city} to {last.city}
          </p>

          <Link href="/personal-map" className={styles.cta}>
            View Personal Map
          </Link>
        </div>

        <div className={styles.preview} aria-hidden="true">
          <span className={styles.previewDot} />
          <span className={styles.previewLineBlue} />
          <span className={styles.previewLineRed} />
          <div className={styles.previewLabels}>
            {items.map((item, index) => (
              <span key={`${item.city}-${item.period}`} className={styles.previewLabel}>
                <strong>{`${index + 1}`.padStart(2, "0")}</strong>
                <span>{item.city}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
