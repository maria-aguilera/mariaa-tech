import Link from "next/link";

const highlights = [
  {
    title: "Blog",
    subtitle: "Notes, tutorials, and study guides",
    icon: "book-open",
    href: "/blog",
    items: ["Study notes from zero", "Project tutorials and walkthroughs", "ML and AI explainers"],
  },
  {
    title: "Projects",
    subtitle: "Builds, experiments, and case studies",
    icon: "file-text",
    href: "/projects",
    items: ["End-to-end ML builds", "Reinforcement learning experiments", "Data + AI work with real outputs"],
  },
  {
    title: "Beyond Work",
    subtitle: "The human side behind the portfolio",
    icon: "award",
    href: "/beyond-work",
    items: ["Life timeline across countries", "Sports, routines, and interests", "The things I am exploring outside work"],
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
