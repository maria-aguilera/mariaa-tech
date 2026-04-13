import { cache } from "react";
import { createHighlighter } from "shiki/dist/index.mjs";

const supportedLangs = new Set([
  "bash",
  "json",
  "javascript",
  "typescript",
  "python",
  "yaml",
  "text",
]);

const getShiki = cache(async () => {
  return createHighlighter({
    themes: ["github-dark-dimmed"],
    langs: Array.from(supportedLangs),
  });
});

export async function highlightCode(code: string, language?: string) {
  const lang = language && supportedLangs.has(language) ? language : "text";
  const highlighter = await getShiki();
  return highlighter.codeToHtml(code, {
    lang,
    theme: "github-dark-dimmed",
  });
}
