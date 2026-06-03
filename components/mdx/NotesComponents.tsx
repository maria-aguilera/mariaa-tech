import React from "react";

type Color = "yellow" | "pink" | "green" | "blue" | "purple" | "orange";

const colorClass = (color: Color | undefined) =>
  `notes-${color ?? "yellow"}`;

/**
 * Inline highlight — like a marker swipe over text.
 * Usage in MDX:  <Highlight>LEARN MANY MODELS</Highlight>
 * Or with a color:  <Highlight color="green">From my notes</Highlight>
 */
export function Highlight({
  children,
  color = "yellow",
}: {
  children: React.ReactNode;
  color?: Color;
}) {
  return (
    <span className={`notes-highlight ${colorClass(color)}`}>{children}</span>
  );
}

/**
 * Inline key term — looks like an underlined coloured label.
 * Usage in MDX:  <KeyTerm>Ensemble:</KeyTerm> combine many variations.
 */
export function KeyTerm({
  children,
  color = "purple",
}: {
  children: React.ReactNode;
  color?: Color;
}) {
  return (
    <span className={`notes-keyterm ${colorClass(color)}`}>{children}</span>
  );
}

/**
 * Arrow-prefixed line — like the green "→ Concept of Ensemble Decision Boundary" lines.
 * Usage in MDX:  <Arrow>Concept of Ensemble Decision Boundary</Arrow>
 */
export function Arrow({
  children,
  color = "green",
}: {
  children: React.ReactNode;
  color?: Color;
}) {
  return (
    <p className={`notes-arrow ${colorClass(color)}`}>
      <span className="notes-arrow__icon" aria-hidden="true">
        →
      </span>
      <span className="notes-arrow__text">{children}</span>
    </p>
  );
}

/**
 * Block callout — coloured paragraph box like a highlighted paragraph in your notes.
 * Usage in MDX:
 *   <Callout color="yellow">The catch with hyperparameter tuning...</Callout>
 */
export function Callout({
  children,
  color = "yellow",
}: {
  children: React.ReactNode;
  color?: Color;
}) {
  return (
    <div className={`notes-callout ${colorClass(color)}`}>{children}</div>
  );
}

/**
 * Nested sub-bullet list — a styled <ul> with a different bullet marker, for indented points.
 * Usage in MDX:
 *   <SubList>
 *     - point one
 *     - point two
 *   </SubList>
 * (Use plain markdown bullets inside — MDX will render them as <li>s.)
 */
export function SubList({ children }: { children: React.ReactNode }) {
  return <div className="notes-sublist">{children}</div>;
}
