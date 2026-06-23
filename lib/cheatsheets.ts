import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CHEATSHEETS_DIR = path.join(process.cwd(), "content/cheatsheets");

export type CheatsheetMeta = {
  slug: string;
  title: string;
  subtitle: string;
  /** Slug of the blog post this cheatsheet summarises. */
  sourcePost?: string;
  /** Slug of the project this cheatsheet summarises. */
  sourceProject?: string;
  /** Free-form label shown next to the source link. */
  sourceLabel?: string;
  topic?: string;
  tags: string[];
  updated?: string;
};

export type Cheatsheet = {
  meta: CheatsheetMeta;
  content: string;
};

const normalizeText = (value: unknown) =>
  typeof value === "string" ? value : "";

const normalizeTags = (value: unknown) =>
  Array.isArray(value) ? value.map((item) => String(item)) : [];

export function getCheatsheetSlugs(): string[] {
  if (!fs.existsSync(CHEATSHEETS_DIR)) {
    return [];
  }
  return fs
    .readdirSync(CHEATSHEETS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getAllCheatsheetMeta(): CheatsheetMeta[] {
  return getCheatsheetSlugs()
    .map((slug) => getCheatsheetBySlug(slug)?.meta)
    .filter((meta): meta is CheatsheetMeta => meta !== undefined);
}

export function getCheatsheetBySlug(slug: string): Cheatsheet | null {
  const fullPath = path.join(CHEATSHEETS_DIR, `${slug}.mdx`);
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
      sourcePost: normalizeText(data.sourcePost) || undefined,
      sourceProject: normalizeText(data.sourceProject) || undefined,
      sourceLabel: normalizeText(data.sourceLabel) || undefined,
      topic: normalizeText(data.topic) || undefined,
      tags: normalizeTags(data.tags),
      updated: normalizeText(data.updated) || undefined,
    },
    content,
  };
}
