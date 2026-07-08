import Image from "next/image";
import React from "react";
import { highlightCode } from "@/lib/code-highlight";
import { cleanHeadingText, slugify } from "@/lib/toc";
import {
  Highlight,
  KeyTerm,
  Arrow,
  Callout,
  SubList,
} from "@/components/mdx/NotesComponents";
import { Cite } from "@/components/mdx/Cite";
import {
  CheatGrid,
  CheatCard,
  CheatRule,
  CheatPills,
  CheatPill,
} from "@/components/mdx/CheatComponents";

type PreProps = {
  children: React.ReactElement<{ className?: string; children?: string }>;
};

const getHeadingText = (children: React.ReactNode) => {
  if (typeof children === "string") {
    return children;
  }

  if (Array.isArray(children)) {
    return children.join("");
  }

  return "";
};

export async function Pre({ children }: PreProps) {
  const className = children.props.className ?? "";
  const match = className.match(/language-(\w+)/);
  const language = match?.[1] ?? "text";
  const code = children.props.children ?? "";

  const html = await highlightCode(code.trim(), language);

  return (
    <div
      className="post-content__code"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function InlineCode(props: React.HTMLAttributes<HTMLElement>) {
  return <code className="post-content__inlineCode" {...props} />;
}

export function Note({ children }: { children: React.ReactNode }) {
  return <div className="callout callout--note">{children}</div>;
}

export function Tip({ children }: { children: React.ReactNode }) {
  return <div className="callout callout--tip">{children}</div>;
}

export function Warning({ children }: { children: React.ReactNode }) {
  return <div className="callout callout--warning">{children}</div>;
}

export function PostImage({
  src,
  alt,
  caption,
  wide,
}: {
  src: string;
  alt: string;
  caption?: string;
  /**
   * True for dense visuals (cheatsheets, wide diagrams) that need to break
   * out of the ~720px content column. Renders larger and taps open the
   * full-resolution source in a new tab so you can pinch-zoom on mobile.
   */
  wide?: boolean;
}) {
  const img = (
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={1000}
      sizes={
        wide
          ? "(min-width: 1440px) 1400px, (min-width: 1024px) 90vw, 100vw"
          : "(min-width: 1024px) 720px, 90vw"
      }
    />
  );

  return (
    <figure className={`post-figure${wide ? " post-figure--wide" : ""}`}>
      {wide ? (
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          title="Open full-size image"
          className="post-figure__link"
        >
          {img}
        </a>
      ) : (
        img
      )}
      {caption ? (
        <figcaption className="post-figure__caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function Video({
  src,
  title,
  caption,
}: {
  src: string;
  title: string;
  caption?: string;
}) {
  return (
    <figure className="post-video">
      <div className="post-video__frame">
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {caption ? (
        <figcaption className="post-figure__caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = cleanHeadingText(getHeadingText(props.children));
    return (
      <h2 id={slugify(text)} className="post-section__title" {...props} />
    );
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = cleanHeadingText(getHeadingText(props.children));
    return (
      <h3
        id={slugify(text)}
        className="post-content__subheading"
        {...props}
      />
    );
  },
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="post-content__paragraph" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="post-content__list" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="post-content__tableWrap">
      <table className="post-content__table" {...props} />
    </div>
  ),
  pre: Pre,
  code: InlineCode,
  Note,
  Tip,
  Warning,
  Image: PostImage,
  Video,
  Highlight,
  KeyTerm,
  Arrow,
  Callout,
  SubList,
  Cite,
  CheatGrid,
  CheatCard,
  CheatRule,
  CheatPills,
  CheatPill,
};
