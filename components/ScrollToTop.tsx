"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      // Show the button once we've moved past the hero, OR if the page is
      // tall enough to scroll meaningfully and we're still at the top.
      setVisible(scrollY > 320 || docHeight > 800);
      // "atTop" once we're within the first ~40% of the page — clicking goes DOWN.
      // Past that — clicking goes UP.
      setAtTop(scrollY < docHeight * 0.4);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleClick = () => {
    if (atTop) {
      // First, smooth-scroll toward the bottom we can see right now.
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });

      // The page is still rendering (images, KaTeX, hydration), so the real
      // bottom keeps moving. Poll scrollHeight and re-snap to the new bottom
      // using "auto" (instant) so the user lands at the true end. Stop once
      // the page height has been stable for ~600ms, or after 4s as a cap.
      let lastHeight = -1;
      let stableTicks = 0;
      const intervalId = window.setInterval(() => {
        const h = document.documentElement.scrollHeight;
        if (h !== lastHeight) {
          lastHeight = h;
          stableTicks = 0;
          window.scrollTo({ top: h, behavior: "auto" });
        } else if (++stableTicks >= 3) {
          window.clearInterval(intervalId);
        }
      }, 200);
      window.setTimeout(() => window.clearInterval(intervalId), 4000);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      className={`scroll-top ${visible ? "scroll-top--visible" : ""}`}
      type="button"
      onClick={handleClick}
      aria-label={atTop ? "Scroll to bottom" : "Scroll to top"}
    >
      <Icon name={atTop ? "arrow-down" : "arrow-up"} aria-hidden="true" />
    </button>
  );
}
