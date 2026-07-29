# 26 — the visual asset engine

> Original work, MIT. Runs between the brand inventory and the comps, and again before the
> build is called finished. Output: `VISUAL-SOURCE-PLAN.md`, real files on disk, rows in
> `ASSET-MANIFEST.md`. Enforced by `scripts/visual-assets.mjs`.

[`25-assets.md`](25-assets.md) makes assets a tracked deliverable with a state. It has one hole
in it: when the row says `needed`, nothing in the pipeline can make the thing. So the honest
answer became "designed out", over and over, and three pilot sites in a row were carried by
type, hairlines and a line drawing — which two blind review rounds correctly called one studio
applying one method.

This step closes that. It does not add a gate; it completes the one that was already there.

---

## Contents

- [1. Capabilities, not tool names](#1-capabilities-not-tool-names)
- [2. The provider ladder](#2-the-provider-ladder)
- [3. The plan comes first](#3-the-plan-comes-first)
- [4. What a generated asset has to record](#4-what-a-generated-asset-has-to-record)
- [5. Product truth, for shops](#5-product-truth-for-shops)
- [6. The visual QA loop](#6-the-visual-qa-loop)
- [7. Money](#7-money)

---

## 1. Capabilities, not tool names

The engine speaks in capabilities and never in tool names:

`text-to-image` · `image-to-image` · `image-edit` · `background-replace` ·
`generative-expand` · `upscale` · `style-reference` · `image-to-video`

A runtime declares which of those it can serve. **Nothing here hardcodes an MCP tool name**,
because a hardcoded name is a guess that works on one host and fails silently on the next:
Artlist's MCP is available in Claude today and not in Codex or Cursor, and a skill that assumes
it has quietly become a Claude skill. A provider that cannot say what it does is treated as
though it does nothing.

```bash
node scripts/visual-assets.mjs providers --providers providers.json
```

prints the ladder, what each declared provider can serve, and — the useful line — which
capabilities **nothing** can serve in this runtime.

## 2. The provider ladder

First that serves the capability wins.

| | provider | spends | what it is |
| --- | --- | --- | --- |
| 1 | `supplied` | no | real brand and product assets the client handed over |
| 2 | `licensed` | no | assets already in the project under a recorded licence |
| 3 | `artlist` | yes | Artlist MCP, when the host exposes it |
| 4 | `native` | yes | the agent's own image generation or editing tool |
| 5 | `openai` / `google` / `firefly` | yes | optional adapters |
| — | `mock` | no | deterministic fixture provider, for tests |

The order is not arbitrary and it is not politeness. **A real photograph of the real thing beats
a generated one every time**, and the failure this engine exists to prevent is a site full of
plausible pictures of nothing. Generation is the fourth answer, not the first.

If no provider can serve a capability the plan needs, the run writes **`ASSET-REQUESTS.md`** —
one actionable request per asset, with subject, materials, composition, lighting, ratios and
what must not change — and the project stays a draft. It does not proceed with a gap nobody
wrote down.

## 3. The plan comes first

> **Two plans, and this is the second one.** [24-asset-plan.md](24-asset-plan.md) settles what
> each picture is *for* — what the visitor learns, whose job it serves, whether a comparison is
> possible. This file settles where it *comes from*. Getting the sourcing right while the first
> question goes unasked is exactly what happened in round 7: every picture correctly sourced,
> licensed, recorded and cropped, and assets still the lowest-scoring criterion on every page.
> Write `ASSET-PLAN.md` first.

`VISUAL-SOURCE-PLAN.md` is written **before** anything is generated, so the brief decides the
picture instead of the picture deciding the brief. One `## <id>` block per asset. Every field
is required, and the parser fails on a blank one.

| field | what it settles |
| --- | --- |
| `role` | what job this image does on the page |
| `why` | why the page needs it — "it looks bare" is not a reason |
| `strategy` | `reuse` · `stock` · `generate` · `edit` |
| `medium` | photograph, drawing, diagram, render, texture |
| `subject` | the thing itself, specifically enough to shoot |
| `materials` | what it is made of, because materials are what read |
| `composition` | distance, angle, what is in frame |
| `lighting` | the actual light, named |
| `aspect-ratios`, `crops`, `focal` | what survives every width |
| `anti-references` | the three pictures it must not become |
| `must-not-change` | the part that carries the fact |
| `factual-risk` | what a wrong image would assert that is untrue |
| `max-attempts` | **two is the ceiling** |

Two iterations is a hard limit. A third attempt is a sign the plan is wrong, not the generator.

```bash
node scripts/visual-assets.mjs plan  VISUAL-SOURCE-PLAN.md --providers providers.json
node scripts/visual-assets.mjs check VISUAL-SOURCE-PLAN.md ASSET-MANIFEST.md
```

`plan` also prints the cost preflight. `check` fails on a planned asset with no manifest row —
the one that gets made and then quietly goes missing.

## 4. What a generated asset has to record

A row in `ASSET-MANIFEST.md` for a generated or edited asset carries, in addition to the columns
in [`25-assets.md`](25-assets.md):

`file` · `sourceType` · `provider` · `model` · `generationId` · `promptSha256` ·
`referenceSha256` · `settings` (seed where the provider has one) · `sha256` ·
`synthetic` · `licence` · `focal` · `crops` · `alt` · `approval` · `productTruth`

Two of those do most of the work.

**A remote or temporary generation link is not a finished asset.** It expires, and then the page
has a hole in it. The asset is the bytes on disk, converted to WebP or AVIF at the sizes the
page actually uses, with `srcset` and a fallback, and `sha256` is that file's hash — checked,
not copied.

**`approval` is not `ready`.** An asset that passes every technical check and is still a
decorative stock-looking picture is `rejected`. Approval requires a recorded visual QA pass.

## 5. Product truth, for shops

For e-commerce this is a rule, not a preference, and the gate holds it:

- A real product photograph **may** be used as a reference.
- The product's **form, ports, components, colour, logo and what is in the box** may not be
  invented or altered. `productTruth: real-product-photo` or `real-product-context`.
- Generative tools **may** make the environment, the light, the background and campaign
  variants *around* the product. That is `real-product-context`, and the row says so.
- A synthetic product **may not be presented as a stocked one**. If a row is
  `synthetic-illustrative` and the page presents it as a stocked item, the gate fails.
- With no real product material, the page **stays a draft**.
- **No AI-generated text baked into an image** where real HTML text belongs. It cannot be
  selected, translated, read aloud or corrected, and it is a lie about how the page was made.

## 6. The visual QA loop

Per important asset:

1. **Three or four candidates.** One candidate is a guess.
2. **Judged against the brief, the brand and the chosen direction** — not against how nice it is.
3. **Checked for the failures generators actually produce**: wrong product detail, hands,
   text, logos, impossible geometry, artefacts.
4. **Tested in both the desktop and the mobile crop**, at the focal point recorded.
5. **Rejected if it is only decorative, or generic.** "It looks fine" is a rejection.
6. **Judged in the page, not on its own.** An image that is beautiful in isolation and wrong in
   the comp is wrong.
7. **Two iterations, maximum.**

An asset becomes `ready` only when it is both technically clean and visually approved. Those are
two different findings and the manifest records both.

## 7. Money

No key, token or credential is read, written or logged by this step. Providers authenticate in
the host; the engine only ever sees capability names and file paths.

Before any paid call: a **cost and credit preflight**, printed, that spends nothing — how many
calls, against which provider, for which assets. Paid runs need explicit approval. CI runs
entirely against the `mock` provider and makes no paid call at all.

## Checking

```bash
node scripts/visual-assets.mjs providers --providers providers.json
node scripts/visual-assets.mjs plan     VISUAL-SOURCE-PLAN.md --providers providers.json
node scripts/visual-assets.mjs check    VISUAL-SOURCE-PLAN.md ASSET-MANIFEST.md
node scripts/visual-assets.mjs record   ASSET-MANIFEST.md --json records.json
node scripts/visual-assets.mjs requests VISUAL-SOURCE-PLAN.md > ASSET-REQUESTS.md
```
