# mariaa.tech image style — locked, matches the ChatGPT project system prompt

Anything below the fenced block is metadata. The fenced block is the single
source of truth — `generate.py` wraps every concept prompt with this block
before sending to gpt-image-1, mirroring exactly what the ChatGPT project's
system prompt does when Maria uses ChatGPT.

If Maria updates her ChatGPT project system prompt, update this file to match
so the API path stays aligned.

## The prompt template

```
Create a single editorial-infographic diagram for mariaa.tech.

VISUAL STYLE — non-negotiable, match exactly:

Background:
- Warm off-white background #fafaf7 filling the entire frame, NOT pure white
- No visible page edges, no dark border, no frame

Cards / panels:
- Every chart, panel, or grouped block sits inside an elevated rounded white card
- Card background is pure white on top of the off-white page
- Thin slate-grey 1px border in #e2e8f0
- 12px rounded corners
- Very subtle drop shadow, barely visible — like 0 1px 3px rgba(15,23,42,0.05)
- Generous padding inside each card so content breathes

Color palette — use ONLY these hex values:
- #1e293b (dark navy) — primary text, main strokes, curve outlines
- #2563eb (slate-blue) — accents, connectors, "neutral / process" labels
- #dc2626 (red) — "bad / underfit / high bias / warning" labels
- #059669 (green) — "good / sweet spot / balanced / success" labels
- No orange. No purple. No yellow. No mint. No amber. No coral. No pastels.

Typography:
- Modern geometric sans-serif ONLY: Inter, Geist, or Helvetica Neue
- Tight letter spacing, even stroke weights, crisp technical look
- Bold weights for titles, matching the concept's color (red/green/blue)
- Regular weight for body descriptions
- Lighter slate-grey for small captions and axis labels
- NEVER handwriting fonts, humanist sans, rounded display fonts, Source Sans,
  or anything warm / quirky
- All text should feel like it belongs in a modern data-product UI —
  sharp and editorial

Annotations:
- Small pill-shaped boxes with thin coloured outlines + matching tinted fill
- Pale green fill #ecfdf5 + green #059669 border + green text — for "sweet spot / correct" callouts
- Pale blue fill #eff6ff + slate-blue #2563eb border + slate-blue text — for neutral clarifying notes
- Pale red fill #fef2f2 + red #dc2626 border + red text — for warnings / failure states / gotchas

Connectors between panels:
- Thin dotted or dashed lines in slate-grey at low opacity
- Small arrow tips only when direction matters, otherwise clean line ends

Layout feel:
- Clean editorial-infographic — like a well-designed textbook figure or a
  Nicky Case / Stripe blog illustration
- NOT a flat business slide, NOT a marketing graphic, NOT a corporate deck

HARD RULES — never do any of the following:
- No dark filled rectangles for section headers — use bold coloured text
  instead, no fill
- No 3D effects, no gradients, no glassmorphism, no glow
- No emoji, no clip-art, no stock-photo people
- No blank margins — content fills the frame
- No brand logos, no watermarks, no "mariaa.tech" text inside the image
- No pure-white background — always the warm off-white #fafaf7

Reference for feel: an "Underfit / Good fit / Overfit" triptych with a
model-complexity-vs-prediction-error curve below — rounded elevated cards,
pill annotations, palette above. The image you generate should feel like it
belongs on the same page as that reference.

CONTENT TO DRAW:

[REPLACE THIS BLOCK WITH THE CONCEPT DESCRIPTION]

OUTPUT:

Single high-resolution PNG, 16:10 aspect ratio.
```
