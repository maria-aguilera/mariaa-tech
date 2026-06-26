"use client";

import Link from "next/link";
import { Download, Layers, Printer } from "lucide-react";

type Props = {
  slug: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
};

export default function CheatsheetCTA({ slug, title, subtitle, imageUrl }: Props) {
  const href = `/cheatsheets/${slug}`;

  const openPrint = () => {
    const win = window.open(href, "_blank");
    if (!win) return;
    const tryPrint = () => {
      try {
        win.focus();
        win.print();
      } catch {
        /* ignore */
      }
    };
    win.addEventListener("load", tryPrint, { once: true });
    setTimeout(tryPrint, 1500);
  };

  return (
    <aside className="cheatsheet-cta" aria-label="Cheat sheet for this post">
      <div className="cheatsheet-cta__icon" aria-hidden="true">
        <Layers />
      </div>
      <div className="cheatsheet-cta__body">
        <p className="cheatsheet-cta__eyebrow">One-page cheat sheet</p>
        <h3 className="cheatsheet-cta__title">{title}</h3>
        {subtitle ? (
          <p className="cheatsheet-cta__subtitle">{subtitle}</p>
        ) : null}
      </div>
      <div className="cheatsheet-cta__actions">
        <Link className="cheatsheet-cta__btn cheatsheet-cta__btn--primary" href={href}>
          View cheat sheet
        </Link>
        {imageUrl ? (
          <a
            className="cheatsheet-cta__btn cheatsheet-cta__btn--ghost"
            href={imageUrl}
            download
          >
            <Download aria-hidden="true" />
            <span>Download image</span>
          </a>
        ) : null}
        <button
          type="button"
          className="cheatsheet-cta__btn cheatsheet-cta__btn--ghost"
          onClick={openPrint}
        >
          <Printer aria-hidden="true" />
          <span>Save as PDF</span>
        </button>
      </div>
    </aside>
  );
}
