import { Compass, Dumbbell, Sparkles, type LucideIcon } from "lucide-react";
import BeyondWorkJourney from "@/components/BeyondWorkJourney";
import PageHero from "@/components/PageHero";
import { journeyTimeline } from "@/lib/journey-timeline";

const beyondWorkAreas: Array<{
  title: string;
  subtitle: string;
  items: string[];
  Icon: LucideIcon;
}> = [
  {
    title: "Sport and Energy",
    subtitle: "Movement is a big part of how I reset, stay disciplined, and think clearly.",
    items: [
      "Sport as a way to recharge and stay consistent.",
      "A preference for routines that build energy rather than drain it.",
      "The same discipline I value in projects also shows up outside work.",
    ],
    Icon: Dumbbell,
  },
  {
    title: "Curiosity Outside Work",
    subtitle: "I like side quests, learning arcs, and following interests that do not fit neatly in a job title.",
    items: [
      "Exploring ideas beyond the formal scope of work.",
      "Turning notes and experiments into things I can explain clearly.",
      "Staying curious enough to keep the portfolio human.",
    ],
    Icon: Compass,
  },
  {
    title: "The Miscellaneous Column",
    subtitle: "The softer details that make the site feel like a person, not just a resume.",
    items: [
      "The international context behind how I adapt quickly.",
      "Interests, habits, and small obsessions that shape the way I work.",
      "The story behind the output, not only the output itself.",
    ],
    Icon: Sparkles,
  },
];

export default function BeyondWorkPage() {
  return (
    <main className="blog-page">
      <PageHero
        title="Beyond Work"
        subtitle="The life, interests, and routines that sit outside the main portfolio"
        icon="award"
      />

      <section className="blog-body">
        <div className="blog-body__container">
          <div className="page-content">
            <section className="page-section talks-section">
              <div className="talks-section__header">
                <h2>Why this page exists</h2>
                <p className="talks-section__lead">
                  The home page and the CV cover the professional version. This page is for the
                  rest of the story: the parts that make the portfolio feel more personal, more
                  grounded, and less like a list of roles and projects.
                </p>
              </div>
            </section>

            <BeyondWorkJourney items={journeyTimeline} />

            <div className="home-panels__grid">
              {beyondWorkAreas.map((area) => (
                <article key={area.title} className="home-panel">
                  <header className="home-panel__header">
                    <span className="home-panel__icon" aria-hidden="true">
                      <area.Icon />
                    </span>
                    <h2 className="home-panel__title">{area.title}</h2>
                  </header>

                  <p className="home-panel__subtitle">{area.subtitle}</p>

                  <ul className="home-panel__list">
                    {area.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
