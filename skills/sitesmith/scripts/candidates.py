#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Three contrasting candidates, not the top three. Original work, MIT.

    python scripts/search.py "<query>" --candidates
    python scripts/search.py "<query>" --candidates --domain style --project "Ridgeway"

The problem this solves is measurable in the legacy set. A ranked search returns the rows
that best match the query, and the rows that best match a query are, by construction, near
each other — so the top three are three descriptions of the same idea, and the first one is
taken. Nine subjects went through this and came out with one off-white ground, one system
font stack and one palette recipe.

This selects for *contrast* instead: the strongest match, then the two rows furthest from it
and from each other, so the three on the table are genuinely different starting points. Each
carries a confidence, the near-misses it displaced, and what it is deliberately not.

No new dependencies. Distance is Jaccard over content tokens, which is crude and is enough
to tell "minimal, whitespace, restrained" from "brutalist, raw, hard edges".
"""

import json
import re
from pathlib import Path

from core import CSV_CONFIG, DATA_DIR, BM25, _load_csv, detect_domain

HISTORY = Path(".sitesmith") / "search-history.jsonl"
STOP = {
    "the", "a", "an", "and", "or", "for", "with", "of", "to", "in", "on", "is", "are", "be",
    "this", "that", "it", "as", "by", "at", "from", "use", "used", "using", "design", "style",
    "ui", "ux", "web", "site", "page", "app", "modern", "clean", "good", "best",
}


def _tokens(text):
    return {t for t in re.findall(r"[a-z0-9]+", str(text).lower()) if len(t) > 2 and t not in STOP}


def _jaccard(a, b):
    if not a or not b:
        return 1.0
    return 1.0 - len(a & b) / len(a | b)


def _distance(a, b, label_a="", label_b=""):
    """1.0 = nothing in common, 0.0 = the same idea.

    Vocabulary distance alone is too generous here. Rows carry a lot of unique boilerplate —
    framework scores, checklists, CSS notes — so "Flat Design" and "Flat Design Mobile" came
    out 0.86 apart while plainly being one idea. The name is the strongest signal that two
    rows are variants of each other, so a shared name caps the distance regardless.
    """
    d = _jaccard(a, b)
    la, lb = _tokens(label_a), _tokens(label_b)
    if la and lb:
        overlap = len(la & lb) / min(len(la), len(lb))
        if overlap >= 0.5:
            d = min(d, 0.2)          # same family, different trim
        elif overlap > 0:
            d = min(d, 0.65)         # related enough to notice
    return d


def _label(row):
    for key in ("Style Category", "Product Type", "Pattern Name", "Font Pairing Name",
                "Family", "Data Type", "Category", "Issue"):
        if row.get(key):
            return str(row[key])
    return next((str(v) for v in row.values() if v), "unnamed")


def _read_history():
    if not HISTORY.exists():
        return []
    out = []
    for line in HISTORY.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line:
            try:
                out.append(json.loads(line))
            except json.JSONDecodeError:
                pass
    return out


def record_choice(domain, label, project=None):
    """Called after a direction is chosen, so the next search knows what was used."""
    HISTORY.parent.mkdir(parents=True, exist_ok=True)
    with HISTORY.open("a", encoding="utf-8") as f:
        f.write(json.dumps({"domain": domain, "label": label, "project": project}) + "\n")


def contrasting_candidates(query, domain=None, pool=25, k=3, project=None):
    """Return k candidates chosen for mutual contrast, with the reasoning kept."""
    domain = domain or detect_domain(query)
    config = CSV_CONFIG.get(domain, CSV_CONFIG["style"])
    path = DATA_DIR / config["file"]
    if not path.exists():
        return {"error": f"no data file for domain {domain}"}

    data = _load_csv(path)
    documents = [" ".join(str(row.get(c, "")) for c in config["search_cols"]) for row in data]

    bm25 = BM25()
    bm25.fit(documents)
    ranked = [(i, s) for i, s in bm25.score(query) if s > 0][:pool]
    if not ranked:
        # A dead end here stalls the direction lab, so say where the query would land.
        elsewhere = []
        for other, cfg in CSV_CONFIG.items():
            if other == domain:
                continue
            p = DATA_DIR / cfg["file"]
            if not p.exists():
                continue
            rows = _load_csv(p)
            b = BM25()
            b.fit([" ".join(str(r.get(c, "")) for c in cfg["search_cols"]) for r in rows])
            if any(s > 0 for _, s in b.score(query)[:1]):
                elsewhere.append(other)
        hint = (f" Try --domain {', --domain '.join(elsewhere)}." if elsewhere else
                " No domain matches it — the vocabulary is the subject's, not the data's, "
                "which is a finding for EVIDENCE.md rather than a search to retry.")
        return {"error": f"nothing in {config['file']} matched '{query}'.{hint}"}

    top_score = ranked[0][1]
    history = {h["label"] for h in _read_history() if h.get("domain") == domain}

    # The descriptive columns, not the whole row. Framework scores, checklists and CSS notes
    # are boilerplate that differs between any two rows and drowns out the actual idea.
    desc_cols = list(dict.fromkeys(config["search_cols"] +
                     [c for c in config["output_cols"] if c in
                      ("Keywords", "Best For", "Type", "Category", "Mood/Style Keywords",
                       "Primary Colors", "Section Order", "Color Strategy")]))
    toks = {i: _tokens(" ".join(str(data[i].get(c, "")) for c in desc_cols)) for i, _ in ranked}
    lbl = {i: _label(data[i]) for i, _ in ranked}
    norm = {i: s / top_score for i, s in ranked}

    chosen, rejected = [], []

    # Seed with the strongest match that is not a repeat. "Not a repeat" has to mean the
    # family and not the exact string, or recording "Flat Design" simply promotes
    # "Flat Design Mobile" — the same idea with a different name on it.
    def _repeats_history(label):
        lt = _tokens(label)
        for h in history:
            ht = _tokens(h)
            if not lt or not ht:
                continue
            if label == h or len(lt & ht) / min(len(lt), len(ht)) >= 0.5:
                return h
        return None

    # A family repeat is excluded rather than merely penalised: penalising kept the first
    # seat clear but still let a renamed variant take second or third, and recording
    # "Flat Design" only to be handed "Flat Design Mobile" is not anti-repeat.
    #
    # Where the data genuinely has too few fresh rows — some queries match four rows in
    # total — the honest answer is to fill the remaining seats with repeats and say so,
    # not to invent a third direction. The first seat is never a repeat while any fresh
    # row exists, because that is the one the lab is most likely to build from.
    fresh = [i for i, _ in ranked if not _repeats_history(lbl[i])]
    stale = [i for i, _ in ranked if _repeats_history(lbl[i])]
    exhausted = len(fresh) < k
    candidate_pool = fresh + (stale if exhausted else [])

    seed = candidate_pool[0] if candidate_pool else ranked[0][0]
    if seed != ranked[0][0]:
        for i, _ in ranked:
            if i == seed:
                break
            prev = _repeats_history(lbl[i])
            if prev:
                rejected.append({
                    "label": lbl[i],
                    "reason": f"scored {norm[i]:.2f}, but repeats “{prev}” from an earlier "
                              f"direction in this project",
                })
    chosen.append({"idx": seed, "why": "strongest match for the query", "score": norm[seed],
                   "repeat_of": _repeats_history(lbl[seed])})

    # Then repeatedly take the row that is furthest from everything already chosen, with
    # relevance as a tiebreak. Distance dominates on purpose: the point is not to find the
    # second-best answer, it is to find a different one.
    while len(chosen) < k:
        best, best_val = None, -1.0
        for i in candidate_pool:
            if any(c["idx"] == i for c in chosen):
                continue
            far = min(_distance(toks[i], toks[c["idx"]], lbl[i], lbl[c["idx"]]) for c in chosen)
            penalty = 0.30 if _repeats_history(lbl[i]) else 0.0
            value = 0.75 * far + 0.25 * norm[i] - penalty
            if value > best_val:
                best, best_val, best_far = i, value, far
        if best is None:
            break
        prev = _repeats_history(lbl[best])
        chosen.append({
            "idx": best,
            "why": (f"furthest from the others already chosen ({best_far:.2f} apart)" +
                    (f" — and a repeat of “{prev}”, taken only because the data has no third "
                     f"fresh answer for this query" if prev else "")),
            "score": norm[best],
            "distance": best_far,
            "repeat_of": prev,
        })

    # Anything excluded for repeating an earlier winner, said out loud rather than silently
    # dropped, so the reader can see what the anti-repeat rule cost them.
    for i, _ in ranked:
        if any(c["idx"] == i for c in chosen) or not _repeats_history(lbl[i]):
            continue
        if any(x["label"] == lbl[i] for x in rejected):
            continue
        rejected.append({
            "label": lbl[i],
            "reason": f"scored {norm[i]:.2f}, but repeats “{_repeats_history(lbl[i])}” from an "
                      f"earlier direction in this project",
        })
        if len(rejected) >= 6:
            break

    # Everything that scored well and was dropped for being too close to a chosen row. This
    # is the honest part: it says what the search would have handed over by default.
    for i, _ in ranked:
        if any(c["idx"] == i for c in chosen) or norm[i] < 0.55:
            continue
        near = min(((_distance(toks[i], toks[c["idx"]], lbl[i], lbl[c["idx"]]), lbl[c["idx"]]) for c in chosen))
        if near[0] < 0.45:
            shared = sorted(toks[i] & toks[next(c["idx"] for c in chosen if _label(data[c["idx"]]) == near[1])])[:6]
            rejected.append({
                "label": _label(data[i]),
                "reason": f"scored {norm[i]:.2f} but sits {near[0]:.2f} from “{near[1]}” — "
                          f"shares {', '.join(shared) if shared else 'its whole vocabulary'}",
            })
        if len(rejected) >= 6:
            break

    separation = min(
        (_distance(toks[a["idx"]], toks[b["idx"]], lbl[a["idx"]], lbl[b["idx"]])
         for n, a in enumerate(chosen) for b in chosen[n + 1:]),
        default=0.0,
    )
    if exhausted:
        confidence, because = "low", ("every strong match repeats an earlier direction in this "
                                      "project, so these are repeats and are marked as such")
    elif top_score >= 2.0 and separation >= 0.6:
        confidence, because = "high", "the query matched strongly and the three are far apart"
    elif separation < 0.4:
        confidence, because = "low", ("the data has no genuinely different answers for this query — "
                                      "treat all three as one direction and find the other two elsewhere")
    elif top_score < 1.0:
        confidence, because = "low", "nothing matched the query strongly; these are weak signals"
    else:
        confidence, because = "medium", "a usable spread, but one of the three is a stretch"

    return {
        "domain": domain,
        "query": query,
        "file": config["file"],
        "confidence": confidence,
        "confidence_because": because,
        "separation": round(separation, 2),
        "repeats": sorted({lbl[c["idx"]] for c in chosen if _repeats_history(lbl[c["idx"]])}),
        "pool_exhausted": exhausted,
        "candidates": [{
            "label": _label(data[c["idx"]]),
            "why": c["why"],
            "relevance": round(c["score"], 2),
            "repeat_of": c.get("repeat_of"),
            "row": {k2: v for k2, v in data[c["idx"]].items()
                    if k2 in config["output_cols"] and str(v).strip()},
        } for c in chosen],
        "rejected": rejected,
        "project": project,
    }


def format_candidates(r):
    if "error" in r:
        return f"Error: {r['error']}"

    out = [
        "## Three contrasting candidates",
        f"**Query:** {r['query']}  |  **Source:** {r['file']}",
        f"**Confidence:** {r['confidence']} — {r['confidence_because']}",
        f"**Separation:** {r['separation']} (0 = identical vocabulary, 1 = nothing in common)",
        "",
    ]
    if r["repeats"]:
        out += [f"> **Repeat warning:** {', '.join(r['repeats'])} has been used before on this "
                f"project. Using it again is allowed; say in DIRECTION.md that it is a repeat.", ""]

    for n, c in enumerate(r["candidates"], 1):
        out.append(f"### {n}. {c['label']}")
        out.append(f"*{c['why']} · relevance {c['relevance']}*")
        for k, v in c["row"].items():
            s = str(v)
            out.append(f"- **{k}:** {s[:240] + '…' if len(s) > 240 else s}")
        out.append("")

    if r["rejected"]:
        out.append("### Deliberately not chosen")
        out.append("These scored well and were dropped for being too close to something above. "
                   "A ranked search would have returned them as the top three.")
        for x in r["rejected"]:
            out.append(f"- **{x['label']}** — {x['reason']}")
        out.append("")

    out += [
        "### What to do with these",
        "One candidate per comp in the direction lab. They are starting points, not answers: "
        "each still has to be argued from the evidence pack, and a candidate that cannot be "
        "argued for this subject is the wrong one however well it scored.",
        "",
        "Record the winner so the next search knows:",
        "",
        "```bash",
        f"python scripts/search.py --record \"<the one you chose>\" --domain {r['domain']}",
        "```",
    ]
    return "\n".join(out)
