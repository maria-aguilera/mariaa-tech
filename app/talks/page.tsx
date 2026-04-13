import PageHero from "@/components/PageHero";

const timeline = [
  {
    year: "2009",
    title: "Early spark",
    description: "Replace with the moment you first leaned into tech, science, or problem-solving.",
    location: "Origin story",
  },
  {
    year: "2014",
    title: "First ML project",
    description: "Swap in the project that made you fall in love with machine learning.",
    location: "University or lab",
  },
  {
    year: "2019",
    title: "Industry impact",
    description: "Highlight your first production system or customer-facing ML win.",
    location: "Company name",
  },
  {
    year: "2024",
    title: "Community + talks",
    description: "Note your first public talk, workshop, or mentorship milestone.",
    location: "Conference or meetup",
  },
];

export default function TalksPage() {
  return (
    <main className="talks-page">
      <PageHero
        title="About Me"
        subtitle="Miscellaneous things about me"
        icon="user"
      />

      <section className="page-section talks-section">
        <div className="talks-section__header">
          <h2>Lifetime Timeline</h2>
          <p className="talks-section__lead">
            A short, visual snapshot of the moments that shaped my work in AI and engineering.
          </p>
        </div>

        <ol className="talks-timeline">
          {timeline.map((item) => (
            <li key={`${item.year}-${item.title}`} className="talks-timeline__item">
              <span className="talks-timeline__dot" aria-hidden="true" />
              <div className="talks-timeline__card">
                <span className="talks-timeline__year">{item.year}</span>
                <h3 className="talks-timeline__title">{item.title}</h3>
                <p className="talks-timeline__description">{item.description}</p>
                <span className="talks-timeline__meta">{item.location}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="page-section talks-section">
        <h2>Talks</h2>
        <p>
          Recordings and slide decks from recent speaking engagements will live here. If you are
          interested in collaborating on a talk, reach out any time.
        </p>
      </section>
    </main>
  );
}
