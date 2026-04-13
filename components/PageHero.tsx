"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    lucide?: { createIcons: () => void };
  }
}

type PageHeroProps = {
  title: string;
  subtitle: string;
  icon: string;
};

export default function PageHero({ title, subtitle, icon }: PageHeroProps) {
  useEffect(() => {
    window.lucide?.createIcons();
  }, [icon]);

  return (
    <>
      <Script
        src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"
        strategy="afterInteractive"
        onLoad={() => window.lucide?.createIcons()}
      />

      <section className="page-hero">
        <div className="page-hero__inner">
          <Link className="page-hero__avatarLink" href="/" aria-label="Home">
            <Image
              className="page-hero__avatar"
              src="https://raw.githubusercontent.com/maria-aguilera/portfolio-assets/refs/heads/master/maria-headshot.png"
              alt="Maria Aguilera Garcia"
              width={64}
              height={64}
              priority
              sizes="64px"
            />
          </Link>

          <div className="page-hero__content">
            <h1 className="page-hero__title">{title}</h1>

            <p className="page-hero__subtitle">
              <i data-lucide={icon} className="page-hero__icon" aria-hidden="true" />
              <span>{subtitle}</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
