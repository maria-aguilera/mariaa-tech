#!/usr/bin/env python3
"""One-shot batch: generate all 10 NLP-from-Scratch covers via the API.

Uses the same style_prompt.md wrapping as generate.py. Saves to
public/images/blog/nlp-api-preview/ so files don't collide with any
ChatGPT-generated version she pastes later.
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
OUT_DIR = Path("public/images/blog/nlp-api-preview")


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


# (filename, content_prompt) — one entry per NLP-from-Scratch post
JOBS: list[tuple[str, str]] = [
    ("part-1-what-nlp-is.png", """Diagram request: "What NLP is (and what it isn't)"

Top row — 3 cards side by side:
  Card 1 · title "NLP" (slate-blue). Icon of a small speech bubble.
    Below: "Making computers work with human language". Small pale-blue
    pill: "text in, text out".
  Card 2 · title "Not just chatbots" (slate-blue). Bullet list of 5
    real tasks in small text rows: "Search · Translation · Sentiment ·
    Extraction · Summarisation".
  Card 3 · title "Not magic either" (red). Three small pale-red pills
    stacked: "Wrong on ambiguity", "Biased on training data", "Confident
    when wrong".

Bottom card (full width) — title "Text goes in, structure comes out"
(navy). Left: a raw sentence "The 6:15 to Madrid is delayed by 20
minutes." → arrow → middle: a small parsed panel showing tokens with
tiny type labels below them (TIME, LOC, VERB, NUM, NOUN) → arrow →
right: a small JSON snippet with keys like `event`, `location`, `delay`.
Add a pale-green pill: "This structure is what powers every downstream
NLP task".

Bottom strip: Tokens · Structure · Meaning → NLP is the discipline of
extracting structure from unstructured text."""),

    ("part-2-from-text-to-vectors.png", """Diagram request: "From Text to Vectors"

Top row — 3 cards side by side:
  Card 1 · title "One-hot" (red). Show the word "cat" as a sparse
    vector of 10 boxes, all 0 except one box highlighted red = 1.
    Below: "Every word is orthogonal · zero similarity".
  Card 2 · title "TF-IDF" (slate-blue). Small bar chart with 4 words:
    "the" (short), "is" (short), "cat" (medium), "purrs" (tallest).
    Below: "Rare words weigh more".
  Card 3 · title "Word2Vec / GloVe" (green). Show a 2-D scatter plot
    with 4 word dots: "king" and "queen" close together, "man" and
    "woman" close together, dashed arrow from "king" → "queen" parallel
    to arrow from "man" → "woman". Below: "Meaning is a direction".

Bottom card (full width) — title "The same sentence, three
representations" (navy). Left: the sentence "The cat sat on the mat" →
arrow → three small stacked vectors labelled "one-hot", "tf-idf",
"embedding". Under each vector: dimension count (|V|, |V|, 300).
Add a pale-blue pill: "Higher-dim ≠ more expressive · direction matters".

Bottom strip: Sparse · Weighted · Dense → we moved from counting
words to modelling meaning as geometry."""),

    ("part-3-tagging-parsing.png", """Diagram request: "Tagging & Parsing"

Top row — 3 cards side by side:
  Card 1 · title "Tokenisation" (slate-blue). Show the sentence "I'm
    running." split into token boxes: "I", "'m", "running", "."
    Below: "One string → many tokens".
  Card 2 · title "POS tagging" (slate-blue). Show 4 token boxes:
    "The" (DET), "cat" (NOUN), "sat" (VERB), "quietly" (ADV) — each
    with a small tag label below.
  Card 3 · title "Dependency parse" (green). Show a small tree with
    "sat" as the root at the top; arrows down to "cat" (nsubj), "on"
    (prep). Under "on" an arrow to "mat" (pobj).

Bottom card (full width) — title "One sentence, three layers" (navy).
The sentence "The cat sat on the mat" written once at the top. Below
it, three horizontal bands: (1) token boundaries with vertical dashed
lines, (2) POS tags in small pale-blue pills above each token, (3) a
tiny dependency arc drawn from "sat" curving to "cat" and to "on". Add
a pale-green pill: "This structure is what classical NLP builds on top
of".

Bottom strip: Tokenise · Tag · Parse → syntax is the scaffolding
that lets meaning make sense."""),

    ("part-4-semantics.png", """Diagram request: "Semantics & Word Embeddings"

