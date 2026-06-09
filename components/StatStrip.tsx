import Icon from "@/components/Icon";

type StatStripProps = {
  continents: number;
  countries: number;
};

const COUNTRIES = ["Spain", "Brazil", "Greece", "Mexico", "Switzerland"] as const;
const CONTINENTS = ["Europe", "South America", "North America"] as const;
const LANGUAGES = ["Spanish (Native)", "English (Bilingual)", "French (Advanced)", "Portuguese (Basic)"] as const;

export default function StatStrip({ continents, countries }: StatStripProps) {
  return (
    <section className="stat-strip stat-strip--three" aria-label="At a glance">
      <div className="stat-card stat-card--hover" tabIndex={0}>
        <header className="stat-card__header">
          <span className="stat-card__icon" aria-hidden="true">
            <Icon name="map-pin" />
          </span>
          <h3 className="stat-card__label">Countries</h3>
        </header>
        <p className="stat-card__big">{countries}</p>
        <ul className="stat-card__bullets" aria-label="Countries I have lived in">
          {COUNTRIES.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>

      <div className="stat-card stat-card--hover" tabIndex={0}>
        <header className="stat-card__header">
          <span className="stat-card__icon" aria-hidden="true">
            <Icon name="globe" />
          </span>
          <h3 className="stat-card__label">Continents</h3>
        </header>
        <p className="stat-card__big">{continents}</p>
        <ul className="stat-card__bullets" aria-label="Continents I have lived in">
          {CONTINENTS.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>

      <div className="stat-card stat-card--hover" tabIndex={0}>
        <header className="stat-card__header">
          <span className="stat-card__icon" aria-hidden="true">
            <Icon name="languages" />
          </span>
          <h3 className="stat-card__label">Languages</h3>
        </header>
        <p className="stat-card__big">{LANGUAGES.length}</p>
        <ul className="stat-card__bullets" aria-label="Languages I speak">
          {LANGUAGES.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
