"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";

declare global {
  interface Window {
    lucide?: { createIcons: () => void };
  }
}

const ROTATION_MS = 6500;
const PAUSE_AFTER_INTERACTION_MS = 4000;
const SWIPE_THRESHOLD = 60;

const featuredItems = [
  {
    title: "GenAI Reflection for Amazon Bedrock",
    summary:
      "Use a configurable Python library for Amazon Bedrock LLMs which enhances performance by enabling additional compute at inference time.",
    tags: [
      { label: "GitHub", icon: "github" },
      { label: "Code", icon: "terminal" },
    ],
    cta: { label: "Read More", href: "/blog", icon: "book-open" },
    image: { src: "/featured-media.svg", alt: "Conference demo on stage" },
  },
  {
    title: "Intelligent Document Processing with Generative AI",
    summary:
      "Learn how to build an end-to-end IDP application using Amazon Bedrock to extract structured information from unstructured documents at scale.",
    tags: [
      { label: "AWS ML Blog", icon: "rss" },
      { label: "Blog", icon: "book-open" },
    ],
    cta: { label: "Read More", href: "/blog", icon: "book-open" },
    image: { src: "/featured-media.svg", alt: "Presentation illustration" },
  },
  {
    title: "Production-Ready GenAI Pipelines",
    summary:
      "Design reliable, observable GenAI workflows with guardrails, evaluation loops, and scalable infrastructure patterns.",
    tags: [
      { label: "Talks", icon: "mic-2" },
      { label: "Slides", icon: "file-text" },
    ],
    cta: { label: "View Talk", href: "/talks", icon: "play-circle" },
    image: { src: "/featured-media.svg", alt: "Speaker session snapshot" },
  },
];

export default function HomeFeatured() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<number | null>(null);
  const startXRef = useRef<number | null>(null);
  const deltaXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      const prefers = mediaQuery.matches;
      prefersReducedMotionRef.current = prefers;
      setPrefersReducedMotion(prefers);
    };
    handleChange();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  const clearTimers = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (resumeTimeoutRef.current !== null) {
      window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (prefersReducedMotionRef.current || featuredItems.length < 2) return;
    clearTimers();
    intervalRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredItems.length);
    }, ROTATION_MS);
  }, [clearTimers]);

  const scheduleResume = useCallback(() => {
    clearTimers();
    if (prefersReducedMotionRef.current || featuredItems.length < 2) return;

    resumeTimeoutRef.current = window.setTimeout(() => {
      if (!isHoveredRef.current) {
        startAutoplay();
      }
    }, PAUSE_AFTER_INTERACTION_MS);
  }, [clearTimers, startAutoplay]);

  useEffect(() => {
    if (prefersReducedMotion) {
      clearTimers();
      return;
    }

    if (!isHoveredRef.current) {
      startAutoplay();
    }

    return () => clearTimers();
  }, [prefersReducedMotion, clearTimers, startAutoplay]);

  useEffect(() => {
    if (isHovered) {
      clearTimers();
      return;
    }

    if (!prefersReducedMotionRef.current) {
      startAutoplay();
    }
  }, [isHovered, clearTimers, startAutoplay]);

  useEffect(() => {
    window.lucide?.createIcons();
  }, [activeIndex]);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    scheduleResume();
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % featuredItems.length);
    scheduleResume();
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
    scheduleResume();
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest("a, button")) return;
    isDraggingRef.current = true;
    startXRef.current = event.clientX;
    deltaXRef.current = 0;
    clearTimers();
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!isDraggingRef.current || startXRef.current === null) return;
    deltaXRef.current = event.clientX - startXRef.current;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const deltaX = deltaXRef.current;
    startXRef.current = null;
    deltaXRef.current = 0;

    if (deltaX < -SWIPE_THRESHOLD) {
      nextSlide();
      return;
    }

    if (deltaX > SWIPE_THRESHOLD) {
      prevSlide();
      return;
    }

    scheduleResume();
  };

  return (
    <section className="featured" aria-label="Featured content">
      <div className="featured__container">
        <article
          className="featured-card"
          onMouseEnter={() => {
            isHoveredRef.current = true;
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
            setIsHovered(false);
          }}
        >
          <div
            className="featured-card__track"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {featuredItems.map((item) => (
              <div
                key={item.title}
                className="featured-card__slide"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                <div className="featured-card__content">
                  <p className="featured-card__eyebrow">
                    <i data-lucide="star" aria-hidden="true" />
                    <span>Featured</span>
                  </p>

                  <h2 className="featured-card__title">{item.title}</h2>

                  <p className="featured-card__summary">{item.summary}</p>

                  <div className="featured-card__tags">
                    {item.tags.map((tag) => (
                      <span key={`${item.title}-${tag.label}`} className="featured-tag">
                        <i data-lucide={tag.icon} aria-hidden="true" />
                        <span>{tag.label}</span>
                      </span>
                    ))}
                  </div>

                  <Link className="featured-card__cta" href={item.cta.href}>
                    <i data-lucide={item.cta.icon} aria-hidden="true" />
                    <span>{item.cta.label}</span>
                  </Link>
                </div>

                <div className="featured-card__media">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={900}
                    height={700}
                    sizes="(min-width: 900px) 40vw, 90vw"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="featured-card__dots" role="tablist" aria-label="Featured items">
            {featuredItems.map((item, index) => (
              <button
                key={item.title}
                type="button"
                className={`featured-dot ${index === activeIndex ? "featured-dot--active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={`Show ${item.title}`}
                aria-current={index === activeIndex}
              />
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
