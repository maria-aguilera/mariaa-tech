import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export type MdxPostSource = "Blog" | "Project" | "Notes";

export type MdxPostMeta = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  updated?: string;
  excerpt: string;
  tags: string[];
  source: MdxPostSource;
  coverImage: string;
};

export type MdxPost = {
  meta: MdxPostMeta;
  content: string;
};

const normalizeText = (value: unknown) => (typeof value === "string" ? value : "");

const normalizeTags = (value: unknown) =>
  Array.isArray(value) ? value.map((item) => String(item)) : [];

const normalizeSource = (value: unknown): MdxPostSource => {
  const normalized = normalizeText(value).trim().toLowerCase();

  if (normalized === "project" || normalized === "projects") {
    return "Project";
  }

  if (
    normalized === "note" ||
    normalized === "notes" ||
    normalized === "cheatsheet" ||
    normalized === "cheatsheets" ||
    normalized === "cheat sheet" ||
    normalized === "cheat-sheet"
  ) {
    return "Notes";
  }

  if (
    normalized === "blog" ||
    normalized === "blogs" ||
    normalized === "post" ||
    normalized === "posts" ||
    normalized === "personal"
  ) {
    return "Blog";
  }

  return "Blog";
};

export function getMdxPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  return fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".mdx"));
}

export function getAllMdxPostMeta(): MdxPostMeta[] {
  return getMdxPostSlugs().map((filename) => {
    const fullPath = path.join(BLOG_DIR, filename);
    const source = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(source);

    const slug = normalizeText(data.slug) || filename.replace(/\.mdx$/, "");

    return {
      slug,
      title: normalizeText(data.title),
      subtitle: normalizeText(data.subtitle),
      date: normalizeText(data.date),
      updated: normalizeText(data.updated) || undefined,
      excerpt: normalizeText(data.excerpt),
      tags: normalizeTags(data.tags),
      source: normalizeSource(data.source),
      coverImage: normalizeText(data.coverImage) || "/featured-media.svg",
    };
  });
}

export function getMdxPostBySlug(slug: string): MdxPost | null {
  const fullPath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);

  return {
    meta: {
      slug: normalizeText(data.slug) || slug,
      title: normalizeText(data.title),
      subtitle: normalizeText(data.subtitle),
      date: normalizeText(data.date),
      updated: normalizeText(data.updated) || undefined,
      excerpt: normalizeText(data.excerpt),
      tags: normalizeTags(data.tags),
      source: normalizeSource(data.source),
      coverImage: normalizeText(data.coverImage) || "/featured-media.svg",
    },
    content,
  };
}
