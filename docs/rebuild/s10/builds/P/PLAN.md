# Designplan — Vægtkontrol Nord

## Grounding

**Subject:** a two-person accredited calibration firm for non-automatic weighing
instruments, working out of a van in North Jutland.
**Audience:** a shop owner — baker, fishmonger, pharmacist — whose scale was just
taken out of use at an inspection. Stressed, not technical, wants it over with.
**The page's single job:** make that person understand in under a minute that this
firm fixes exactly their problem, roughly what it costs them in *time*, and how to
start (phone).

The world this design comes from is not "local services". It is metrology: engraved
instrument nameplates, graduated scales, brass reference weights, tolerance bands,
calibration certificates with a column of field names and a column of values, and a
verification seal. Every choice below is pulled from that world.

---

## Pass 1 — token system

### Color (6 named values)

The instinct for a trades page is warm and reassuring. Refused: this is a cold,
metrological subject and warmth would be a lie about what the company sells.
The palette is the inside of a workshop van in Nordjylland — zinc, steel, brass,
and the one green that means "approved".

| Token | Hex | Role |
|---|---|---|
| `--zink` | `#E8EBEC` | page ground. Cool pale steel, deliberately **not** cream. |
| `--kridt` | `#F7F8F8` | card and panel surfaces, half a step lighter than the ground |
| `--staal` | `#C9D0D3` | rules, borders, graduations, instrument edges |
| `--blaek` | `#16202A` | text. Cold blue-black, never `#000` |
| `--messing` | `#7A5410` | brass. Labels, mono data, graduation majors. Deep enough for 5.6:1 body text |
| `--plombe` | `#1F6B4B` | seal green. Used **only** for the primary action and the tolerance band. Nowhere else. |

`--messing-lys #A87A2E` and `--plombe-lys #46A97D` exist as non-text tints (ticks,
SVG, dark scheme). A dark scheme mirrors the same six roles onto dark steel so the
identity survives the toggle; contrast re-checked in both.

### Type (3 roles)

- **Display — Archivo, width axis pushed to ~115%, 700, uppercase.**
  Chosen for the *width*, not the weight. Expanded grotesque caps are how equipment
  nameplates and instrument fascias are lettered. This is the deliberate move away
  from the high-contrast serif that any calibration-firm brief would otherwise get.
- **Body — IBM Plex Sans.** An engineering typeface, drawn for technical documents,
  dry rather than friendly. Full Danish coverage including Æ Ø Å.
- **Data / utility — IBM Plex Mono.** Carries every number, field label, eyebrow and
  the phone number. Sharing a superfamily with the body is the point: the page speaks
  in one instrument voice, and the mono is the certificate voice inside it.

Scale: `13 / 17 / 20 / 24 / 32 / clamp(2.2rem, 6.2vw, 4.4rem)`. Display is tracked
tight (-0.01em) and set in caps; mono is tracked open (+0.08em) and small. That gap
between the two extremes is most of the page's personality.

### Layout

A single column hung off a **graduated rule** that runs the full height of the page
on the left, like the engraved scale on a balance beam: 1px spine, minor ticks every
14px, major ticks every 70px. Content is inset from it. The rule is not decoration —
it is the one place the page states that it belongs to a measuring instrument, and it
carries one piece of real information (below).

