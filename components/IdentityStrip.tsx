import Icon from "@/components/Icon";

type IdentityStripProps = {
  chessUsername: string;
  chessRapid: number | null;
  chessDaily: number | null;
  chessCountryCode: string | null;
  countriesLived: number;
  continents: number;
  languages: number;
};

function flagEmoji(code: string): string {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

export default function IdentityStrip({
  chessUsername,
  chessRapid,
  chessDaily,
  chessCountryCode,
  countriesLived,
  continents,
  languages,
}: IdentityStripProps) {
  return (
    <section className="identity-strip" aria-label="A few things about me">
      <article className="identity-card identity-card--chess">
        <header className="identity-card__header">
          <span className="identity-card__icon" aria-hidden="true">
            <Icon name="crown" />
          </span>
          <h3 className="identity-card__title">
            I play chess.
            {chessCountryCode ? (
              <span aria-hidden="true"> {flagEmoji(chessCountryCode)}</span>
            ) : null}
          </h3>
        </header>

        <p className="identity-card__subtitle">
          Bronze-league rapid on Chess.com · @{chessUsername}
        </p>

        <ul className="identity-card__bullets">
          <li>Rapid rating: {chessRapid ?? "—"}</li>
          <li>Daily rating: {chessDaily ?? "—"}</li>
          <li>Climbing slowly, mostly playing rapid</li>
        </ul>

        <a
          className="identity-card__cta"
          href={`https://www.chess.com/member/${chessUsername}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>View profile</span>
          <Icon name="external-link" aria-hidden="true" />
        </a>
      </article>

      <article className="identity-card identity-card--nomad">
        <header className="identity-card__header">
          <span className="identity-card__icon" aria-hidden="true">
            <Icon name="globe" />
          </span>
          <h3 className="identity-card__title">A nomadic childhood.</h3>
        </header>

        <p className="identity-card__subtitle">
          Spain → Brazil → Greece → Mexico → Switzerland → back to Spain.
        </p>

        <ul className="identity-card__bullets">
          <li>{countriesLived} countries before adulthood</li>
          <li>{continents} continents crossed</li>
          <li>{languages} languages spoken</li>
        </ul>

        <a className="identity-card__cta" href="#personal-timeline">
          <span>See timeline</span>
          <Icon name="arrow-right" aria-hidden="true" />
        </a>
      </article>

      <article className="identity-card identity-card--retos">
        <header className="identity-card__header">
          <span className="identity-card__icon" aria-hidden="true">
            <Icon name="mountain" />
          </span>
          <h3 className="identity-card__title">When it clicks.</h3>
        </header>

        <p className="identity-card__subtitle">
          Motivated by hard problems — the kind that keep not making sense until they do.
        </p>

        <ul className="identity-card__bullets">
          <li>School: maths, further maths, chemistry, mechanics</li>
          <li>University: game theory, econometrics, statistics</li>
          <li>Now: machine learning and anything that takes time to understand</li>
        </ul>

        <a className="identity-card__cta" href="/blog">
          <span>Read the notes</span>
          <Icon name="arrow-right" aria-hidden="true" />
        </a>
      </article>
    </section>
  );
}
