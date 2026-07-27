#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Group the rule inventory by subject so contradictions surface. Original work, MIT.

    python tools/find-conflicts.py                 # topics that carry both forces
    python tools/find-conflicts.py radius cursor   # dump every rule on those topics

The machine finds candidates; a human adjudicates. A topic is flagged when the
same subject carries both a prohibition and a requirement, or when two files
disagree about it — that is where the agent has to guess, and guessing is what
produces timid output.
"""

from __future__ import annotations

import io
import re
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

# The subjects worth adjudicating. Each is a decision the agent has to make on
# every build, so a split verdict costs something every time.
TOPICS: dict[str, str] = {
    "radius": r"\bradius|rounded|corner",
    "accent colour": r"\baccent\b|one colou?r|single colou?r",
    "dark mode": r"\bdark mode|colou?r scheme|prefers-color-scheme",
    "images": r"\bimage|photo|picsum|stock|screenshot|asset\b",
    "fabricated content": r"\bfabricat|invent|made-up|placeholder|lorem|fake|real content|real data",
    "typography": r"\bfont|typeface|serif|Inter\b|self-host",
    "em-dash": r"em-dash|—|&mdash;",
    "cursor": r"\bcursor",
    "icons": r"\bicon",
    "cards": r"\bcard\b|cards\b",
    "motion": r"\banimat|motion|scroll|transition",
    "scope": r"dashboard|admin|product UI|wizard|multi-step|data table",
    "eyebrow": r"eyebrow|uppercase tracking",
    "gradient": r"gradient|orb|mesh|glassmorph",
}


def inventory() -> list[dict]:
    import json

    out = subprocess.run(
        [sys.executable, str(ROOT / "extract-rules.py"), "--json"],
        capture_output=True, text=True, encoding="utf-8", check=True,
    )
    return json.loads(out.stdout)


def short(path: str) -> str:
    return path.replace("skills/sitesmith/references/", "").replace("skills/sitesmith/", "")


if __name__ == "__main__":
    rules = inventory()
    wanted = [a.lower() for a in sys.argv[1:] if not a.startswith("-")]

    grouped: dict[str, list[dict]] = defaultdict(list)
    for topic, pattern in TOPICS.items():
        rx = re.compile(pattern, re.I)
        for r in rules:
            if rx.search(r["text"]):
                grouped[topic].append(r)

    if wanted:
        for topic in wanted:
            match = next((t for t in TOPICS if t.startswith(topic)), None)
            if not match:
                print(f"unknown topic: {topic}. known: {', '.join(TOPICS)}")
                continue
            print(f"\n=== {match} ({len(grouped[match])} rules) ===")
            for r in sorted(grouped[match], key=lambda x: (x["force"], x["file"])):
                print(f"  [{r['force']:<8}] {short(r['file'])}:{r['line']}")
                print(f"             {r['text'][:150]}")
        sys.exit(0)

    print("topic                 forbids  requires  files  candidate?")
    print("-" * 64)
    for topic in TOPICS:
        rs = grouped[topic]
        f = sum(1 for r in rs if r["force"] == "forbids")
        q = sum(1 for r in rs if r["force"] == "requires")
        files = len({r["file"] for r in rs})
        split = "read it" if f and q and files > 1 else ""
        print(f"{topic:<21} {f:>7}  {q:>8}  {files:>5}  {split}")
    print(
        "\nA candidate is not a contradiction. This classifies by verb, so a contrast\n"
        "threshold reads as advice and a logo rule reads as a requirement, and a subject\n"
        "lands here without anything actually disagreeing. Of the thirteen flagged on\n"
        "2026-07-27, seven were real. Read the rules before believing the column:\n"
        "  python tools/find-conflicts.py radius scope\n"
        "Adjudications, with reasons: docs/v2/DECISIONS.md"
    )
