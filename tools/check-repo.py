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
import hashlib
import io
import json
import re
import sys
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "skills" / "sitesmith"
REFS = SKILL / "references"
TASKS = SKILL / "v2" / "tasks"
DATA = SKILL / "data"
APACHE_LICENSE = SKILL / "LICENSES" / "Apache-2.0.txt"
APACHE_LICENSE_SHA256 = "cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30"
SKILL_NOTICES = SKILL / "THIRD-PARTY-NOTICES.md"
PROVENANCE_MANIFEST = SKILL / "THIRD-PARTY-PROVENANCE.json"
DERIVATION_AUDIT = ROOT / "docs" / "v3" / "LICENSE-DERIVATION-AUDIT.md"

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


def canonical_text(path: Path) -> str:
    """The manifest's checkout-independent UTF-8 text representation."""

    raw = path.read_bytes()
    if raw.startswith(b"\xef\xbb\xbf"):
        raw = raw[3:]
    return raw.decode("utf-8").replace("\r\n", "\n").replace("\r", "\n")


def sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def provenance_tree_sha(files: dict[str, str]) -> str:
    payload = "".join(f"{path}\0{files[path]}\n" for path in sorted(files))
    return sha256_text(payload)


def safe_posix_relative(where: str, value: object) -> str | None:
    if not isinstance(value, str) or not value or "\\" in value:
        fail(where, "path must be a non-empty POSIX relative path")
        return None
    path = PurePosixPath(value)
    if path.is_absolute() or any(part in {"", ".", ".."} for part in path.parts):
        fail(where, f"path escapes its declared root: {value!r}")
        return None
    if path.as_posix() != value:
        fail(where, f"path is not canonical POSIX form: {value!r}")
        return None
    return value


# --------------------------------------------------------------------------- shape


@check("SKILL.md stays under 500 lines")
def _skill_length() -> None:
    n = len((SKILL / "SKILL.md").read_text(encoding="utf-8").splitlines())
    if n > 500:
        fail("skills/sitesmith/SKILL.md", f"{n} lines, cap is 500 — move material into a reference")


@check("SKILL.md reference-map line counts are accurate")
def _reference_line_counts() -> None:
    text = (SKILL / "SKILL.md").read_text(encoding="utf-8")
    for m in re.finditer(
        r"\[(?:v2/)?([0-9]{2}-[^\]]+\.md)\]\((references|v2)/[^)]+\)[^|]*\|[^|]*\|\s*(\d+)\s*\|",
        text,
    ):
        name, where, claimed = m.group(1), m.group(2), int(m.group(3))
        target = (REFS if where == "references" else SKILL / "v2") / name
        if not target.exists():
            fail(f"SKILL.md -> {name}", "listed in the reading list but missing on disk")
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


