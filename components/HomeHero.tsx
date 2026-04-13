"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, type SVGProps } from "react";

declare global {
  interface Window {
    lucide?: { createIcons: () => void };
  }
}

function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3" />
      <path d="M22 16.92v-3a6 6 0 0 0-1.76-4.24A6 6 0 0 0 20.91 6c-.09-.65-.3-1.28-.62-1.85-.32-.57-.74-1.07-1.24-1.5-1.8 0-3 .7-3.6 1.1a12.32 12.32 0 0 0-6.9 0C7.95 3.35 6.75 2.65 4.95 2.65c-.5.43-.92.93-1.24 1.5-.32.57-.53 1.2-.62 1.85a6 6 0 0 0 .67 3.68A6 6 0 0 0 2 13.92v3a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z" />
      <path d="M9 22v-4.87a3.37 3.37 0 0 1 .94-2.61" />
      <path d="M15 22v-4.87a3.37 3.37 0 0 0-.94-2.61" />
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function HomeHero() {
  useEffect(() => {
    window.lucide?.createIcons();
  }, []);

  return (
    <>
      <Script
        src="https://unpkg.com/lucide@1.7.0/dist/umd/lucide.min.js"
        strategy="afterInteractive"
        onLoad={() => window.lucide?.createIcons()}
      />

      <section className="hero">
        <div className="hero__container">
          <div className="hero__layout">
            <div className="hero__photoCol">
              <div className="hero__photoFrame">
                <Image
                  className="hero__photo"
                  src="https://raw.githubusercontent.com/maria-aguilera/portfolio-assets/refs/heads/master/maria-headshot.png"
                  alt="Maria Aguilera García"
                  width={256}
                  height={256}
                  priority
                  sizes="256px"
                />
              </div>
            </div>

            <div className="hero__content">
              <div>
                <h1 className="hero__title">Maria Aguilera García</h1>

                <div className="hero__bullets">
                  <p className="hero__bullet">✨ Data &amp; AI focused on real-world impact</p>
                  <p className="hero__bullet">
                    🚀 Building ML + analytics solutions that drive business value
                  </p>
                  <p className="hero__bullet">🔥 MSc Big Data (AI) • currently at BMC Software</p>
                </div>
              </div>

              <div className="hero__actions">
                <div className="hero__icons" aria-label="Social links">
                  <a
                    className="iconBtn"
                    href="mailto:mariaaguilera979797@gmail.com"
                    aria-label="Email"
                  >
                    <i data-lucide="mail" aria-hidden="true" />
                  </a>
                  <a
                    className="iconBtn"
                    href="https://github.com/maria-aguilera"
                    aria-label="GitHub"
                  >
                    <GitHubIcon aria-hidden="true" />
                  </a>
                  <a
                    className="iconBtn"
                    href="https://www.linkedin.com/in/maria-aguilera-garcia/"
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon aria-hidden="true" />
                  </a>
                  <a className="iconBtn" href="https://kaggle.com/maria-aguilera" aria-label="Kaggle">
                    <i data-lucide="bar-chart-3" aria-hidden="true" />
                  </a>
                  <a
                    className="iconBtn"
                    href="https://medium.com/@mariaaguilera"
                    aria-label="Blog"
                  >
                    <i data-lucide="pen-square" aria-hidden="true" />
                  </a>
                </div>

                <a className="cvBtn" href="/resume.pdf" download>
                  <i data-lucide="download" aria-hidden="true" />
                  <span>Download CV</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
