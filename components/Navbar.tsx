"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  Award,
  BookOpen,
  FileText,
  Home,
  Moon,
  Sun,
} from "lucide-react";
import { series } from "@/lib/series";

const THEME_STORAGE_KEY = "site-theme";
const THEME_CHANGE_EVENT = "site-theme-change";

type Theme = "light" | "dark";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}

function subscribeToTheme(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      onStoreChange();
    }
  };

  const handleThemeChange = () => onStoreChange();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  };
}

export default function Navbar() {
  const theme = useSyncExternalStore(subscribeToTheme, getStoredTheme, () => "light");
  const pathname = usePathname();
  const [blogMenuOpen, setBlogMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("theme-dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const handleToggle = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const iconSize = 16;

  return (
    <nav className="navbar">
      <Link href="/" className="navbar__brand">
        Maria Aguilera
      </Link>

      <ul className="navbar__menu">
        <li
          className={`navbar__item navbar__item--home ${isActive("/") ? "active" : ""}`}
        >
          <Link
            className="navbar__link"
            href="/"
            aria-current={isActive("/") ? "page" : undefined}
          >
            <Home size={iconSize} />
            <span>Home</span>
          </Link>
        </li>

        {/* Renamed Blog→Projects: this is the /blog page (the filterable index of everything). */}
        <li className={`navbar__item ${isActive("/blog") ? "active" : ""}`}>
          <Link
            className="navbar__link"
            href="/blog"
            aria-current={isActive("/blog") ? "page" : undefined}
          >
            <FileText size={iconSize} />
            <span>Projects</span>
          </Link>
        </li>

        {/* Renamed Projects→Blog: this hosts the curated writing + series dropdown on hover. */}
        <li
          className={`navbar__item navbar__item--has-menu ${isActive("/projects") ? "active" : ""}`}
          onMouseEnter={() => setBlogMenuOpen(true)}
          onMouseLeave={() => setBlogMenuOpen(false)}
          onFocus={() => setBlogMenuOpen(true)}
          onBlur={(e) => {
            // Only close if focus actually leaves the <li>
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setBlogMenuOpen(false);
            }
          }}
        >
          <Link
            className="navbar__link"
            href="/projects"
            aria-current={isActive("/projects") ? "page" : undefined}
            aria-haspopup="menu"
            aria-expanded={blogMenuOpen}
          >
            <BookOpen size={iconSize} />
            <span>Blog</span>
          </Link>

          {blogMenuOpen && (
            <div className="navbar__menu-popover" role="menu">
              {series.map((s) => (
                <div key={s.id} className="navbar__series">
                  <div className="navbar__series-header">
                    <div className="navbar__series-title">{s.title}</div>
                    <div className="navbar__series-desc">{s.description}</div>
                  </div>
                  <ul className="navbar__series-list">
                    {s.posts.map((p) =>
                      p.published ? (
                        <li key={p.slug}>
                          <Link href={`/blog/${p.slug}`} className="navbar__series-link" role="menuitem">
                            <span className="navbar__series-num">{String(p.part).padStart(2, "0")}</span>
                            <span>{p.title}</span>
                          </Link>
                        </li>
                      ) : (
                        <li key={p.slug} className="navbar__series-item navbar__series-item--soon">
                          <span className="navbar__series-num">{String(p.part).padStart(2, "0")}</span>
                          <span>{p.title}</span>
                          <span className="navbar__series-soon">Soon</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </li>

        <li className={`navbar__item ${isActive("/beyond-work") ? "active" : ""}`}>
          <Link
            className="navbar__link"
            href="/beyond-work"
            aria-current={isActive("/beyond-work") ? "page" : undefined}
          >
            <Award size={iconSize} />
            <span>Beyond Work</span>
          </Link>
        </li>
      </ul>

      <button
        className="theme-toggle"
        type="button"
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={theme === "dark"}
        onClick={handleToggle}
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </nav>
  );
}
