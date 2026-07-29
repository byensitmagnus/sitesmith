#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tests for search v3. Original work, MIT. AI-generated additions: (C).
Run from skills/sitesmith/scripts/.

    python ../../../tests/gates/search_v3_test.py

Three claims are made about --candidates and each is checked here rather than asserted:

  1. The three candidates differ on concrete axes read out of the data — palette, effects,
     complexity, what they are for — and not merely on the style name.
  2. Anti-repeat holds across successive searches: recording a winner keeps that family out
     of the next search's seat.
  3. The top BM25 result is not automatically the first candidate. A ranked search returns
     rows that are near each other by construction, which is the whole problem.
"""

import json
import csv
import shutil
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve()))
sys.path.insert(0, str(Path.cwd()))

import candidates as C            # noqa: E402
from core import CSV_CONFIG, DATA_DIR, BM25, _load_csv, detect_domain   # noqa: E402

PASS, FAIL = [], []


def check(name, ok, detail=""):
    (PASS if ok else FAIL).append(name)
    print(("ok   " if ok else "FAIL ") + name + (("  — " + str(detail)) if not ok and detail else ""))


QUERY = "flat roof contractor local trades sheffield"
DOMAIN = "style"


def axes_of(row):
    """Concrete, data-derived axes. Not the style name."""
    g = lambda k: str(row.get(k, "")).strip().lower()          # noqa: E731
    return {
        "palette": g("Primary Colors"),
        "effects": g("Effects & Animation"),
        "complexity": g("Complexity"),
        "best_for": g("Best For"),
        "css": g("CSS/Technical Keywords"),
    }


def differing_axes(a, b):
    """An axis counts as different when the two values share little vocabulary."""
    n = 0
    for k in a:
        ta, tb = C._tokens(a[k]), C._tokens(b[k])
        if not ta or not tb:
            if ta != tb:
                n += 1
            continue
        overlap = len(ta & tb) / len(ta | tb)
        if overlap < 0.34:
            n += 1
    return n


# ── 1. concrete axes, not just names ──────────────────────────────────────
with tempfile.TemporaryDirectory() as tmp:
    C.HISTORY = Path(tmp) / "search-history.jsonl"
    r = C.contrasting_candidates(QUERY, DOMAIN)

check("candidates returns three", "error" not in r and len(r.get("candidates", [])) == 3,
      r.get("error"))

if "error" not in r:
    data = _load_csv(DATA_DIR / CSV_CONFIG[DOMAIN]["file"])
    by_label = {C._label(row): row for row in data}
    rows = [by_label[c["label"]] for c in r["candidates"] if c["label"] in by_label]
    check("every candidate was found back in the data", len(rows) == 3)

    if len(rows) == 3:
        pairs = [(0, 1), (0, 2), (1, 2)]
        worst = min(differing_axes(axes_of(rows[i]), axes_of(rows[j])) for i, j in pairs)
        check("every pair differs on at least three concrete axes", worst >= 3,
              f"closest pair differs on {worst}")

        names = [c["label"].lower() for c in r["candidates"]]
        shared_name_tokens = min(
            len(C._tokens(names[i]) & C._tokens(names[j])) for i, j in pairs)
        check("no two candidates are variants of the same named family",
              shared_name_tokens == 0, f"{shared_name_tokens} shared name tokens")

    check("a confidence and a reason are reported",
          r.get("confidence") in ("high", "medium", "low") and bool(r.get("confidence_because")))
    check("the separation is reported as a number", isinstance(r.get("separation"), float))

# ── 2. the top BM25 row is not automatically taken ────────────────────────
cfg = CSV_CONFIG[DOMAIN]
rows_all = _load_csv(DATA_DIR / cfg["file"])
bm = BM25()
bm.fit([" ".join(str(x.get(c, "")) for c in cfg["search_cols"]) for x in rows_all])
ranked = [(i, s) for i, s in bm.score(QUERY) if s > 0]
top3_ranked = [C._label(rows_all[i]) for i, _ in ranked[:3]]

if "error" not in r:
    chosen = [c["label"] for c in r["candidates"]]
    check("the three candidates are not the top three by score",
          chosen != top3_ranked, f"ranked {top3_ranked} vs chosen {chosen}")
    displaced = [x["label"] for x in r.get("rejected", [])]
    check("what a ranked search would have returned is reported as rejected",
          any(lbl in displaced for lbl in top3_ranked[1:]),
          f"rejected {displaced}")
    check("every rejection carries a reason",
          all(x.get("reason") for x in r.get("rejected", [])))

# ── 3. anti-repeat across successive searches ─────────────────────────────
with tempfile.TemporaryDirectory() as tmp:
    C.HISTORY = Path(tmp) / "search-history.jsonl"
    seen = []
    first = C.contrasting_candidates(QUERY, DOMAIN)
    winner = first["candidates"][0]["label"]
    seen.append(winner)
    C.record_choice(DOMAIN, winner)

    second = C.contrasting_candidates(QUERY, DOMAIN)
    check("a recorded winner does not come back as the next seat",
          second["candidates"][0]["label"] != winner,
          f"{winner} returned first again")

    # A renamed variant may only appear when the data has run out of fresh answers, never in
    # the first seat, and always marked. This query matches four rows in total, which is
    # exactly the thin-data case worth pinning down: the honest behaviour is to say so rather
    # than to invent a third direction.
    fam = C._tokens(winner)
    def same_family(label):
        lt = C._tokens(label)
        return bool(fam and lt and len(fam & lt) / min(len(fam), len(lt)) >= 0.5)

    variants = [c for c in second["candidates"] if same_family(c["label"])]
    check("a renamed variant never takes the first seat", not same_family(second["candidates"][0]["label"]),
          second["candidates"][0]["label"])
    check("a renamed variant appears only when the data is exhausted",
          not variants or second.get("pool_exhausted") is True, [c["label"] for c in variants])
    check("and when it does, it is marked as a repeat",
          all(c.get("repeat_of") for c in variants), [c["label"] for c in variants])
    check("an exhausted pool drops the confidence and says why",
          not second.get("pool_exhausted") or
          (second["confidence"] == "low" and "repeat" in second["confidence_because"]),
          second.get("confidence_because"))

    check("the repeat is reported rather than silently dropped",
          any(winner.lower() in str(x.get("reason", "")).lower() or
              winner.lower() in str(x.get("label", "")).lower()
              for x in second.get("rejected", [])),
          second.get("rejected"))

    # three rounds: the seat keeps moving
    second_winner = second["candidates"][0]["label"]
    C.record_choice(DOMAIN, second_winner)
    third = C.contrasting_candidates(QUERY, DOMAIN)
    check("a third search avoids both earlier winners",
          third["candidates"][0]["label"] not in (winner, second_winner),
          third["candidates"][0]["label"])

# ── 4. where the data is not thin, anti-repeat holds absolutely ───────────
RICH = "dashboard admin data table saas product interface"
with tempfile.TemporaryDirectory() as tmp:
    C.HISTORY = Path(tmp) / "search-history.jsonl"
    a = C.contrasting_candidates(RICH, DOMAIN)
    if "error" in a:
        check("the rich query returns candidates", False, a["error"])
    else:
        w1 = a["candidates"][0]["label"]
        C.record_choice(DOMAIN, w1)
        b = C.contrasting_candidates(RICH, DOMAIN)
        check("with enough data, no seat repeats an earlier winner",
              not b.get("pool_exhausted") and all(not c.get("repeat_of") for c in b["candidates"]),
              [(c["label"], c.get("repeat_of")) for c in b["candidates"]])
        w2 = b["candidates"][0]["label"]
        C.record_choice(DOMAIN, w2)
        c3 = C.contrasting_candidates(RICH, DOMAIN)
        check("nor after two recorded winners",
              all(x["label"] not in (w1, w2) for x in c3["candidates"]),
              [x["label"] for x in c3["candidates"]])

# ── 5. the visible dials alter candidate formation ───────────────────────
with tempfile.TemporaryDirectory() as tmp:
    original_data = C.DATA_DIR
    original_history = C.HISTORY
    C.DATA_DIR = Path(tmp)
    C.HISTORY = Path(tmp) / "history.jsonl"
    C.CSV_CONFIG["dial-test"] = {
        "file": "dial-test.csv",
        "search_cols": ["Style Category", "Keywords"],
        "output_cols": ["Style Category", "Keywords"],
    }
    rows = [
        {"Style Category": "Quiet Grid", "Keywords": "website interface restrained calm static airy"},
        {"Style Category": "Kinetic Blast", "Keywords": "website interface experimental bold kinetic motion"},
        {"Style Category": "Dense Console", "Keywords": "website interface cockpit dense compact data"},
    ]
    with (Path(tmp) / "dial-test.csv").open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)

    quiet_dials = {"visual_density": 2, "motion_intensity": 2, "aesthetic_boldness": 2}
    loud_dials = {"visual_density": 4, "motion_intensity": 9, "aesthetic_boldness": 9}
    dense_dials = {"visual_density": 9, "motion_intensity": 3, "aesthetic_boldness": 5}
    quiet = C.contrasting_candidates("website interface", "dial-test", dials=quiet_dials)
    loud = C.contrasting_candidates("website interface", "dial-test", dials=loud_dials)
    dense = C.contrasting_candidates("website interface", "dial-test", dials=dense_dials)

    check("quiet dials select the restrained candidate first",
          quiet["candidates"][0]["label"] == "Quiet Grid", quiet["candidates"][0]["label"])
    check("bold motion dials select the kinetic candidate first",
          loud["candidates"][0]["label"] == "Kinetic Blast", loud["candidates"][0]["label"])
    check("high density selects the console candidate first",
          dense["candidates"][0]["label"] == "Dense Console", dense["candidates"][0]["label"])
    check("candidate output records the exact dial contract", loud.get("dials") == loud_dials,
          loud.get("dials"))

    del C.CSV_CONFIG["dial-test"]
    C.DATA_DIR = original_data
    C.HISTORY = original_history

print(f"\n{len(PASS)} passed, {len(FAIL)} failed")
sys.exit(1 if FAIL else 0)
