"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import {
  Award,
  FileText,
  Home,
  Monitor,
  Moon,
  PenSquare,
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
            <PenSquare size={iconSize} />
            <span>Blog</span>
          </Link>
        </li>

        <li className={`navbar__item ${isActive("/talks") ? "active" : ""}`}>
          <Link
            className="navbar__link"
            href="/talks"
            aria-current={isActive("/talks") ? "page" : undefined}
          >
            <Monitor size={iconSize} />
            <span>About</span>
          </Link>
        </li>

        <li className={`navbar__item ${isActive("/publications") ? "active" : ""}`}>
          <Link
            className="navbar__link"
            href="/publications"
            aria-current={isActive("/publications") ? "page" : undefined}
          >
            <FileText size={iconSize} />
            <span>Publications</span>
          </Link>
        </li>

        <li className={`navbar__item ${isActive("/awards") ? "active" : ""}`}>
          <Link
            className="navbar__link"
            href="/awards"
            aria-current={isActive("/awards") ? "page" : undefined}
          >
            <Award size={iconSize} />
            <span>Awards</span>
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
