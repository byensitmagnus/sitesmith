#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
UI/UX Pro Max Search - BM25 search engine for UI/UX style guides

Part of the sitesmith skill. Derived from ui-ux-pro-max-skill v2.9.0
(MIT, (c) 2024 Next Level Builder):
https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/65e23199492fa911af32d9078e627ab4de01f4c8

Modified for SiteSmith: dynamic domain/stack help, direction candidate dials, output recording and
SiteSmith state integration were added. Exact provenance is in docs/v3/LICENSE-DERIVATION-AUDIT.md.

Usage: python search.py "<query>" [--domain <domain>] [--stack <stack>] [--max-results 3]
       python search.py "<query>" --design-system [-p "Project Name"]
       python search.py "<query>" --design-system --persist [-p "Project Name"] [--page "dashboard"]

Domains and stacks below are generated from core.py, so --help never drifts from what exists.

Persistence (Master + Overrides pattern):
  --persist    Save design system to design-system/MASTER.md
  --page       Also create a page-specific override file in design-system/pages/
"""

import argparse
import sys
import io
from core import CSV_CONFIG, AVAILABLE_STACKS, MAX_RESULTS, search, search_stack
from design_system import generate_design_system, persist_design_system

# Force UTF-8 for stdout/stderr to handle emojis on Windows (cp1252 default)
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
if sys.stderr.encoding and sys.stderr.encoding.lower() != 'utf-8':
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')


def format_output(result):
    """Format results for Claude consumption (token-optimized)"""
    if "error" in result:
        return f"Error: {result['error']}"

    output = []
    if result.get("stack"):
        output.append(f"## UI Pro Max Stack Guidelines")
        output.append(f"**Stack:** {result['stack']} | **Query:** {result['query']}")
    else:
        output.append(f"## UI Pro Max Search Results")
        output.append(f"**Domain:** {result['domain']} | **Query:** {result['query']}")
    output.append(f"**Source:** {result['file']} | **Found:** {result['count']} results\n")

    for i, row in enumerate(result['results'], 1):
        output.append(f"### Result {i}")
        for key, value in row.items():
            value_str = str(value)
            if len(value_str) > 300:
                value_str = value_str[:300] + "..."
            output.append(f"- **{key}:** {value_str}")
        output.append("")

    return "\n".join(output)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="UI Pro Max Search",
        epilog=(
            "domains: " + ", ".join(CSV_CONFIG) + "\n"
            "stacks:  " + ", ".join(AVAILABLE_STACKS)
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("query", help="Search query, or the chosen label when used with --record")
    parser.add_argument("--domain", "-d", choices=list(CSV_CONFIG.keys()), help="Search domain")
    # Three contrasting candidates, rather than the top three (which are near each other)
    parser.add_argument("--candidates", "-c", action="store_true",
                        help="Three contrasting starting points with confidence, near-misses and repeats")
    parser.add_argument("--density", type=int, choices=range(1, 11),
                        help="Visual density dial, 1 airy to 10 packed")
    parser.add_argument("--motion", type=int, choices=range(1, 11),
                        help="Motion intensity dial, 1 static to 10 cinematic")
    parser.add_argument("--boldness", type=int, choices=range(1, 11),
                        help="Aesthetic boldness dial, 1 conventional to 10 experimental")
    parser.add_argument("--record", action="store_true",
                        help="Record the query as a chosen direction, so later --candidates runs avoid repeating it")
    parser.add_argument("--stack", "-s", choices=AVAILABLE_STACKS, help=f"Stack-specific search. Available: {', '.join(AVAILABLE_STACKS)}")
    parser.add_argument("--max-results", "-n", type=int, default=MAX_RESULTS, help="Max results (default: 3)")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    # Design system generation
    parser.add_argument("--design-system", "-ds", action="store_true", help="Generate complete design system recommendation")
    parser.add_argument("--project-name", "-p", type=str, default=None, help="Project name for design system output")
    parser.add_argument("--format", "-f", choices=["ascii", "markdown"], default="ascii", help="Output format for design system")
    # Persistence (Master + Overrides pattern)
    parser.add_argument("--persist", action="store_true", help="Save design system to design-system/MASTER.md (creates hierarchical structure)")
    parser.add_argument("--page", type=str, default=None, help="Create page-specific override file in design-system/pages/")
    parser.add_argument("--output-dir", "-o", type=str, default=None, help="Output directory for persisted files (default: current directory)")

    args = parser.parse_args()

    # Anti-repeat bookkeeping
    if args.record:
        from candidates import record_choice
        record_choice(args.domain or "style", args.query, args.project_name)
        print(f"recorded: {args.query} ({args.domain or 'style'}). "
              f"Later --candidates runs will avoid handing it back as the obvious answer.")
        sys.exit(0)

    # Three contrasting candidates
    if args.candidates:
        from candidates import contrasting_candidates, format_candidates
        dial_values = (args.density, args.motion, args.boldness)
        if any(value is not None for value in dial_values) and not all(
                value is not None for value in dial_values):
            parser.error("--density, --motion and --boldness must be supplied together")
        dials = None if args.density is None else {
            "visual_density": args.density,
            "motion_intensity": args.motion,
            "aesthetic_boldness": args.boldness,
        }
        result = contrasting_candidates(
            args.query, args.domain, project=args.project_name, dials=dials)
        if args.json:
            import json
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(format_candidates(result))
        sys.exit(0 if "error" not in result else 1)

    # Design system takes priority
    if args.design_system:
        result = generate_design_system(
            args.query, 
            args.project_name, 
            args.format,
            persist=args.persist,
            page=args.page,
            output_dir=args.output_dir
        )
        print(result)
        
        # Print persistence confirmation
        if args.persist:
            project_slug = args.project_name.lower().replace(' ', '-') if args.project_name else "default"
            print("\n" + "=" * 60)
            print(f"✅ Design system persisted to design-system/{project_slug}/")
            print(f"   📄 design-system/{project_slug}/MASTER.md (Global Source of Truth)")
            if args.page:
                page_filename = args.page.lower().replace(' ', '-')
                print(f"   📄 design-system/{project_slug}/pages/{page_filename}.md (Page Overrides)")
            print("")
            print(f"📖 Usage: When building a page, check design-system/{project_slug}/pages/[page].md first.")
            print(f"   If exists, its rules override MASTER.md. Otherwise, use MASTER.md.")
            print("=" * 60)
    # Stack search
    elif args.stack:
        result = search_stack(args.query, args.stack, args.max_results)
        if args.json:
            import json
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(format_output(result))
    # Domain search
    else:
        result = search(args.query, args.domain, args.max_results)
        if args.json:
            import json
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(format_output(result))