@check("runtime task routes stay outside provenance references")
def _runtime_task_routes() -> None:
    required_tasks = {
        "SETUP": TASKS / "setup.md",
        "REDESIGN": TASKS / "redesign-audit.md",
    }
    legacy_tasks = (
        REFS / "10-setup.md",
        REFS / "06-redesign-audit.md",
    )

    for task, path in required_tasks.items():
        if not path.is_file():
            fail(path.relative_to(ROOT).as_posix(), f"missing canonical {task} task file")
    for path in legacy_tasks:
        if path.exists():
            fail(
                path.relative_to(ROOT).as_posix(),
                "operational task files belong in v2/tasks/, not provenance-only references/",
            )

    pipeline_path = SKILL / "PIPELINE.json"
    try:
        pipeline = json.loads(pipeline_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        fail(pipeline_path.relative_to(ROOT).as_posix(), f"cannot inspect runtime reads: {e}")
    else:
        for step in pipeline.get("steps", []):
            step_id = step.get("id", "<missing id>")
            for target in step.get("reads", []):
                normalized = str(target).replace("\\", "/").lstrip("./")
                if "references" in normalized.split("/"):
                    fail(
                        f"skills/sitesmith/PIPELINE.json step {step_id}",
                        f"runtime read points into provenance-only references/: {target}",
                    )

    skill_path = SKILL / "SKILL.md"
    skill_text = skill_path.read_text(encoding="utf-8")
    for path in legacy_tasks:
        legacy_target = path.relative_to(SKILL).as_posix()
        if legacy_target in skill_text:
            fail(skill_path.relative_to(ROOT).as_posix(), f"contains retired runtime path {legacy_target}")
    route = re.search(r"## 1\. Route\s+(.*?)\s+## 2\.", skill_text, re.DOTALL)
    if route is None:
        fail(skill_path.relative_to(ROOT).as_posix(), "cannot locate the runtime route section")
        return

    route_text = route.group(1)
    for match in re.finditer(r"\]\((references/[^)]+)\)", route_text):
        fail(
            skill_path.relative_to(ROOT).as_posix(),
            f"runtime route points into provenance-only references/: {match.group(1)}",
        )
    for task, path in required_tasks.items():
        target = path.relative_to(SKILL).as_posix()
        if f"]({target})" not in route_text:
            fail(skill_path.relative_to(ROOT).as_posix(), f"{task} route must link {target}")


# --------------------------------------------------------------- attribution / licence

ATTRIBUTION = re.compile(r"— (MIT|Apache License 2\.0),|Original work, MIT", re.UNICODE)
DERIVED = re.compile(r"Derived from", re.UNICODE)
CHANGE_NOTE = re.compile(r"\*\*Modified for sitesmith:\*\*\s*\S", re.UNICODE)


@check("every bundled reference states its licence inline")
def _attribution() -> None:
    # Case-sensitive and anchored on the real header. A bare `grep -i MIT` passes on
    # any file containing "limit" or "submit", which is how 35 files went unnoticed.
    for p in sorted(list(REFS.glob("*.md")) + list((REFS / "impeccable").glob("*.md"))):
        if not ATTRIBUTION.search(p.read_text(encoding="utf-8")):
            fail(p.relative_to(ROOT).as_posix(), "no attribution header — see NOTICE.md for the format")


@check("every derived file says what was changed")
def _change_notices() -> None:
    # Apache 2.0 §4(b): a modified file must carry a prominent notice that we changed
    # it. The presence of the note is checkable; only review can check it is honest.
    for p in sorted(list(REFS.glob("*.md")) + list((REFS / "impeccable").glob("*.md"))):
        text = p.read_text(encoding="utf-8")
        if DERIVED.search(text) and not CHANGE_NOTE.search(text):
            fail(
                p.relative_to(ROOT).as_posix(),
                'claims "Derived from" without a "**Modified for sitesmith:** …" note',
            )


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


@check("bundled Apache work ships the complete Apache-2.0 licence")
def _apache_license() -> None:
    if not APACHE_LICENSE.is_file():
        fail(
            APACHE_LICENSE.relative_to(ROOT).as_posix(),
            "missing — provider packs redistribute Apache-derived references",
        )
        return
    actual = sha256_text(canonical_text(APACHE_LICENSE))
    if actual != APACHE_LICENSE_SHA256:
        fail(
            APACHE_LICENSE.relative_to(ROOT).as_posix(),
            f"must exactly match apache.org/licenses/LICENSE-2.0.txt; got {actual}",
        )


@check("installed bundles carry required third-party notices")
def _skill_notices() -> None:
    if not SKILL_NOTICES.is_file():
        fail(SKILL_NOTICES.relative_to(ROOT).as_posix(), "missing from the installable skill tree")
        return
    text = SKILL_NOTICES.read_text(encoding="utf-8")
    required = (
        "Copyright (c) 2026 Leonxlnx",
        "Copyright (c) 2024 Next Level Builder",
        "Copyright Anthropic PBC",
        "Copyright Paul Bakaus",
        "ehmo/platform-design-skills",
        "Permission is hereby granted, free of charge",
        "LICENSES/Apache-2.0.txt",
    )
    for phrase in required:
        if phrase not in text:
            fail(SKILL_NOTICES.relative_to(ROOT).as_posix(), f"missing required notice: {phrase!r}")


@check("third-party provenance manifest is exact and installable")
def _third_party_provenance() -> None:
    where = PROVENANCE_MANIFEST.relative_to(ROOT).as_posix()
    try:
        manifest_text = canonical_text(PROVENANCE_MANIFEST)
        manifest = json.loads(manifest_text)
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as e:
        fail(where, f"cannot read schemaVersion 1 manifest: {e}")
        return

    expected_scalars = {
        "schemaVersion": 1,
        "normalization": "utf8-strip-bom-crlf-to-lf-v1",
        "spanHashMode": "lines-inclusive-no-synthetic-final-lf-v1",
        "treeHashMode": "sha256-sorted-relative-path-null-canonical-file-sha-lf-v1",
        "selfHashMode": "normalized-text-replace-own-sha-with-64-zeroes-v1",
    }
    for key, expected in expected_scalars.items():
        if manifest.get(key) != expected:
            fail(where, f"{key} must be {expected!r}")

    audit = manifest.get("audit", {})
    if audit != {
        "path": "docs/v3/LICENSE-DERIVATION-AUDIT.md",
        "baseline": "80d4030780a4cab18f3baa16dfd354269f83971c",
        "conclusion": "closed-for-exact-mapped-baseline-only",
    }:
        fail(where, "audit must pin the exact 80d4030 baseline and baseline-only conclusion")
    try:
        audit_text = canonical_text(DERIVATION_AUDIT)
    except (OSError, UnicodeDecodeError) as e:
        fail(audit.get("path", "audit"), f"cannot read declared audit: {e}")
    else:
        if audit.get("baseline") not in audit_text:
            fail(audit["path"], "does not contain the manifest's full baseline revision")
        if not re.search(r"closed for that exact mapped baseline only", audit_text, re.IGNORECASE):
            fail(audit["path"], "does not state the manifest's baseline-only conclusion")

    sources = manifest.get("sources", [])
    source_ids = [item.get("id") for item in sources if isinstance(item, dict)]
    if len(sources) != 4 or len(source_ids) != len(set(source_ids)):
        fail(where, "sources must contain four unique source ids")
    expected_sources = {
        "taste-skill": (
            "e988add20dab0fa97d7a76781c48961c8184288e", "MIT",
            ["e988add20dab0fa97d7a76781c48961c8184288e"],
        ),
        "ui-ux-pro-max": (
            "4857a2c5ef989794751a0f66b8545a4a49566286", "MIT",
            [
                "65e23199492fa911af32d9078e627ab4de01f4c8",
                "13789290064c88039ad8fc5376412e8d22e491d7",
                "07f4ef3ac2568c25a3b0c8ef5165a86abc3e56e4",
                "6142b073958df645d0fb27e682428e69599386dc",
            ],
        ),
        "frontend-design": (
            "b29e7cf65e5cb78a5ac33d582270551bc74a14eb", "Apache-2.0",
            ["df5224ba07bcc260c4c6bcd7ce2c5a6cff533c4a"],
        ),
        "impeccable": (
            "6b342244e915d64b0d6e84d5eec448fd196ce6bb", "Apache-2.0",
            ["af78b1e512148e2a2f2d2ded6786d265ea420191"],
        ),
    }
    for source in sources:
        if not isinstance(source, dict):
            fail(where, "every source must be an object")
            continue
        source_id = source.get("id")
        expected = expected_sources.get(source_id)
        if expected is None:
            fail(where, f"unknown source id {source_id!r}")
            continue
        if (source.get("capabilityRevision"), source.get("licenseSpdx")) != expected[:2]:
            fail(where, f"{source_id} capability revision or SPDX id drifted")
        revisions = source.get("derivationRevisions")
        if not isinstance(revisions, list) or not revisions or any(
            not isinstance(rev, str) or not re.fullmatch(r"[0-9a-f]{40}", rev) for rev in revisions
        ):
            fail(where, f"{source_id} has invalid derivation revisions")
        elif revisions != expected[2]:
            fail(where, f"{source_id} derivation revisions do not match the audit")

    carriage = manifest.get("carriage", [])
    carriage_ids = [item.get("id") for item in carriage if isinstance(item, dict)]
    expected_carriage = {
        "root-mit-license",
        "root-notice",
        "apache-2.0-license",
        "third-party-notices",
        "provenance-manifest",
    }
    if set(carriage_ids) != expected_carriage or len(carriage_ids) != len(set(carriage_ids)):
        fail(where, "carriage ids must be the exact five licence/notice/manifest surfaces")
    carriage_by_id = {item.get("id"): item for item in carriage if isinstance(item, dict)}
    for source in sources:
        for carriage_id in source.get("carriageIds", []):
            if carriage_id not in carriage_by_id:
                fail(where, f"{source.get('id')} references missing carriage id {carriage_id!r}")

    hex_sha = re.compile(r"[0-9a-f]{64}")
    for item in carriage:
        if not isinstance(item, dict):
            fail(where, "every carriage entry must be an object")
            continue
        path_value = safe_posix_relative(f"{where} carriage {item.get('id')}", item.get("path"))
        scope = item.get("scope")
        if scope not in {"repository", "skill"} or path_value is None:
            if scope not in {"repository", "skill"}:
                fail(where, f"carriage {item.get('id')} has invalid scope {scope!r}")
            continue
        root = ROOT if scope == "repository" else SKILL
        target = root / path_value
        try:
            target.resolve().relative_to(root.resolve())
        except ValueError:
            fail(where, f"carriage {item.get('id')} escapes {scope} root")
            continue
        declared = item.get("canonicalFileSha256")
        if not isinstance(declared, str) or not hex_sha.fullmatch(declared):
            fail(where, f"carriage {item.get('id')} has invalid SHA-256")
            continue
        if item.get("id") == "provenance-manifest":
            if item.get("hashMode") != manifest.get("selfHashMode"):
                fail(where, "manifest carriage must declare the self-hash mode")
                continue
            if manifest_text.count(declared) != 1:
                fail(where, "manifest self hash must occur exactly once")
                continue
            actual = sha256_text(manifest_text.replace(declared, "0" * 64, 1))
        else:
            try:
                actual = sha256_text(canonical_text(target))
            except (OSError, UnicodeDecodeError) as e:
                fail(where, f"cannot hash carriage {item.get('id')}: {e}")
                continue
        if actual != declared:
            fail(where, f"carriage {item.get('id')} hash drift: expected {declared}, got {actual}")
        if not isinstance(item.get("shipsWithInstall"), bool):
            fail(where, f"carriage {item.get('id')} shipsWithInstall must be boolean")
        expected_shipping = scope == "skill"
        if item.get("shipsWithInstall") is not expected_shipping:
            fail(where, f"carriage {item.get('id')} has incorrect install-carriage state")

    expected_group_counts = {
        "taste-references": 7,
        "frontend-design-span": 1,
        "uupm-references": 2,
        "uupm-data": 28,
        "uupm-python": 3,
        "impeccable-provider-output": 35,
    }
    groups = manifest.get("groups", [])
    group_ids = [group.get("id") for group in groups if isinstance(group, dict)]
    if set(group_ids) != set(expected_group_counts) or len(group_ids) != len(set(group_ids)):
        fail(where, "provenance groups are missing, duplicated or unexpected")

    memberships: dict[str, list[tuple[str, dict]]] = {}
    unique_files: dict[str, str] = {}
    source_set = set(source_ids)
    for group in groups:
        if not isinstance(group, dict):
            fail(where, "every group must be an object")
            continue
        group_id = group.get("id")
        files = group.get("files", [])
        if len(files) != expected_group_counts.get(group_id, -1):
            fail(where, f"group {group_id!r} has {len(files)} files, expected {expected_group_counts.get(group_id)}")
        if group.get("sourceId") not in source_set:
            fail(where, f"group {group_id!r} references an unknown source")
        within: dict[str, str] = {}
        for entry in files:
            if not isinstance(entry, dict):
                fail(where, f"group {group_id!r} contains a non-object file entry")
                continue
            rel = safe_posix_relative(f"{where} group {group_id}", entry.get("path"))
            safe_posix_relative(f"{where} group {group_id} source", entry.get("sourcePath"))
            if rel is None:
                continue
            target = SKILL / rel
            try:
                target.resolve().relative_to(SKILL.resolve())
            except ValueError:
                fail(where, f"group {group_id!r} path escapes skill root: {rel}")
                continue
            declared = entry.get("canonicalFileSha256")
            if not isinstance(declared, str) or not hex_sha.fullmatch(declared):
                fail(where, f"{rel} has invalid canonicalFileSha256")
                continue
            try:
                text = canonical_text(target)
            except (OSError, UnicodeDecodeError) as e:
                fail(where, f"cannot hash covered file {rel}: {e}")
                continue
            actual = sha256_text(text)
            if actual != declared:
                fail(where, f"{rel} full-file hash drift: expected {declared}, got {actual}")
            if rel in within:
                fail(where, f"group {group_id!r} contains duplicate path {rel}")
            within[rel] = declared
            memberships.setdefault(rel, []).append((group_id, entry))
            if rel in unique_files and unique_files[rel] != declared:
                fail(where, f"overlapping groups disagree on {rel}'s hash")
            unique_files[rel] = declared
            for span in entry.get("spans", []):
                lines = span.get("localLines") if isinstance(span, dict) else None
                span_sha = span.get("canonicalSpanSha256") if isinstance(span, dict) else None
                if not (
                    isinstance(lines, list) and len(lines) == 2
                    and all(isinstance(n, int) for n in lines)
                    and 1 <= lines[0] <= lines[1] <= len(text.splitlines())
                    and isinstance(span_sha, str) and hex_sha.fullmatch(span_sha)
                ):
                    fail(where, f"{rel} has an invalid span declaration")
                    continue
                actual_span = sha256_text("\n".join(text.splitlines()[lines[0] - 1 : lines[1]]))
                if actual_span != span_sha:
                    fail(where, f"{rel} L{lines[0]}-{lines[1]} span hash drift")
                if group_id == "frontend-design-span" and span.get("sourceCanonicalSpanSha256") != actual_span:
                    fail(where, f"{rel} frontend-design source/local span hash mismatch")
            if group_id == "frontend-design-span":
                expected_frontend_source = {
                    "sourceRevision": "df5224ba07bcc260c4c6bcd7ce2c5a6cff533c4a",
                    "sourceGitBlob": "600b6db41fac7e2081c7528ec6982960892c819d",
                    "sourceCanonicalFileSha256": "d39adf3a983de7dafc75991590d54f091755f7e4163d5a5ed085ecd719157184",
                    "derivation": "frontmatter-and-leading-blank-removed-body-in-sitesmith-assembly",
                }
                for key, expected in expected_frontend_source.items():
                    if entry.get(key) != expected:
                        fail(where, f"{rel} {key} must bind the exact frontend-design source")
        actual_tree = provenance_tree_sha(within)
        if group.get("treeSha256") != actual_tree:
            fail(where, f"group {group_id!r} tree hash drift: got {actual_tree}")

    expected_third_party = {
        path.relative_to(SKILL).as_posix()
        for path in REFS.glob("*.md")
        if re.search(r"— (?:MIT|Apache License 2\.0),|Derived from", "\n".join(canonical_text(path).splitlines()[:10]))
    }
    expected_third_party |= {"scripts/core.py", "scripts/design_system.py", "scripts/search.py"}
    expected_third_party |= {
        path.relative_to(SKILL).as_posix() for path in DATA.rglob("*.csv")
    }
    expected_third_party |= {
        path.relative_to(SKILL).as_posix() for path in (REFS / "impeccable").glob("*.md")
    }
    if len(expected_third_party) != 75:
        fail(where, f"repository third-party candidate set is {len(expected_third_party)}, expected 75")
    missing = expected_third_party - unique_files.keys()
    orphans = unique_files.keys() - expected_third_party
    if missing or orphans:
        fail(where, f"exact coverage drift; missing={sorted(missing)}, orphans={sorted(orphans)}")

    overlaps = {path: entries for path, entries in memberships.items() if len(entries) > 1}
    if set(overlaps) != {"references/05-ai-tells.md"}:
        fail(where, f"only references/05-ai-tells.md may overlap groups, got {sorted(overlaps)}")
    else:
        overlap_groups = {group_id for group_id, _ in overlaps["references/05-ai-tells.md"]}
        if overlap_groups != {"taste-references", "frontend-design-span"}:
            fail(where, "05-ai-tells overlap must be Taste plus frontend-design")
        ranges = sorted(
            tuple(span["localLines"])
            for _, entry in overlaps["references/05-ai-tells.md"]
            for span in entry.get("spans", [])
        )
        if not ranges or any(left[1] >= right[0] for left, right in zip(ranges, ranges[1:])):
            fail(where, "05-ai-tells source spans must be explicit and disjoint")

    coverage = manifest.get("coverage", {})
    membership_count = sum(len(group.get("files", [])) for group in groups if isinstance(group, dict))
    if coverage.get("uniqueFileCount") != 75 or coverage.get("membershipCount") != 76:
        fail(where, "coverage counts must be exactly 75 unique / 76 memberships")
    if len(unique_files) != 75 or membership_count != 76:
        fail(where, f"actual coverage is {len(unique_files)} unique / {membership_count} memberships")
    actual_tree = provenance_tree_sha(unique_files)
    if coverage.get("treeSha256") != actual_tree:
        fail(where, f"global third-party tree hash drift: got {actual_tree}")

    impeccable = next((group for group in groups if group.get("id") == "impeccable-provider-output"), None)
    if impeccable:
        source_hashes: dict[str, str] = {}
        normal = re.compile(
            r"> Part of the \*\*sitesmith\*\* skill\. Verbatim from \[impeccable\].*?\n"
            r"> Reproduced without modification; only this header block and the file name are ours\.\n\n---\n\n"
        )
        impeccable_names = {Path(entry["path"]).name for entry in impeccable["files"] if entry["path"] != "references/impeccable/_SKILL-original.md"}
        for entry in impeccable["files"]:
            rel = entry["path"]
            value = canonical_text(SKILL / rel)
            if rel.endswith("/_SKILL-original.md"):
                lines = value.splitlines(keepends=True)
                starts = [i for i, line in enumerate(lines) if line.startswith("> Part of the **sitesmith** skill. Derived from ")]
                if len(starts) != 1:
                    fail(where, "cannot reconstruct Impeccable _SKILL attribution block")
                    continue
                index = starts[0]
                if index < 1 or index + 4 >= len(lines) or not lines[index + 1].startswith("> **Modified for sitesmith:**") or lines[index + 3].strip() != "---":
                    fail(where, "Impeccable _SKILL transform shape drifted")
                    continue
                del lines[index - 1 : index + 5]
                value = "".join(lines)
                repoints = 0
                def restore_reference(match):
                    nonlocal repoints
                    name = match.group(1)
                    if name in impeccable_names:
                        repoints += 1
                        return f"](reference/{name})"
                    return match.group(0)
                value = re.sub(r"\]\(([^/)]+\.md)\)", restore_reference, value)
                if repoints != 32:
                    fail(where, f"Impeccable _SKILL reconstructed {repoints} links, expected 32")
                if (
                    entry.get("derivation")
                    != "remove-attribution-restore-32-reference-prefixes-and-terminal-lf"
                    or not value.endswith("\n")
                ):
                    fail(where, "Impeccable _SKILL terminal-LF transform drifted")
                    continue
                value = value[:-1]
            else:
                value, substitutions = normal.subn("", value, count=1)
                if substitutions != 1:
                    fail(where, f"cannot remove exact Impeccable attribution from {rel}")
                    continue
            reconstructed = sha256_text(value)
            if entry.get("reconstructedSourceCanonicalFileSha256") != reconstructed:
                fail(where, f"{rel} reconstructed source hash drift")
            source_hashes[entry["sourcePath"]] = reconstructed
        reconstructed_tree = provenance_tree_sha(source_hashes)
        if impeccable.get("reconstructedSourceTreeSha256") != reconstructed_tree:
            fail(where, f"Impeccable reconstructed source tree drift: got {reconstructed_tree}")


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


@check("the public showcase contains only portfolio-cleared cases")
def _gallery_coverage() -> None:
    """An individual score is necessary and insufficient for showcase eligibility.

    Round 8 proved the gap: all three pages cleared the individual threshold while the
    rendered portfolio failed five diversity checks and both reviewers described one studio
    and one method. The committed showcase manifest now owns eligibility, and its diversity
    report has to agree. A reset state is allowed, but it must show zero benchmark cases.
    """
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    bench = ROOT / "benchmarks"
    pages = sorted(p.parent.relative_to(bench).as_posix() for p in bench.glob("*/index.html"))
    pages += sorted(p.parent.relative_to(bench).as_posix() for p in bench.glob("*/*/index.html"))
    # The block harness is generated from skills/sitesmith/blocks and is not a brief,
    # so it is verified like a benchmark but does not claim a card in the gallery.
    pages = [p for p in pages if p != "blocks"]

    manifest_path = ROOT / "gallery" / "showcase.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    status = manifest.get("status")
    target = manifest.get("target")
    approved = manifest.get("approved", [])

    if status not in {"reset", "ready"}:
        fail("gallery/showcase.json", f"status must be reset or ready, got {status!r}")
    if not isinstance(target, int) or target < 1:
        fail("gallery/showcase.json", "target must be a positive integer")
    if len(approved) != len(set(approved)):
        fail("gallery/showcase.json", "approved contains duplicate paths")
    for page in approved:
        if page not in pages:
            fail("gallery/showcase.json", f"approved path has no benchmark page: {page}")

    portfolio_eligible: set[str] = set()
    for group in manifest.get("groups", []):
        report_path = ROOT / group.get("report", "")
        if not report_path.is_file():
            fail("gallery/showcase.json", f"{group.get('id')} report does not exist: {group.get('report')}")
            continue
        report = json.loads(report_path.read_text(encoding="utf-8"))
        actual = "pass" if report.get("verdict", {}).get("pass") else "fail"
        declared = group.get("portfolioDiversity")
        if actual != declared:
            fail("gallery/showcase.json", f"{group.get('id')} declares diversity {declared}, report says {actual}")
        individual = group.get("individualReview")
        if individual not in {"pass", "fail"}:
            fail("gallery/showcase.json", f"{group.get('id')} individualReview must be pass or fail")
        for page in group.get("cases", []):
            if page not in pages:
                fail("gallery/showcase.json", f"{group.get('id')} case has no benchmark page: {page}")
            if actual == "pass" and individual == "pass":
                portfolio_eligible.add(page)

    if status == "reset":
        if approved:
            fail("gallery/showcase.json", "reset status requires an empty approved list")
        if 'data-showcase-status="reset"' not in html:
            fail("index.html", "showcase manifest is reset but the page does not declare the reset")
    elif len(approved) < target:
        fail("gallery/showcase.json", f"ready status requires {target} approved cases, found {len(approved)}")

    # Benchmark fixtures can be linked as evidence or embedded as diagnostic controls.
    # Only an explicit showcase marker makes a page a public portfolio claim.
    shown = [p for p in pages if f'data-showcase-case="{p}"' in html]
    allowed = set(approved)
    for page in shown:
        if page not in allowed:
            fail("index.html", f"benchmarks/{page} is shown without portfolio approval")
    for page in approved:
        if page not in portfolio_eligible:
            fail("gallery/showcase.json", f"approved case lacks both page and portfolio approval: {page}")
        if page not in shown:
            fail("index.html", f"approved benchmark has no public showcase card: {page}")
    for page in pages:
        live = f"https://byensitmagnus.github.io/sitesmith/benchmarks/{page}/"
        if live in readme and page not in allowed:
            fail("README.md", f"links {page} as a public case without portfolio approval")


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