Top row — 3 cards side by side:
  Card 1 · title "Distributional hypothesis" (slate-blue). Small text
    quote in italic: '"You shall know a word by the company it keeps."'
    Below: "— Firth, 1957".
  Card 2 · title "Word2Vec skip-gram" (slate-blue). Show the target
    word "bank" in the centre in a small square, arrows to 4 context
    words around it: "river", "money", "sat", "sleep".
  Card 3 · title "Vector arithmetic" (green).
    Show an equation in clean sans-serif: "king − man + woman ≈ queen".
    Below: "Meaning is compositional".

Bottom card (full width) — title "A 2-D projection of a real embedding
space" (navy). Small scatter plot with 8 word dots grouped visually:
"Paris", "Madrid", "Berlin", "Tokyo" in a cluster labelled "capitals";
"France", "Spain", "Germany", "Japan" in a cluster labelled
"countries". Dashed arrows from each country to its capital showing the
arrows are all roughly parallel. Add a pale-blue pill: "The direction
capital-of is the same everywhere in space".

Bottom strip: Context · Vector · Direction → embeddings turned words
into geometry, and geometry into meaning."""),

    ("part-5-language-modeling.png", """Diagram request: "Language Modeling"

Top row — 3 cards side by side:
  Card 1 · title "n-gram" (red). Show the sentence prefix "The cat sat
    on the" → arrow → small bar chart of next-word probabilities:
    "mat" 0.5, "chair" 0.2, "floor" 0.15, "..." Below: "Only sees last
    n-1 words".
  Card 2 · title "RNN / LSTM" (slate-blue). Show a chain of 4 small
    unrolled cells left-to-right, each with an arrow up labelled
    "hidden state". Below: "Sees the full past, forgets slowly".
  Card 3 · title "Transformer" (green). Show 4 tokens along the top,
    all connected to each other with thin dashed lines (attention
    weights). Below: "Sees the full past, in parallel".

Bottom card (full width) — title "What all language models actually
do" (navy). Left to right: prefix → model box → probability
distribution over the whole vocab → sampled next token. Repeat this
box marked with a small dashed loop back to the prefix. Add a
pale-blue pill: "Every word you've ever read from an LLM is one
sample from p(word | previous words)".

Bottom strip: Count · Recur · Attend → three eras of the same job:
predict the next token."""),

    ("part-6-text-classification-classical.png", """Diagram request: "Text Classification — Classical"

Top row — 3 cards side by side:
  Card 1 · title "Naive Bayes" (slate-blue). Small formula box:
    "P(spam | words) ∝ P(spam) · ∏ P(word_i | spam)". Below: "Fast,
    strong baseline, assumes independence".
  Card 2 · title "Logistic Regression" (slate-blue). Small 2-D scatter
    plot: two classes of dots (× and ○) separated by a straight
    decision boundary line. Below: "Linear on top of TF-IDF features".
  Card 3 · title "Linear SVM" (green). Same 2-D scatter as card 2 but
    with a wider "margin" band around the boundary line, drawn as two
    thin parallel lines. Below: "Maximise the gap between classes".

Bottom card (full width) — title "The full pipeline" (navy). Left to
right: raw text ("Free money now!!") → tokeniser box → TF-IDF vector
(shown as a horizontal bar of 6 weighted rectangles) → classifier box
→ label output (spam) highlighted in a small red pill. Add a
pale-blue pill on the classifier step: "The model doesn't read — it
weights numbers".

Bottom strip: Vectorise · Classify · Explain → classical NLP still
wins when your data is small and your labels are clear."""),

    ("part-7-text-classification-dl.png", """Diagram request: "Text Classification — Deep Learning"

Top row — 3 cards side by side:
  Card 1 · title "CNN" (slate-blue). Show a 1-D sequence of tokens
    with a small sliding "filter" window highlighted over 3 adjacent
    tokens; an arrow up to a "feature map" row. Below: "Local n-gram
    patterns".
  Card 2 · title "BiLSTM" (slate-blue). Show 5 token boxes with two
    arrows above them running left-to-right AND right-to-left. Below:
    "Full context in both directions".
  Card 3 · title "Fine-tuned Transformer" (green). Show the label
    "BERT / encoder" as a small block, with 5 token embeddings
    entering from below and a single "[CLS]" output arrow going up to
    a tiny classification head. Below: "Pretrained knowledge, fine-tuned
    task".

