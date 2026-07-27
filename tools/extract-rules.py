#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extract every rule in the reference set into one inventory. Original work, MIT.

    python tools/extract-rules.py            # summary to stdout
    python tools/extract-rules.py --json     # full inventory as JSON

The v2 synthesis has to be grounded in what the files actually say, not in what
anyone remembers them saying. This produces that ground truth: one row per rule,
with file, line, the sentence, and whether it forbids or requires something.

A "rule" here is any line that a model would read as an instruction:
  - checklist items  (- [ ] ...)
  - table rows whose first cell reads as a pattern with a verdict
  - sentences containing an imperative marker (never / always / must / no ... )
Prose that merely explains is not a rule and is deliberately excluded.
"""

from __future__ import annotations

import io
import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REFS = ROOT / "skills" / "sitesmith" / "references"
SKILL = ROOT / "skills" / "sitesmith" / "SKILL.md"

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

# Ordered: the first pattern that matches decides the rule's force.
FORBIDS = re.compile(
    r"\b(never|no longer|do not|don't|avoid|forbidden|banned?|ban\b|zero\b|"
    r"must not|cannot|not allowed|out of scope|reject)\b|(?<![\w-])\bno\s+\w",
    re.I,
)
REQUIRES = re.compile(
    r"\b(always|must|required?|non-negotiable|mandatory|shall|has to|"
    r"need to|ensure|enforce)\b",
    re.I,
)
# Lines that only describe or link, however imperative they sound.
NOISE = re.compile(r"^\s*(#{1,6}\s|>\s|\||```|https?://|- \[.*\]\(#)", re.I)

CHECKLIST = re.compile(r"^\s*-\s*\[[ x]\]\s*(.+)$")
TABLE_ROW = re.compile(r"^\|\s*([^|]{3,}?)\s*\|\s*([^|]+?)\s*\|")


def clean(text: str) -> str:
    text = re.sub(r"\*\*|`|__", "", text)
    return re.sub(r"\s+", " ", text).strip()


def force(text: str) -> str:
    # Forbids wins ties: "must never" is a prohibition, not a requirement.
    if FORBIDS.search(text):
        return "forbids"
    if REQUIRES.search(text):
        return "requires"
    return "advises"


def harvest(path: Path) -> list[dict]:
    rules: list[dict] = []
    rel = path.relative_to(ROOT).as_posix()
    in_fence = False
    for n, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if raw.lstrip().startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue

        m = CHECKLIST.match(raw)
        if m:
            rules.append({"file": rel, "line": n, "kind": "checklist",
                          "force": force(m.group(1)), "text": clean(m.group(1))})
            continue

        m = TABLE_ROW.match(raw)
        if m and not set(m.group(1)) <= set("- :"):
            joined = f"{m.group(1)} — {m.group(2)}"
            if FORBIDS.search(joined) or REQUIRES.search(joined):
                rules.append({"file": rel, "line": n, "kind": "table",
                              "force": force(joined), "text": clean(joined)})
            continue

        if NOISE.match(raw):
            continue
        for sentence in re.split(r"(?<=[.!?])\s+", raw.strip()):
            if len(sentence) < 12:
                continue
            if FORBIDS.search(sentence) or REQUIRES.search(sentence):
                rules.append({"file": rel, "line": n, "kind": "prose",
                              "force": force(sentence), "text": clean(sentence)})
    return rules


if __name__ == "__main__":
    files = [SKILL, *sorted(REFS.glob("*.md")), *sorted((REFS / "impeccable").glob("*.md"))]
    inventory: list[dict] = []
    for f in files:
        inventory.extend(harvest(f))

    if "--json" in sys.argv:
        print(json.dumps(inventory, indent=2, ensure_ascii=False))
        sys.exit(0)

    by_file = Counter(r["file"] for r in inventory)
    by_force = Counter(r["force"] for r in inventory)

    print(f"{len(inventory)} rules across {len(by_file)} files\n")
    print(f"  forbids  {by_force['forbids']:>5}")
    print(f"  requires {by_force['requires']:>5}")
    print(f"  advises  {by_force['advises']:>5}")
    print(f"\n  ratio forbids:requires = "
          f"{by_force['forbids'] / max(1, by_force['requires']):.1f} : 1\n")

    print("  by file (top 15)")
    for f, n in by_file.most_common(15):
        short = f.replace("skills/sitesmith/references/", "").replace("skills/sitesmith/", "")
        print(f"    {n:>5}  {short}")
