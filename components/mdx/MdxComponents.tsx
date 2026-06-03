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
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="post-figure">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={700}
        sizes="(min-width: 1024px) 720px, 90vw"
      />
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
};