Bottom card (full width) — title "The one-line comparison" (navy).
Small table with 3 rows and 3 columns. Rows: CNN / BiLSTM /
Transformer. Columns: "context window", "params", "when to use". Fill
in short values. Add a pale-green pill on the Transformer row: "This is
what everyone uses in 2026 unless the dataset is tiny".

Bottom strip: Local · Sequential · Global → deep learning replaced
hand-crafted features with learned ones — at every scale."""),

    ("part-8-information-retrieval.png", """Diagram request: "Information Retrieval"

Top row — 3 cards side by side:
  Card 1 · title "BM25 (lexical)" (slate-blue). Show a query "cat food"
    → arrow → an inverted-index row showing "cat" and "food" each
    pointing to a small list of doc-IDs. Below: "Exact-word match with
    TF-IDF weighting".
  Card 2 · title "Dense / vector" (green). Show a query embedding as a
    small vector dot in a 2-D space; 3 nearest document dots around it
    circled by a dashed "top-k" circle. Below: "Semantic similarity via
    cosine".
  Card 3 · title "Hybrid" (green). Show two arrows converging into a
    "merge" box: one arrow labelled "BM25 top-100", the other "dense
    top-100". Output: single ranked list. Below: "Best of both worlds".

Bottom card (full width) — title "A modern search box, decomposed"
(navy). Left to right: user query → embedding model → vector DB (small
flat cylinder) → top-k candidates → reranker box → final ranked list.
Under the reranker: a small pale-blue pill: "Cross-encoder — slow but
precise". Under the vector DB: a small pale-red pill: "Recall bottleneck
lives here".

Bottom strip: Match · Embed · Rerank → search is a two-stage race
between recall and precision."""),

    ("part-9-question-answering.png", """Diagram request: "Question Answering"

Top row — 3 cards side by side:
  Card 1 · title "Extractive QA" (slate-blue). Show a paragraph of
    text with 4 words highlighted in a light-slate outline, marked as
    the answer span. Below: "Answer = span from the source".
  Card 2 · title "Generative QA" (slate-blue). Show a small LLM box
    with question entering and answer text flowing out as free-form
    prose. Below: "Answer = written from memory".
  Card 3 · title "Retrieval-augmented QA" (green). Show a small stack:
    question → retriever box → 3 doc snippets → LLM box → answer.
    Below: "Answer = written, grounded in retrieved docs".

Bottom card (full width) — title "One question, three ways to answer
it" (navy). Question at the top: "When was the last Champions League
final?" Below, three rows showing each approach's answer:
  - Extractive: highlighted span from a Wikipedia paragraph
  - Generative: LLM's free response ("The 2024 final was in London on
    June 1")
  - RAG: LLM response with a small pale-blue pill footnote: "Source:
    UEFA docs"
Add a pale-red pill on the Generative row: "Confident hallucinations
happen here".

Bottom strip: Extract · Generate · Ground → RAG is the answer to
"how do I stop the LLM from making things up"."""),

    ("part-10-transformers.png", """Diagram request: "Transformers & the Modern Stack"

Top row — 3 cards side by side:
  Card 1 · title "Encoder-only" (slate-blue). Small stack of 3
    attention blocks with tokens entering below and a "[CLS]" arrow
    exiting up. Below: "BERT · classification, retrieval, NER".
  Card 2 · title "Decoder-only" (slate-blue). Small stack of 3
    causal-attention blocks; a token sequence entering with a mask
    triangle showing tokens can only see the past; arrow out shows
    "next token". Below: "GPT · generation, chat, agents".
  Card 3 · title "Encoder-decoder" (green). Two side-by-side stacks:
    encoder on left → cross-attention arrow → decoder on right → output
    tokens. Below: "T5 / BART · translation, summarisation".

Bottom card (full width) — title "One architecture, three families"
(navy). Timeline arrow from left (2017) to right (2026) with markers:
"Attention is all you need" (2017), "BERT" (2018), "GPT-2" (2019),
"T5" (2020), "GPT-4" (2023), "Modern LLMs" (2026). Above the timeline,
a small pale-blue pill: "Every model since is a variation on the same
1200-line paper".

Bottom strip: Encoder · Decoder · Both → the transformer isn't one
model, it's the substrate every modern NLP model runs on."""),
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
            print(f"[{i}/{len(JOBS)}] SKIP (exists): {out}")
            continue
        print(f"[{i}/{len(JOBS)}] {filename} ...", flush=True)
        # images.edit with the wealth-vs-happiness reference image so
        # gpt-image-1 SEES the target style, not just reads about it.
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
