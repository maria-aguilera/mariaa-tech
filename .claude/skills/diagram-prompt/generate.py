#!/usr/bin/env python3
"""
Generate a mariaa.tech blog cover PNG via OpenAI gpt-image-1.

Wraps a concept-only content description in the style_prompt.md template
that lives in the sibling `cheatsheet-mcp/` repo (single source of truth
for Maria's visual style), then calls the OpenAI Images API and saves
the PNG to --out.

Uses the OPENAI_API_KEY + IMAGE_MODEL + IMAGE_QUALITY vars from
cheatsheet-mcp/.env, so no key lives in this repo.

Usage:
    python .claude/skills/diagram-prompt/generate.py \\
        --out public/images/blog/genai/part-7-guardrails-security.png \\
        --content "Diagram request: ... (the content-only prompt)"

    # or pass the content prompt via a file
    python .claude/skills/diagram-prompt/generate.py \\
        --out public/images/blog/genai/part-7-guardrails-security.png \\
        --content-file /tmp/part-7-prompt.txt
"""

from __future__ import annotations
import argparse
import base64
import os
import re
import sys
from pathlib import Path

SIBLING = Path("/Users/maguilera/Projects/Cheat sheets and posts generations/cheatsheet-mcp")
ENV_PATH = SIBLING / ".env"
# Local style prompt — mirrors Maria's ChatGPT project system prompt exactly.
# If she updates that in ChatGPT, update .claude/skills/diagram-prompt/style_prompt.md to match.
STYLE_PATH = Path(__file__).parent / "style_prompt.md"


def load_env() -> None:
    if not ENV_PATH.exists():
        sys.exit(f"error: sibling .env not found at {ENV_PATH}")
    for raw in ENV_PATH.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def build_prompt(content: str) -> str:
    md = STYLE_PATH.read_text()
    m = re.search(r"```\s*\n(.*?)\n```", md, re.DOTALL)
    if not m:
        sys.exit(f"error: no fenced code block in {STYLE_PATH}")
    template = m.group(1).strip()
    placeholder = re.compile(r"\[REPLACE THIS BLOCK[^\]]*\]", re.IGNORECASE | re.DOTALL)
    if not placeholder.search(template):
        sys.exit("error: style prompt template missing [REPLACE THIS BLOCK ...] placeholder")
    return placeholder.sub(content.strip(), template)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--out", required=True, type=Path, help="Path to write the PNG.")
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--content", help="The concept-only prompt (from the diagram-prompt skill).")
    src.add_argument("--content-file", type=Path, help="Read the concept-only prompt from a file.")
    ap.add_argument("--size", default="1536x1024",
                    help="Image size. gpt-image-1 accepts 1024x1024, 1024x1536, 1536x1024, auto.")
    ap.add_argument("--quality", default=None,
                    help="Image quality (low/medium/high/auto). Defaults to IMAGE_QUALITY env or 'high'.")
    ap.add_argument("--dry-run", action="store_true",
                    help="Print the full assembled prompt but do not call the API.")
    args = ap.parse_args()

    load_env()

    content = args.content_file.read_text() if args.content_file else args.content
    if not content or not content.strip():
        sys.exit("error: empty content prompt")

    prompt = build_prompt(content)

    if args.dry_run:
        print(prompt)
        return 0

    try:
        from openai import OpenAI
    except ImportError:
        sys.exit("error: openai package missing. Run this via the sibling venv:\n"
                 f"  {SIBLING}/.venv/bin/python {sys.argv[0]} ...")

    client = OpenAI()
    model = os.getenv("IMAGE_MODEL", "gpt-image-1")
    quality = args.quality or os.getenv("IMAGE_QUALITY", "high")

    print(f"Generating {args.size} {quality}-quality image via {model}...", file=sys.stderr)
    result = client.images.generate(
        model=model,
        prompt=prompt,
        size=args.size,
        quality=quality,
        n=1,
    )

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_bytes(base64.b64decode(result.data[0].b64_json))
    print(f"Saved: {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
