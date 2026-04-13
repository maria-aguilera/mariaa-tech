import Link from "next/link";

const highlights = [
  {
    title: "Blog",
    subtitle: "Insights and AI tutorials",
    icon: "book-open",
    href: "/blog",
    items: ["AWS blog posts", "Python and ML tutorials", "Code samples and guides"],
  },
  {
    title: "Talks",
    subtitle: "AI meetups and conferences",
    icon: "mic-2",
    href: "/talks",
    items: ["AI industry meetups", "Tech summits and lofts", "Scientific ML conferences"],
  },
  {
    title: "Publications",
    subtitle: "Academic research papers",
    icon: "file-text",
    href: "/publications",
    items: ["Conference proceedings", "Peer-reviewed publications", "Journal articles and preprints"],
  },
];

export default function HomeHighlights() {
  return (
    <section className="home-panels" aria-label="Highlights">
      <div className="home-panels__container">
        <div className="home-panels__grid">
          {highlights.map((panel) => (
            <article key={panel.title} className="home-panel">
              <header className="home-panel__header">
                <span className="home-panel__icon" aria-hidden="true">
                  <i data-lucide={panel.icon} />
                </span>
                <h2 className="home-panel__title">{panel.title}</h2>
              </header>

              <p className="home-panel__subtitle">{panel.subtitle}</p>

              <ul className="home-panel__list">
                {panel.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <Link className="home-panel__cta" href={panel.href}>
                <span>Explore</span>
                <i data-lucide="external-link" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