```
1440 / 768                                  375
┌────┬─────────────────────────────────┐   ┌──────────────────┐
│ ┃╴ │ VÆGTKONTROL NORD    DANAK · III │   │ VÆGTKONTROL NORD │
│ ┃╴ ├─────────────────────────────────┤   │ DANAK · III/IIII │
│ ┃╴ │ eyebrow (mono)                  │   ├──────────────────┤
│ ┃╸ │ KALIBRERING OG      ┌─────────┐ │   │ eyebrow          │
│ ┃╴ │ VERIFIKATION        │ ▁▂▃ SVG │ │   │ H1 (2–4 lines)   │
│ ┃╴ │ AF VÆGTE            │ brass   │ │   │ lead             │
│ ┃╴ │ lead                │ weights │ │   │ [ Ring 98 12 …]  │
│ ┃╸ │ [Ring][Mail]        └─────────┘ │   │ [ Skriv til os ] │
│ ┃╴ │ ─ fakta ─ ─ fakta ─ ─ fakta ─   │   │ ┌──────────────┐ │
│ ┃╴ ├─────────────────────────────────┤   │ │ SVG weights  │ │
│ ┃╴ │ SÅDAN FORLØBER ET BESØG         │   │ └──────────────┘ │
│ ┃╴ │  1 ─────  2 ─────               │   │ fakta (stacked)  │
│ ┃╴ │  3 ─────  4 ─────               │   ├──────────────────┤
│ ┃╴ ├─────────────────────────────────┤   │ 1 ───            │
│ █╸ │ DET, DU FÅR MED   ← green band  │   │ 2 ───            │
│ █╴ │  [certifikat][plombe][lodder]   │   │ …                │
│ ┃╴ ├─────────────────────────────────┤   ├──────────────────┤
│ ┃╴ │ PRAKTISK  (certificate table)   │   │ certificate rows │
│ ┃╴ │  UDKALD      │ value            │   │ stacked k/v      │
│ ┃╴ │  AKUT UDKALD │ value            │   ├──────────────────┤
│ ┃╴ ├─────────────────────────────────┤   │ 98 12 44 30      │
│ ┃╴ │ HVEM DER KOMMER                 │   └──────────────────┘
│ ┃╴ ├─────────────────────────────────┤
│ ┃╴ │ 98 12 44 30 (huge, mono)        │
└────┴─────────────────────────────────┘
```

At <1000px the rule collapses to a 2px brass tick on each section eyebrow, so the
graduation idea survives without stealing width from a 375px screen.

### Signature

**The brass reference-weight set, drawn in SVG, standing on a steel plate in the
hero.** Three knobbed cylindrical weights in a metallic brass gradient, descending
left to right, with the smallest engraved `F1`. It is the object the technicians
actually carry in the van and the only reason anything they say is true — the page's
thesis, rendered as the thing itself rather than as a claim.

Its structural partner is **the tolerance band**: on the graduated rule, one short
segment turns `--plombe` green, and it aligns exactly with the section describing the
certificate and the seal. The rule reads as a scale, and the green is where you end
up. That is the only motion-free storytelling device on the page, and it encodes
something true rather than decorating.

---

## Pass 2 — critique of the plan before building

Four things in pass 1 were the generic answer. Changed:

1. **Hero was a headline + stat row + gradient accent.** That is the template answer
   named in my instructions, and it would have forced invented numbers, which the
   brief forbids outright. Replaced with the SVG weight set as the hero's right-hand
   object. The facts strip survives but as flat mono rules, no boxes, no gradient.

2. **Palette started warm (cream, ink, terracotta).** That is default look #1 and it
   would have been chosen for "trustworthy local business", not for this subject. Cold
   zinc and steel with brass and one seal green is specific to a metrology van; warmth
   would misdescribe the product.

3. **Sections were going to be numbered 01 / 02 / 03.** Page sections are not a
   sequence, so the numbers would be decoration. Numbers now appear in exactly two
   places where they carry information: the four steps of a visit, which genuinely are
   ordered, and the certificate-style table of terms.

4. **Display face was going to be a high-contrast serif.** Rejected for the same
   reason as the palette. Archivo pushed wide is the harder, more specific choice —
   expanded caps are instrument-plate lettering, and no similar brief would arrive
   there by default.

**The risk I am taking:** setting every heading in wide uppercase grotesque on a cold
grey ground, with no photography and no warmth, for an audience that is stressed. If
it fails, it fails as cold. The mitigation is the copy, which is plain, and the type
scale, which keeps body text at a generous 17px in a humane engineering sans. I think
the trade is right: a person whose scale was just condemned wants competence, not a
hug.

**Motion:** one page-load reveal on the hero, staggered over four elements, and
nothing else. No scroll effects. Removed a hover-lift on the cards — the accessory
taken off before leaving the house. `prefers-reduced-motion` removes all of it.

**Copy:** written from the reader's side. Verbs are what the reader does ("Du ringer")
or what we do ("Vi kører ud"). Nothing sells. Every number on the page comes from the
brief and nowhere else — no customer names, no testimonials, no job counts, no
invented measurements inside the illustration.
