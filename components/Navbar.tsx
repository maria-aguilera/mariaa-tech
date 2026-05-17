"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import {
  Award,
  BookOpen,
  FileText,
  Home,
  Moon,
  Sun,
} from "lucide-react";

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

  const iconSize = 18;

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

        <li className={`navbar__item ${isActive("/blog") ? "active" : ""}`}>
          <Link
            className="navbar__link"
            href="/blog"
            aria-current={isActive("/blog") ? "page" : undefined}
          >
            <BookOpen size={iconSize} />
            <span>Blog</span>
          </Link>
        </li>

        <li className={`navbar__item ${isActive("/projects") ? "active" : ""}`}>
          <Link
            className="navbar__link"
            href="/projects"
            aria-current={isActive("/projects") ? "page" : undefined}
          >
            <FileText size={iconSize} />
            <span>Projects</span>
          </Link>
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
