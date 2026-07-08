#!/usr/bin/env python3
"""Generate Part 2 (GenAI · LLM Foundations) inline diagrams via API.

Uses images.edit with wealth-vs-happiness.png as visual reference,
same as when Maria attaches it in ChatGPT. Saves to
public/images/blog/genai/inline/.
"""

from __future__ import annotations
import base64
import os
import re
import sys
from pathlib import Path

SIBLING = Path("/Users/maguilera/Projects/Cheat sheets and posts generations/cheatsheet-mcp")
ENV_PATH = SIBLING / ".env"
STYLE_PATH = SIBLING / "references" / "style_prompt.md"
REFERENCE_IMAGE = SIBLING / "references" / "wealth-vs-happiness.png"
OUT_DIR = Path("public/images/blog/genai/inline")


def load_env() -> None:
    for raw in ENV_PATH.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def wrap(content: str) -> str:
    md = STYLE_PATH.read_text()
    m = re.search(r"```\s*\n(.*?)\n```", md, re.DOTALL)
    template = m.group(1).strip()
    placeholder = re.compile(r"\[REPLACE THIS BLOCK[^\]]*\]", re.IGNORECASE | re.DOTALL)
    return placeholder.sub(content.strip(), template)


JOBS: list[tuple[str, str]] = [
    ("inline-part-2-attention.png", """Diagram request: "How much does each word care about each other word?"

Top card (full width) — title "How much does each word care about each other word?" (navy). Show the sentence "The cat sat on the mat" written across the top as 6 token boxes. Below the tokens: a 6×6 attention grid (heat-map style) where each cell shows a small filled circle whose size represents attention weight. Highlight the row for token "sat" with a slate-blue outline. Add small text arrows below the grid showing what "sat" pays most attention to: "cat" (subject), "on" (location), "mat" (object).

Bottom card — title "The formula, decomposed" (slate-blue). Left to right: 3 small boxes labelled Q, K, V (each drawn as a small vector). An arrow from Q · Kᵀ into a softmax box, then into a "weighted sum with V" box, then into a single output vector on the right. Add a pale-blue pill: "Every token is a weighted mix of every other token".

Bottom strip: Query · Key · Value → attention is soft look-up in a learned dictionary."""),

    ("inline-part-2-post-training.png", """Diagram request: "The three-stage post-training pipeline"

Top row — 3 cards side by side, arranged as a horizontal pipeline with arrows between them:
  Card 1 · title "1. Pretraining" (slate-blue). Small stack of coloured document icons labelled "trillions of web tokens". Below: "Predict next token · self-supervised".
  Card 2 · title "2. Supervised fine-tuning" (slate-blue). A tiny prompt-response pair: "Q: capital of France? A: Paris." Below: "Human-labelled Q/A pairs".
  Card 3 · title "3. RLHF / DPO" (green). Two response boxes side by side labelled A and B with a small hand icon pointing at B. Below: "Humans pick the better answer".

Bottom card (full width) — title "What the base model can't do that a chat model can" (navy). Small comparison table: rows "Follows instructions?", "Refuses harmful requests?", "Sounds helpful?". Columns "After pretraining", "After SFT", "After RLHF". Cells filled with red ✗ or green ✓ progressively. Add a pale-green pill: "Chat models are pretrained models bolted onto human preference".

Bottom strip: Predict · Imitate · Align → what turned raw language models into assistants."""),

    ("inline-part-2-sampling.png", """Diagram request: "Sampling parameters, side by side"

Top row — 3 cards side by side. Each card shows the SAME horizontal bar chart of 8 next-token probabilities, but the sampled distribution differs.
  Card 1 · title "temperature = 0.0" (slate-blue). Bar chart with one bar highlighted green (the argmax); all others faded. Below: "Greedy · always the top token".
  Card 2 · title "temperature = 0.7" (slate-blue). Same chart but 3 top bars now highlighted (the top ones sampled from). Below: "Balanced · a bit of variety".
  Card 3 · title "temperature = 1.5" (red). Same chart but bars flatter — probability mass smeared across 7 bars. Below: "Chaotic · often incoherent".

Bottom card (full width) — title "Top-k and top-p, in one picture" (navy). Same horizontal bar chart, twice: left labelled "top-k=3" showing exactly 3 leftmost bars kept and rest greyed out; right labelled "top-p=0.9" showing bars kept until cumulative probability crosses 0.9. Add a pale-blue pill: "top-p adapts to how confident the model is; top-k doesn't".

Bottom strip: Temperature · Top-k · Top-p → three dials on the same distribution."""),

    ("inline-part-2-in-context.png", """Diagram request: "Zero-shot, one-shot, few-shot — same task"

Top row — 3 cards side by side. Each shows the SAME task ("classify sentiment") but with different prompt structures. Prompts written as monospace-style code blocks inside each card.
  Card 1 · title "Zero-shot" (slate-blue). Prompt: "Classify sentiment: 'The movie was ok.' Answer:". Below: "No examples · relies purely on pretraining".
  Card 2 · title "One-shot" (slate-blue). Prompt: "Example: 'I loved it!' → positive. Now: 'The movie was ok.' →". Below: "One example anchors format".
  Card 3 · title "Few-shot" (green). Prompt: three example lines followed by target. Below: "Format is locked in".

Bottom card (full width) — title "Accuracy vs number of shots — the diminishing returns curve" (navy). Small line chart: x-axis "shots" (0, 1, 3, 5, 10, 20); y-axis "accuracy". Curve rises steeply from 0 to 3 shots, then plateaus. Add a pale-green pill at the elbow: "3–5 shots is usually enough".

Bottom strip: Zero · One · Few → priming a frozen model is engineering, not training."""),
]


def main() -> int:
    load_env()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    from openai import OpenAI
    client = OpenAI()
    model = os.getenv("IMAGE_MODEL", "gpt-image-1")
    quality = os.getenv("IMAGE_QUALITY", "high")

    for i, (filename, content) in enumerate(JOBS, 1):
        out = OUT_DIR / filename
        if out.exists():
            print(f"[{i}/{len(JOBS)}] SKIP (exists): {out}", flush=True)
            continue
        print(f"[{i}/{len(JOBS)}] {filename} ...", flush=True)
        prompt = (
            "Use the attached image ONLY as a visual style reference — "
            "match its background colour, palette, typography, elevated "
            "rounded card style, and pill annotations. Do NOT copy its "
            "content. Instead, draw a completely new diagram whose "
            "content is described below.\n\n"
            + wrap(content)
        )
        with open(REFERENCE_IMAGE, "rb") as ref:
            result = client.images.edit(
                model=model,
                image=[ref],
                prompt=prompt,
                size="1536x1024",
                quality=quality,
                n=1,
            )
        out.write_bytes(base64.b64decode(result.data[0].b64_json))
        print(f"[{i}/{len(JOBS)}] saved: {out}", flush=True)

    print("done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
