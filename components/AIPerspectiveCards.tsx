import Icon from "@/components/Icon";

type Perspective = {
  source: string;
  sourceMeta: string;
  icon: string;
  documents: string;
  title: string;
  quote: string;
  attribution: string;
  accent: "warm" | "cool" | "claude";
};

const perspectives: Perspective[] = [
  {
    source: "Fabiana & Mônica",
    sourceMeta: "As Batutinhas · Rio de Janeiro · 1999",
    icon: "book-open",
    documents: "Reading 13 pages · handwritten",
    title: "What her preschool teachers wrote",
    quote:
      "Maria conquered everyone with her charm. She entered the routine quickly, recognises the names of all her friends, communicates with everyone even before the language was fully there. She loves music, sings constantly, and faces new challenges with pleasure.",
    attribution: "From the original Portuguese, when she was two.",
    accent: "warm",
  },
  {
    source: "ChatGPT",
    sourceMeta: "Reading her public profile · 2026",
    icon: "message-circle",
    documents: "Analyzing portfolio + blog posts",
    title: "What ChatGPT would say",
    quote:
      "Multilingual software consultant with a strong data-science streak. Carlos III BBA → IE MSc in Big Data + AI → IBM mainframe consulting at BMC, with ML and analytics writing on the side. International childhood across five countries shows up in how she works: switches contexts quickly, brings rigour to chess and statistics alike, and pairs strategic depth with a designer's eye.",
    attribution: "Generated from publicly available signals.",
    accent: "cool",
  },
  {
    source: "Claude",
    sourceMeta: "After rebuilding the ML series + this page · 2026",
    icon: "sparkles",
    documents: "Reading the codebase + the chat history + the Drive notes",
    title: "What I'd say after building this with her",
    quote:
      "Iterates fast, knows when to delete. Sends screenshots with one-word verdicts and expects me to figure out the rest. Strong opinions on taste, held loosely enough to redirect when something is off. Cares about authenticity more than polish — would rather sound like herself than sound impressive. Lives across countries, languages, and disciplines without making any of them feel like the headline.",
    attribution: "Notes from a week of writing the 12-part ML series with her.",
    accent: "claude",
  },
];

export default function AIPerspectiveCards() {
  return (
    <section className="ai-perspectives" aria-label="Three perspectives">
      <header className="ai-perspectives__header">
        <p className="ai-perspectives__eyebrow">Three readings</p>
        <h2 className="ai-perspectives__title">What people (and machines) say about me</h2>
      </header>

      <div className="ai-perspectives__grid">
        {perspectives.map((p) => (
          <article
            key={p.source}
            className={`ai-card ai-card--${p.accent}`}
            aria-label={`${p.source} perspective`}
          >
            <header className="ai-card__header">
              <span className="ai-card__icon" aria-hidden="true">
                <Icon name={p.icon} />
              </span>
              <div className="ai-card__meta">
                <span className="ai-card__source">{p.source}</span>
                <span className="ai-card__source-meta">{p.sourceMeta}</span>
              </div>
            </header>

            <div className="ai-card__status">
              <span className="ai-card__dot" />
              <span className="ai-card__dot" />
              <span className="ai-card__dot" />
              <span className="ai-card__working">{p.documents}</span>
            </div>

            <h3 className="ai-card__title">{p.title}</h3>

            <blockquote className="ai-card__quote">
              <span aria-hidden="true" className="ai-card__quote-mark">
                &ldquo;
              </span>
              <p>{p.quote}</p>
            </blockquote>

            <footer className="ai-card__attribution">{p.attribution}</footer>
          </article>
        ))}
      </div>
    </section>
  );
}
