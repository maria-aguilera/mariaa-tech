import PageHero from "@/components/PageHero";
import { journeyTimeline } from "@/lib/journey-timeline";

const cvHighlights = [
  "MSc in Big Data with an AI focus.",
  "Currently building ML and analytics solutions at BMC Software.",
  "Interested in work that connects technical depth with real business value.",
];

export default function AboutPage() {
  return (
    <main className="blog-page">
      <PageHero
        title="About"
        subtitle="A fuller view of my background, timeline, and current direction"
        icon="monitor"
      />

      <section className="blog-body">
        <div className="blog-body__container">
          <div className="page-content">
            <section className="page-section talks-section">
              <div className="talks-section__header">
                <h2>Short Version</h2>
                <p className="talks-section__lead">
                  I work across data, analytics, and AI, with a strong preference for practical
                  systems that create measurable value. This page is the longer version of the home
                  page: a little more context on where I come from, what shaped me, and what I am
                  building toward.
                </p>
              </div>
            </section>

            <section className="page-section talks-section">
              <div className="talks-section__header">
                <h2>Life Timeline</h2>
                <p className="talks-section__lead">
                  A quick timeline of the countries, schools, and environments that shaped how I
                  think and work.
                </p>
              </div>

              <ol className="talks-timeline">
                {journeyTimeline.map((item) => (
                  <li key={`${item.period}-${item.place}`} className="talks-timeline__item">
                    <span className="talks-timeline__dot" aria-hidden="true" />
                    <div className="talks-timeline__card">
                      <span className="talks-timeline__year">{item.period}</span>
                      <h3 className="talks-timeline__title">{item.place}</h3>
                      <p className="talks-timeline__description">{item.description}</p>
                      <span className="talks-timeline__meta">{item.location}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="page-section talks-section">
              <div className="talks-section__header">
                <h2>CV Snapshot</h2>
                <p className="talks-section__lead">
                  The professional version in one place, without making you open the PDF first.
                </p>
              </div>

              <ul className="home-panel__list">
                {cvHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
