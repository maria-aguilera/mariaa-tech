"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    lucide?: { createIcons: () => void };
  }
}

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 320);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (visible) {
      window.lucide?.createIcons();
    }
  }, [visible]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={`scroll-top ${visible ? "scroll-top--visible" : ""}`}
      type="button"
      onClick={handleClick}
      aria-label="Scroll to top"
    >
      <i data-lucide="arrow-up" aria-hidden="true" />
    </button>
  );
}
