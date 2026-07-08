#!/usr/bin/env python3
"""Ideogram V3 image generation with style_reference support.

Loads IDEOGRAM_API_KEY from the sibling cheatsheet-mcp/.env, uses the
wealth-vs-happiness.png reference image (Ideogram supports up to 4
style_reference_images that anchor palette + composition), and saves
the PNG to --out.

Usage:
    python .claude/skills/diagram-prompt/generate-ideogram.py \\
        --out public/images/blog/genai/inline/TEST-ideogram-cot.png \\
        --content-file /tmp/prompt.txt
"""

from __future__ import annotations
import argparse
import os
import sys
from pathlib import Path

import re

SIBLING = Path("/Users/maguilera/Projects/Cheat sheets and posts generations/cheatsheet-mcp")
ENV_PATH = SIBLING / ".env"
STYLE_PATH = SIBLING / "references" / "style_prompt.md"
REFERENCE_IMAGE = SIBLING / "references" / "wealth-vs-happiness.png"


def wrap_with_style(content: str) -> str:
    md = STYLE_PATH.read_text()
    m = re.search(r"```\s*\n(.*?)\n```", md, re.DOTALL)
    template = m.group(1).strip()
    placeholder = re.compile(r"\[REPLACE THIS BLOCK[^\]]*\]", re.IGNORECASE | re.DOTALL)
    return placeholder.sub(content.strip(), template)


def load_env() -> None:
    for raw in ENV_PATH.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--out", required=True, type=Path)
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--content", help="The concept-only prompt.")
    src.add_argument("--content-file", type=Path)
    ap.add_argument("--aspect-ratio", default="16x10",
                    help="Ideogram aspect ratio (1x1, 16x10, 16x9, 3x2, ...)")
    ap.add_argument("--rendering-speed", default="QUALITY",
                    choices=["TURBO", "DEFAULT", "QUALITY"])
    ap.add_argument("--style-type", default="DESIGN",
                    choices=["AUTO", "GENERAL", "REALISTIC", "DESIGN", "RENDER_3D", "ANIME"])
    ap.add_argument("--use-reference", action="store_true",
                    help="Attach wealth-vs-happiness.png as style_reference. "
                         "Requires --style-type AUTO or GENERAL. When absent, "
                         "the content prompt is wrapped with the full style_prompt.md block.")
    args = ap.parse_args()

    load_env()
    api_key = os.environ.get("IDEOGRAM_API_KEY")
    if not api_key:
        sys.exit("error: IDEOGRAM_API_KEY not found in sibling .env")

    content = args.content_file.read_text() if args.content_file else args.content
    if not content.strip():
        sys.exit("error: empty content prompt")

    import httpx

    url = "https://api.ideogram.ai/v1/ideogram-v3/generate"

    if args.use_reference:
        # style_reference forces style_type to AUTO/GENERAL — keep content lean.
        final_prompt = content.strip()
        files = {
            "style_reference_images": (
                "wealth-vs-happiness.png",
                REFERENCE_IMAGE.read_bytes(),
                "image/png",
            ),
        }
    else:
        # No reference image; bake the full style block into the text.
        final_prompt = wrap_with_style(content)
        files = None

    data = {
        "prompt": final_prompt,
        "rendering_speed": args.rendering_speed,
        "style_type": args.style_type,
        "aspect_ratio": args.aspect_ratio,
        "magic_prompt": "OFF",
        "num_images": "1",
    }

    print(f"Generating via Ideogram V3 ({args.rendering_speed}, {args.style_type}, "
          f"{args.aspect_ratio}, reference={args.use_reference})...", file=sys.stderr)
    with httpx.Client(timeout=120.0) as client:
        if files is not None:
            r = client.post(url, headers={"Api-Key": api_key}, files=files, data=data)
        else:
            # No file upload: use JSON body (Ideogram rejects form-urlencoded).
            headers = {"Api-Key": api_key, "Content-Type": "application/json"}
            data["num_images"] = int(data["num_images"])
            r = client.post(url, headers=headers, json=data)
        if r.status_code != 200:
            sys.exit(f"Ideogram API {r.status_code}: {r.text[:500]}")
        payload = r.json()

    if not payload.get("data"):
        sys.exit(f"Unexpected response shape: {payload}")

    image_url = payload["data"][0]["url"]
    print(f"Image URL received; downloading...", file=sys.stderr)

    with httpx.Client(timeout=60.0) as client:
        img_r = client.get(image_url)
        if img_r.status_code != 200:
            sys.exit(f"Failed to download image: {img_r.status_code}")

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_bytes(img_r.content)
    print(f"Saved: {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
