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
      <a
        href={`https://www.chess.com/member/${chessUsername}`}
        className="identity-card identity-card--chess"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="identity-card__icon" aria-hidden="true">♟</span>
        <span className="identity-card__eyebrow">
          Chess.com
          {chessCountryCode ? (
            <span aria-hidden="true"> {flagEmoji(chessCountryCode)}</span>
          ) : null}
        </span>
        <h3 className="identity-card__title">I play chess.</h3>
        <p className="identity-card__copy">
          Bronze-league pawn-pusher under @{chessUsername}. Rapid is the main format I&apos;m climbing.
        </p>
        <span className="identity-card__stats" aria-label="Chess ratings">
          <span>
            <span className="identity-card__stat-label">Rapid</span>
            <strong>{chessRapid ?? "—"}</strong>
          </span>
          <span>
            <span className="identity-card__stat-label">Daily</span>
            <strong>{chessDaily ?? "—"}</strong>
          </span>
        </span>
      </a>

      <div className="identity-card identity-card--nomad">
        <span className="identity-card__icon" aria-hidden="true">🌍</span>
        <span className="identity-card__eyebrow">Nómada del mundo</span>
        <h3 className="identity-card__title">I&apos;ve lived in five countries.</h3>
        <p className="identity-card__copy">
          Spain, Brazil, Greece, Mexico, Switzerland — childhood that taught me to land in a new city
          and just start.
        </p>
        <span className="identity-card__stats" aria-label="Nomad stats">
          <span>
            <span className="identity-card__stat-label">Countries</span>
            <strong>{countriesLived}</strong>
          </span>
          <span>
            <span className="identity-card__stat-label">Continents</span>
            <strong>{continents}</strong>
          </span>
          <span>
            <span className="identity-card__stat-label">Languages</span>
            <strong>{languages}</strong>
          </span>
        </span>
      </div>

      <div className="identity-card identity-card--retos">
        <span className="identity-card__icon" aria-hidden="true">⛷️</span>
        <span className="identity-card__eyebrow">Motivated by retos</span>
        <h3 className="identity-card__title">Challenges over comfort.</h3>
        <p className="identity-card__copy">
          Skiing since Montreux, with a soft spot for anything that needs another go at it. The
          discipline behind the work shows up on the slopes too.
        </p>
        <span className="identity-card__tags" aria-hidden="true">
          <span>Skiing</span>
          <span>Retos</span>
          <span>Discipline</span>
        </span>
      </div>
    </section>
  );
}
