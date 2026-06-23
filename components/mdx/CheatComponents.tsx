import React from "react";

type Accent = "navy" | "blue" | "red" | "green" | "amber" | "purple" | "slate";

const accentClass = (accent: Accent | undefined) =>
  `cheat-accent--${accent ?? "navy"}`;

/**
 * Grid container — multi-column layout for cards.
 * Defaults to 2 columns on desktop, 1 on mobile.
 */
export function CheatGrid({
  children,
  columns = 2,
}: {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
}) {
  return (
    <div className={`cheat-grid cheat-grid--cols-${columns}`}>{children}</div>
  );
}

/**
 * Single cheatsheet card with title and accent color stripe.
 * Inside, render any MDX content: tables, lists, code, callouts.
 */
export function CheatCard({
  children,
  title,
  number,
  accent = "navy",
}: {
  children: React.ReactNode;
  title: string;
  number?: number | string;
  accent?: Accent;
}) {
  return (
    <section className={`cheat-card ${accentClass(accent)}`}>
      <header className="cheat-card__header">
        {number !== undefined && (
          <span className="cheat-card__number">{number}</span>
        )}
        <h2 className="cheat-card__title">{title}</h2>
      </header>
      <div className="cheat-card__body">{children}</div>
    </section>
  );
}

/**
 * Highlighted "Golden Rule" / key takeaway block. Full-width inside any grid.
 */
export function CheatRule({
  children,
  label = "Golden rule",
  accent = "red",
}: {
  children: React.ReactNode;
  label?: string;
  accent?: Accent;
}) {
  return (
    <aside className={`cheat-rule ${accentClass(accent)}`}>
      <span className="cheat-rule__label">{label}</span>
      <div className="cheat-rule__body">{children}</div>
    </aside>
  );
}

/**
 * Compact comparison row — a horizontal flexrow of mini-pills inside a card.
 * Useful for "Distance / Gradient / Tree" style verdicts.
 */
export function CheatPills({ children }: { children: React.ReactNode }) {
  return <div className="cheat-pills">{children}</div>;
}

export function CheatPill({
  children,
  title,
  accent = "slate",
}: {
  children: React.ReactNode;
  title: string;
  accent?: Accent;
}) {
  return (
    <div className={`cheat-pill ${accentClass(accent)}`}>
      <span className="cheat-pill__title">{title}</span>
      <span className="cheat-pill__body">{children}</span>
    </div>
  );
}

export const cheatComponents = {
  CheatGrid,
  CheatCard,
  CheatRule,
  CheatPills,
  CheatPill,
};
