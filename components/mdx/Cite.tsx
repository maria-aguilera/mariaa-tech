"use client";

import { useState, useRef, useEffect } from "react";

type CiteProps = {
  url: string;
  source: string;
  title?: string;
  date?: string;
  snippet?: string;
  favicon?: string;
};

const extractDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

export function Cite({ url, source, title, date, snippet, favicon }: CiteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const domain = extractDomain(url);
  const faviconUrl =
    favicon ?? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <span
      ref={wrapperRef}
      className="cite"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <a
        className="cite__chip"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="cite__favicon"
          src={faviconUrl}
          alt=""
          width={14}
          height={14}
        />
        <span className="cite__source">{source}</span>
      </a>

      {isOpen && (title || snippet || date) && (
        <span className="cite__popover" role="tooltip">
          {title && <span className="cite__popoverTitle">{title}</span>}
          {(date || snippet) && (
            <span className="cite__popoverMeta">
              {date && <span className="cite__popoverDate">{date}</span>}
              {date && snippet && <span> — </span>}
              {snippet && <span className="cite__popoverSnippet">{snippet}</span>}
            </span>
          )}
          <span className="cite__popoverFooter">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="cite__favicon cite__favicon--lg"
              src={faviconUrl}
              alt=""
              width={20}
              height={20}
            />
            <span className="cite__popoverSource">{source}</span>
          </span>
        </span>
      )}
    </span>
  );
}
