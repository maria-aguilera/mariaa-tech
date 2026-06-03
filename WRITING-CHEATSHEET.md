# Writing Cheatsheet

Quick reference for writing blog posts in `content/blog/*.mdx`.

## Standard Markdown

| What you want | What you type |
|---|---|
| **Bold** | `**bold**` |
| *Italic* | `*italic*` |
| `Inline code` | `` `code` `` |
| Heading (section) | `## My Section` |
| Heading (sub-section) | `### My Subsection` |
| Link | `[text](https://example.com)` |
| Bullet list | `- one`  (one item per line, dash + space) |
| Sub-bullet | indent 2 spaces, then `- one` |
| Numbered list | `1. one` (auto-increments) |
| Blockquote | `> quoted text` |
| Horizontal rule | `---` on its own line |
| Code block | ` ```python ` then code then ` ``` ` |

## Your custom note components

Drop these tags inline anywhere in the post:

### `<Highlight>` — marker swipe over text
```mdx
The next idea: <Highlight>LEARN MANY MODELS</Highlight> beats one good one.
```
Colors: `yellow` (default), `pink`, `green`, `blue`, `purple`, `orange`.
Use like `<Highlight color="green">text</Highlight>`.

### `<KeyTerm>` — underlined coloured label, like "Ensemble:" in your notes
```mdx
<KeyTerm>Ensemble:</KeyTerm> combine many variations.
```
Same color options as `Highlight`. Defaults to purple.

### `<Arrow>` — green arrow line for "key concept"
```mdx
<Arrow>Concept of Ensemble Decision Boundary</Arrow>
```
Renders as a green → followed by the highlighted text. Stands on its own line.

### `<Callout>` — coloured paragraph box
```mdx
<Callout color="yellow">
  The catch with hyperparameter tuning: if you tune by checking the test set,
  it's no longer a fair estimate of generalization.
</Callout>
```
Use for highlighted paragraphs / "remember this" boxes.

### `<SubList>` — indented sub-points with `↳` markers
```mdx
<SubList>
- Crucial that the training set is representative of the cases you want to generalize to.
- If sample is too small, you'll have sampling noise.
- Even a large dataset can be non-representative if the sampling method is flawed.
</SubList>
```

### `<Image>` — figure with caption (already in use)
```mdx
<Image
  src="/images/blog/<slug>/<file>.jpg"
  alt="Describe the image for screen readers"
  caption="Caption shown under the image."
/>
```

## Front matter (top of every post)

```yaml
---
slug: my-post-slug
title: "Your title here"
subtitle: "One-sentence summary."
date: "Month Year"
excerpt: "Longer summary for the blog card and SEO."
tags:
  - Tag One
  - Tag Two
source: Notes        # or Blog, or Project
coverImage: "/images/blog/<slug>/cover.jpg"
style: navy          # optional — uses the dark-navy variant
bannerImage: "/images/blog/<slug>/banner.jpg"  # optional — only with style: navy
---
```

## Quick patterns

**Section opening with a callout intro:**
```mdx
## Section title

<Callout color="blue">
  Quick summary of what this section covers.
</Callout>

Body paragraphs follow normally.
```

**Highlighted term in running text:**
```mdx
The <KeyTerm>no-free-lunch theorem</KeyTerm> says there's no single best model.
```

**Indented sub-points after a main bullet:**
```mdx
- Main point
  <SubList>
  - First sub-point
  - Second sub-point
  </SubList>
- Next main point
```

## Where things live

| File | Purpose |
|---|---|
| `content/blog/*.mdx` | Your posts |
| `public/images/blog/<slug>/` | Images for a post |
| `public/notes/*.pdf` | PDF downloads |
| `components/mdx/NotesComponents.tsx` | Source of the note components |
| `app/globals.css` | Styling for everything |

## Preview while writing

```
npm run dev
```
Then open `http://localhost:3000/blog/<your-slug>`.
