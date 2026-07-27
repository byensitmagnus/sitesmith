#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Repository self-check for sitesmith. Original work, MIT.

Everything here exists because it was wrong once. Run it before opening a PR:

    python tools/check-repo.py

Exit 0 clean, 1 if any check fails. Every failure prints file, line and what to do.
"""

from __future__ import annotations

import csv
import io
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "skills" / "sitesmith"
REFS = SKILL / "references"
DATA = SKILL / "data"

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

failures: list[str] = []
CHECKS: list[tuple[str, object]] = []


def fail(where: str, message: str) -> None:
    failures.append(f"{where}: {message}")


def check(name: str):
    """Register a check. They run in declaration order from __main__."""

    def wrap(fn):
        CHECKS.append((name, fn))
        return fn

    return wrap


def tracked_markdown() -> list[Path]:
    skip = {".git", "node_modules", ".sitesmith", "__pycache__"}
    return [p for p in ROOT.rglob("*.md") if not skip & set(p.relative_to(ROOT).parts)]


def csv_rows(name: str) -> int:
    with open(DATA / name, encoding="utf-8") as fh:
        return sum(1 for _ in csv.DictReader(fh))


# --------------------------------------------------------------------------- shape


@check("SKILL.md stays under 500 lines")
def _skill_length() -> None:
    n = len((SKILL / "SKILL.md").read_text(encoding="utf-8").splitlines())
    if n > 500:
        fail("skills/sitesmith/SKILL.md", f"{n} lines, cap is 500 — move material into a reference")


@check("SKILL.md reference-map line counts are accurate")
def _reference_line_counts() -> None:
    text = (SKILL / "SKILL.md").read_text(encoding="utf-8")
    for m in re.finditer(r"\[([0-9]{2}-[^\]]+\.md)\]\(references/[^)]+\)[^|]*\|[^|]*\|\s*(\d+)\s*\|", text):
        name, claimed = m.group(1), int(m.group(2))
        target = REFS / name
        if not target.exists():
            fail(f"SKILL.md -> {name}", "listed in the reference map but missing on disk")
            continue
        actual = len(target.read_text(encoding="utf-8").splitlines())
        if actual != claimed:
            fail(
                "skills/sitesmith/SKILL.md",
                f"reference map says {name} is {claimed} lines, it is {actual}",
            )


@check("every relative markdown link resolves")
def _links() -> None:
    for p in tracked_markdown():
        text = p.read_text(encoding="utf-8", errors="replace")
        for m in re.finditer(r"\[[^\]]*\]\(([^)\s]+)\)", text):
            target = m.group(1)
            if target.startswith(("http://", "https://", "mailto:", "#")):
                continue
            path = target.split("#")[0]
            if not path:
                continue
            if not (p.parent / path).resolve().exists():
                line = text[: m.start()].count("\n") + 1
                fail(f"{p.relative_to(ROOT).as_posix()}:{line}", f"dead link -> {target}")


# --------------------------------------------------------------- attribution / licence

ATTRIBUTION = re.compile(r"— (MIT|Apache License 2\.0),|Original work, MIT", re.UNICODE)


@check("every bundled reference states its licence inline")
def _attribution() -> None:
    # Case-sensitive and anchored on the real header. A bare `grep -i MIT` passes on
    # any file containing "limit" or "submit", which is how 35 files went unnoticed.
    for p in sorted(list(REFS.glob("*.md")) + list((REFS / "impeccable").glob("*.md"))):
        if not ATTRIBUTION.search(p.read_text(encoding="utf-8")):
            fail(p.relative_to(ROOT).as_posix(), "no attribution header — see NOTICE.md for the format")


@check("references over 100 lines carry a table of contents")
def _toc() -> None:
    for p in sorted(REFS.glob("*.md")):
        lines = p.read_text(encoding="utf-8").splitlines()
        if len(lines) > 100 and not any(l.strip() == "## Contents" for l in lines):
            fail(p.relative_to(ROOT).as_posix(), f"{len(lines)} lines and no '## Contents' section")


@check("LICENSE is plain MIT so GitHub can detect it")
def _license() -> None:
    text = (ROOT / "LICENSE").read_text(encoding="utf-8").strip()
    if not text.startswith("MIT License"):
        fail("LICENSE", "must start with 'MIT License'")
    if "---" in text:
        fail(
            "LICENSE",
            "trailing prose stops GitHub classifying the repo as MIT — put notes in NOTICE.md",
        )


# --------------------------------------------------------------------- data and docs


@check("plugin manifests are valid JSON with the required keys")
def _manifests() -> None:
    for rel, required in (
        (".claude-plugin/plugin.json", {"name", "version", "description", "license"}),
        (".claude-plugin/marketplace.json", {"name", "owner", "plugins"}),
    ):
        p = ROOT / rel
        try:
            obj = json.loads(p.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            fail(rel, f"invalid JSON: {e}")
            continue
        missing = required - obj.keys()
        if missing:
            fail(rel, f"missing key(s): {', '.join(sorted(missing))}")


@check("every dataset is reachable from core.py")
def _datasets_reachable() -> None:
    sys.path.insert(0, str(SKILL / "scripts"))
    from core import CSV_CONFIG, STACK_CONFIG  # noqa: E402

    wired = {c["file"] for c in CSV_CONFIG.values()} | {c["file"] for c in STACK_CONFIG.values()}
    wired |= {"ui-reasoning.csv"}  # read by design_system.py, not by core.py
    for p in sorted(DATA.rglob("*.csv")):
        rel = p.relative_to(DATA).as_posix()
        if rel not in wired:
            fail(
                f"skills/sitesmith/data/{rel}",
                "no code reads this file — wire it into core.py or drop it",
            )


@check("the counts quoted in the docs match the datasets")
def _doc_counts() -> None:
    actual = {
        "palettes": csv_rows("colors.csv"),
        "font pairings": csv_rows("typography.csv"),
        "styles": csv_rows("styles.csv"),
        "product types": csv_rows("products.csv"),
        "UX rules": csv_rows("ux-guidelines.csv"),
    }
    datasets = len(list(DATA.rglob("*.csv")))
    for rel in (
        "README.md",
        "NOTICE.md",
        "skills/sitesmith/SKILL.md",
        "skills/sitesmith/references/11-search-engine.md",
        ".claude-plugin/plugin.json",
    ):
        text = (ROOT / rel).read_text(encoding="utf-8")
        for noun, n in actual.items():
            for m in re.finditer(rf"(\d+)\+? {re.escape(noun)}", text):
                if int(m.group(1)) != n:
                    line = text[: m.start()].count("\n") + 1
                    fail(f"{rel}:{line}", f"says {m.group(0)}, actual is {n}")
        for m in re.finditer(r"(\d+) CSV (?:datasets|files)", text):
            if int(m.group(1)) != datasets:
                line = text[: m.start()].count("\n") + 1
                fail(f"{rel}:{line}", f"says {m.group(0)}, actual is {datasets}")


@check("the gallery's local links and images resolve on disk")
def _gallery_assets() -> None:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    for attr in ("href", "src"):
        for m in re.finditer(rf'{attr}="([^"]+)"', html):
            target = m.group(1)
            if target.startswith(("http://", "https://", "mailto:", "#", "data:")):
                continue
            if not (ROOT / target.split("#")[0]).exists():
                line = html[: m.start()].count("\n") + 1
                fail(f"index.html:{line}", f"{attr} points at missing {target}")


@check("every benchmark appears in the gallery with a thumbnail")
def _gallery_coverage() -> None:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    bench = ROOT / "benchmarks"
    pages = sorted(p.parent.relative_to(bench).as_posix() for p in bench.glob("*/index.html"))
    pages += sorted(p.parent.relative_to(bench).as_posix() for p in bench.glob("*/*/index.html"))
    # The block harness is generated from skills/sitesmith/blocks and is not a brief,
    # so it is verified like a benchmark but does not claim a card in the gallery.
    pages = [p for p in pages if p != "blocks"]
    for page in pages:
        if f'href="benchmarks/{page}/"' not in html:
            fail("index.html", f"benchmarks/{page} has no card in the gallery")
        thumb = ROOT / "gallery" / "thumbs" / f"{page.replace('/', '-')}.png"
        if not thumb.exists():
            fail(
                thumb.relative_to(ROOT).as_posix(),
                "missing thumbnail — run `node benchmarks/thumbs.mjs`",
            )


@check("search.py answers on every domain and every stack")
def _search_smoke() -> None:
    sys.path.insert(0, str(SKILL / "scripts"))
    from core import CSV_CONFIG, STACK_CONFIG, search, search_stack  # noqa: E402

    for domain in CSV_CONFIG:
        try:
            r = search("dashboard accessible data table", domain, 2)
        except Exception as e:  # noqa: BLE001 - a crash here is the finding
            fail(f"search.py --domain {domain}", f"{type(e).__name__}: {e}")
            continue
        if r.get("error") or not r["results"]:
            fail(f"search.py --domain {domain}", r.get("error", "returned no results"))
    for stack in STACK_CONFIG:
        try:
            r = search_stack("performance accessibility", stack, 2)
        except Exception as e:  # noqa: BLE001
            fail(f"search.py --stack {stack}", f"{type(e).__name__}: {e}")
            continue
        if r.get("error") or not r["results"]:
            fail(f"search.py --stack {stack}", r.get("error", "returned no results"))


@check("the design system generator produces a full recommendation")
def _design_system_smoke() -> None:
    sys.path.insert(0, str(SKILL / "scripts"))
    from design_system import generate_design_system  # noqa: E402

    for query in ("b2b saas incident dashboard", "roofing local service", "gaming pc ecommerce"):
        try:
            out = generate_design_system(query, "CI", "ascii")
        except Exception as e:  # noqa: BLE001
            fail(f"design_system({query!r})", f"{type(e).__name__}: {e}")
            continue
        for section in ("PATTERN", "STYLE", "COLORS", "TYPOGRAPHY"):
            if section not in out:
                fail(f"design_system({query!r})", f"output has no {section} section")


# ------------------------------------------------------------------------------ main

if __name__ == "__main__":
    print(f"sitesmith repo check — {len(CHECKS)} checks\n")
    for name, fn in CHECKS:
        before = len(failures)
        try:
            fn()
        except Exception as e:  # noqa: BLE001 - a check that crashes is a failure
            fail(name, f"check itself crashed: {type(e).__name__}: {e}")
        print(f"  {'ok  ' if len(failures) == before else 'FAIL'} {name}")
    if failures:
        print(f"\n{len(failures)} problem(s):\n")
        for f in failures:
            print(f"  {f}")
        sys.exit(1)
    print("\nall clear")
