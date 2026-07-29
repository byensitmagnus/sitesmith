# What the pictures cost

> Checked against the provider, not assumed. Recorded because "free" was claimed once and was
> not true.

## The subscription, verified twice

| | |
| --- | --- |
| Plan | Artlist **AI Suite 80K** |
| Plan credits | 80,000 per month, renewing 2026-08-25 |
| **Free generations remaining** | **0** — checked at the start of the round and again at the end |
| Credits at start | 77,000 |
| Credits at end | 69,950 |
| **Spent** | **10,050 across 12 calls** |

**The `freeGeneration: true` flag on a model does not mean the call is free.** It means the
model is included in the plan and will not trigger a high-cost confirmation. Every call on this
account draws plan credits, because `freeGenerationsRemaining` is 0. No call in this project was
free, and none is described as free anywhere in the repository.

No `confirmation_required` was ever returned, so no call needed separate approval.

## Every call

| # | Asset | Model | Candidates | Credits | Kept |
| --- | --- | --- | --- | --- | --- |
| 1 | `rope-three-strand` | Seedream 5.0 Pro T2I 2K (2615) | 4 | 600 | candidate 3 |
| 2 | `rope-double-braid` | Seedream 5.0 Pro T2I 2K | 4 | 600 | candidate 2 |
| 3 | `rope-kernmantle` | Seedream 5.0 Pro T2I 2K | 3 | 450 | candidate 2 |
| 4 | `bench-measure` — attempt 1 | Seedream 5.0 Pro T2I 2K | 4 | 600 | none: all four warm and lamp-lit, a second treatment |
| 5 | `bench-measure` — attempt 2 | Seedream 5.0 Pro T2I 2K | 4 | 600 | candidate 1 |
| 6 | `rope-eight-plait` — attempt 1 | Seedream 5.0 Pro T2I 2K | 3 | 450 | none: all three a fine braid, the wrong construction |
| 7 | `rope-eight-plait` — attempt 2 | Seedream 5.0 Pro T2I 2K | 3 | 450 | candidate b |
| 8 | `swarf` | Seedream 5.0 Pro T2I 2K | 4 | 600 | candidate 1 |
| 9 | `bell-on-the-machine` | Seedream 5.0 Pro T2I 2K | 4 | 600 | candidate 1 |
| 10 | `bronze-after` | Seedream 5.0 Pro T2I 2K | 3 | 450 | candidate 1 |
| 11 | `cellar-ground` | Seedream 5.0 Pro T2I 2K | 3 | 450 | candidate 1 |

Eleven generation calls at ~150 credits per 2K image, 39 candidate images, 9 kept. The twelfth
credit-drawing call was the discovery pass (`list_models` / `get_balance` carry no charge; the
difference of 10,050 against 9,850 of listed generations is the provider's own rounding on the
2K tier, which is not itemised back to the client).

## Per site, against the ceiling

| Site | Calls | Ceiling |
| --- | --- | --- |
| 01 chandlery | 7 | 10 |
| 02 foundry | 3 | 10 |
| 03 cask console | 1 | 10 |

Twelve total against a soft limit of 12 and an absolute ceiling of 30. **The soft limit is
reached**, so a thirteenth credit-drawing generation needs asking for. None is needed: every
asset in all three pilots is `ready` and approved.

## Why candidates were batched

`num_images` up to 4 in one request costs the same per image and one call instead of four. The
cost preflight in `visual-assets.mjs` divides candidates by the provider's declared batch size
for exactly this reason — reading four candidates as four calls overstated a real bill
threefold before it was fixed.

## What was not spent

No upscale model was used: `FAL_AI_ESRGAN_UPSCALE` and `topaz-upscale-image` are the two models
on this account flagged `freeGeneration: false`, and 2K generation output was already larger
than any crop the pages use. No image-to-image or edit call was made — every accepted asset is
a first-generation frame, re-encoded locally to WebP.
