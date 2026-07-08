---
name: diagram-prompt
description: Produce a concept-only ChatGPT prompt (or a batch of up to 10) for a mariaa.tech blog diagram. Invoke when Maria asks for an image prompt for a blog cover, in-post diagram, or cheatsheet panel. The visual style is already locked in her ChatGPT project — this skill only writes the CONTENT description, never re-specifies style rules.
---

# diagram-prompt

Maria has a ChatGPT project ("mariaa.tech diagrams") whose system prompt locks the entire visual style: warm off-white background, Inter/Geist sans-serif, palette of **navy `#1e293b` + slate-blue `#2563eb` + red `#dc2626` + green `#059669`**, pale pill annotations, no orange/purple/yellow, no handwriting, no 3D. **Do not restate any of that** — it's automatic on her side. Restating it dilutes the concept and confuses ChatGPT.

Your only job is to write the CONTENT description that plugs into that locked style.

## Output structure (proven pattern — use this unless the concept genuinely can't fit)

Every prompt should follow the shape that already produced 7 great covers for her:

0. **Reference line** — the FIRST line of every prompt must be exactly: `Use the attached wealth-vs-happiness image as the visual reference — match its background, palette, typography, card style, and pill annotations.` Maria always attaches this image to her ChatGPT conversation; the reference is what keeps the output on-brand. Never omit this line.
1. **Title line** — `Diagram request: "<one-line title of what the reader will learn>"`
2. **Top row** — 2 to 4 elevated cards side by side, each with a bold colored title and short content description
3. **Bottom card** (full width) — the "unified view" that ties the top cards together, with 1–2 pill annotations
4. **Bottom summary strip** — one line at the very bottom: `Word · Word · Word → the takeaway sentence.`

The bottom summary strip is her signature. Always include it.

## Batch header

When batching multiple prompts in one message, put the reference line ONCE at the top of the message (not inside every numbered prompt) so ChatGPT doesn't get 10 copies of it — like this:

```
All 10 images: use the attached wealth-vs-happiness image as the visual reference — match its background, palette, typography, card style, and pill annotations.

---

1. Diagram request: "..."
...
---
2. Diagram request: "..."
...
```

For single-prompt responses, put the reference line inside the code block as line 0.

## Colour rules — hard

Only reference colour by role, and only within her locked palette:

- `red` — bad, wrong, failure, high-error, threat
- `green` — good, sweet-spot, best-balance, success, best-outcome
- `slate-blue` — neutral, process, intermediate step, primary accent
- `navy` — primary text and main titles only

Never use these words: `amber`, `purple`, `orange`, `mint`, `sky-blue`, `coral`, `pastel`, `warm`, `cream`. Swap each to the palette role it maps to.

## Never describe these — locked at project level

Background, fonts, card styling, borders, shadows, rounded corners, spacing, drop shadow, elevation, aspect ratio, resolution, "hand-drawn", "sketch", "whiteboard", "3D", "gradient", "glow", "flat design", "modern", "clean". If you write any of these, delete them before returning the prompt.

## Pill annotations

Callouts sit in pale-tinted pills using her palette:
- `pale-red pill` — for warnings, failure states, gotchas
- `pale-blue pill` — for neutral clarifying notes
- `pale-green pill` — for the takeaway / best-choice / correct-answer

## Batch mode

ChatGPT can only generate 10 images per message. If Maria hands you >10 concepts, split into batches of 10 max, and label them "Batch 1 / Batch 2 / …". Inside a batch, number the prompts `1.`, `2.`, … separated by `---`.

If Maria hands you ≤10 concepts, produce them all in one message, numbered, separated by `---`.

## Length

150–350 words per prompt. If you're going longer, you're describing style — cut it.

## Example that worked (reference — do not output verbatim)

Concept: *"How an LLM predicts the next token"*

```
Diagram request: "How an LLM predicts the next token"

Top row — 3 cards side by side:
  Card 1 · title "Tokenise" (slate-blue). Show "The cat sat on the"
    broken into 5 token boxes with integer token ids below each.
  Card 2 · title "Contextualise" (slate-blue). Stack of 3 attention
    layers with the sequence entering left and a "context" vector
    exiting right.
  Card 3 · title "Sample" (green). Horizontal bar chart of 5 candidate
    next-tokens: "mat" 0.62 highlighted green, "chair" 0.14, "floor"
    0.10, "table" 0.08, "roof" 0.06.

Bottom card (full width) — title "The full loop" (navy). tokens →
embeddings → transformer stack (3 attention + 3 FFN, alternating) →
logits → softmax → sampled token. Add a pale-blue pill: "temperature
= 0.7 controls softmax sharpness".

Bottom strip: Tokenise · Contextualise · Sample → the model never
"understands", it just picks the next token.
```

## When the concept doesn't fit the "cards + bottom card + summary strip" mold

Adapt the composition — a scatter plot, a decision tree, a comparison table. But: still open with `Diagram request: "…"`, still end with the bottom summary strip, still stay inside the palette. The layout can vary; the style block never does.

## Response style

- Return **only the prompt(s)**. No preamble like "here's your prompt", no explanation, no advice at the end — Maria is going to copy-paste directly.
- Wrap each prompt in a markdown code block so it's one-click copyable.
- If she asks for multiple, number them and separate with `---`.

## Two modes: PROMPT mode vs GENERATE mode

Read Maria's verb. It decides which mode you're in.

**PROMPT mode** (default) — she says "give me a diagram prompt for X", "prompt for the RAG page", "write me an image prompt for …". You return the concept-only prompt in a code block. She'll paste into her ChatGPT project.

**GENERATE mode** — she says "generate the cover for X", "create the image for …", "make the Part N image". Actually produce the PNG, don't just write words. Steps:

1. Write the concept-only prompt following the rules above.
2. Save it to a temp file, e.g. `/tmp/<slug>-prompt.txt` (multi-line prompts through --content arg are fragile in shell).
3. Run:
   ```
   "/Users/maguilera/Projects/Cheat sheets and posts generations/cheatsheet-mcp/.venv/bin/python" \
       .claude/skills/diagram-prompt/generate.py \
       --content-file /tmp/<slug>-prompt.txt \
       --out public/images/blog/<subdir>/<slug>.png
   ```
   The script auto-wraps the concept in the style_prompt.md template from the sibling `cheatsheet-mcp/` repo, calls OpenAI `gpt-image-1`, and saves the PNG. Uses `OPENAI_API_KEY` from the sibling `.env` — never hardcode a key here.
4. If it's a blog cover: also add `coverImage: "/images/blog/<subdir>/<slug>.png"` to the frontmatter of the relevant `content/blog/*.mdx`.
5. Give Maria the saved path and let her decide if she wants to push.

**Cost note**: gpt-image-1 at high quality, 1536×1024 = ~$0.19 per image. Don't loop-generate. Generate once, show her, only regenerate on her word.

**Batching + rate limits**: the OpenAI API has no 10-image-per-message cap — that limit was ChatGPT's UI. Via the API you can generate all 7 GenAI covers in sequence in one turn if she asks. Still, ask before firing off >3 in a row (cost).
