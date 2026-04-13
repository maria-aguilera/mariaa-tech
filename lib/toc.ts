export type TocItem = {
  id: string;
  text: string;
  level: number;
};

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const cleanHeadingText = (text: string) =>
  text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\d+\.\s*/, "")
    .replace(/^\d+\)\s*/, "")
    .trim();

export function extractTocFromMdx(content: string): TocItem[] {
  const headingRegex = /^(#{2})\s+(.*)$/gm;
  const items: TocItem[] = [];

  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = cleanHeadingText(match[2].trim());
    items.push({ id: slugify(text), text, level });
  }

  return items;
}
