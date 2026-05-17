type Perspective = {
  source: string;
  sourceMeta: string;
  avatar: string;
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
    avatar: "📓",
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
    avatar: "🤖",
    documents: "Analyzing portfolio + blog posts",
    title: "What ChatGPT would say",
    quote:
      "A multilingual data engineer with an unusually international upbringing — five countries before adulthood — now building ML and analytics work at BMC. Brings the same rigour to chess and skiing as to code, and pairs strategic depth with a designer's eye.",
    attribution: "Generated from publicly available signals.",
    accent: "cool",
  },
  {
    source: "Claude",
    sourceMeta: "After this conversation · 2026",
    avatar: "✶",
    documents: "Reading the codebase + the chat history",
    title: "What I&apos;d say after building this with you",
    quote:
      "Iterates fast, knows when to delete. Has strong opinions about taste but holds them loosely enough to redirect when something is off. Lives across countries, languages, and disciplines without making any of them feel like the headline.",
    attribution: "Notes from someone who watched her work for an afternoon.",
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
              <span className="ai-card__avatar" aria-hidden="true">{p.avatar}</span>
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
              <span aria-hidden="true" className="ai-card__quote-mark">“</span>
              <p>{p.quote}</p>
            </blockquote>

            <footer className="ai-card__attribution">{p.attribution}</footer>
          </article>
        ))}
      </div>
    </section>
  );
}
