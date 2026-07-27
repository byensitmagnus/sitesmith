# Mode E — e-commerce

> Original work, MIT. Listings, product pages, cart and checkout. The visitor is deciding
> whether to buy, and whether to buy it **from you**. Those are two different doubts and the
> page has to answer both.

Twelve decisions. Each is an answer, not a range.

---

## Contents

- [1. Argument shape](#1-argument-shape)
- [2. Hero family](#2-hero-family)
- [3. Density](#3-density)
- [4. Radius](#4-radius)
- [5. Imagery](#5-imagery)
- [6. Motion](#6-motion)
- [7. Colour emphasis](#7-colour-emphasis)
- [8. Proof](#8-proof)
- [9. Navigation](#9-navigation)
- [10. The primary action](#10-the-primary-action)
- [11. Content density](#11-content-density)
- [12. Failure modes](#12-failure-modes)

---

## 1. Argument shape

**Product page**, in this order:

1. **Gallery and identity** — what it is, what it looks like, price, availability.
2. **The purchase panel** — variant, quantity, delivery, add to basket. Sticky on desktop.
3. **What it does for you** — the two or three things that decide the purchase.
4. **Specifics** — full specification, dimensions, materials, compatibility. Complete, not
   curated: an omitted spec reads as a hidden one.
5. **Proof** — reviews, with the bad ones present.
6. **Logistics** — delivery, returns, warranty. Stated before checkout, not inside it.
7. **Related** — alternatives if this is wrong, complements if this is right. Say which.

**Listing page:** filters that reflect how the buyer thinks, a grid, and a count. Sort is
secondary to filter. An empty result offers the nearest thing that exists.

## 2. The first screen

**The outcome:** on a product page, the thing and the way to buy it are both on the first
screen. On a listing, the products start on the first screen.

That outcome is what rules out a marketing hero here, and the reason is not taste: a hero
above a product is a screen of scrolling inserted between wanting it and buying it. A
category band above roughly 200px costs the first row of products.

Within that, the arrangement is still a direction-lab choice — gallery left or right, panel
sticky or in flow, one large image or a stacked set, filters in a rail or across the top.
Those differ by catalogue and by what the photography actually looks like, and they are the
axis the three comps must differ on.

**Home page: this is mode M.** Route it there and keep the same contract.

## 3. Density

**The outcome:** a listing reads as one rhythm, and on a product page the price is found
without searching for it.

Both are consequences, not numbers. A grid whose gaps are irregular reads as a rendering
bug, which is why the card interior sits at the tight end of the contract's ramp while the
gaps between sections sit at the open end. Price is the second-largest type on the page after
the name and it is tabular, because a price that shifts under its own digits is a price the
buyer re-reads.

**What holds regardless:** figures that are compared are tabular. Commerce pages carry many
type sizes and need them close together, so the scale ratio is at the tight end of whatever
the contract sets — a 1.5 ratio in a listing produces sizes with nothing between them.

## 4. Radius

**The outcome:** the product is the shape the eye reads, and nothing on the card competes
with it.

A heavy radius on a card competes with the photograph inside it, which is the reason
commerce tends to land tighter than marketing — but the value comes from the direction and
the photography, not from this file.

**What holds regardless:** full-round is for badges and stock dots only. A pill-shaped "Add
to basket" reads as a marketing button rather than a purchase control, and the buyer hesitates
over which it is.

## 5. Imagery

**The images are the product.** This is the mode where imagery cannot be substituted.

- Multiple angles, one lighting setup, one background across the whole catalogue.
- A consistent aspect ratio per context: square in the grid, 4:3 or 3:2 on the page.
- Every image `alt`-described by what it shows, not by the product name repeated.
- Zoom or detail views where the material matters — texture, finish, stitching.
- Scale is stated somewhere: dimensions, a hand, a known object.

Where a real photograph does not exist yet, a labelled placeholder that states the shot
required — "front three-quarter, 3:2, white ground" — is a legitimate answer and better than
a generated approximation that will not match the shipped catalogue.

## 6. Motion

**Almost none, and never near money.** Gallery transitions and a variant swap, both under
`--motion-fast`. Nothing else moves.

Nothing animates in the basket, at checkout, or on a price. A price that counts up is a price
the buyer distrusts.

Loading states are the exception and are required: adding to basket, applying a filter and
recalculating delivery all need visible feedback within 100ms.

## 7. Colour emphasis

**One accent, reserved for the purchase path.** Add to basket, checkout, and nothing else.
Once "Add to basket" and "Read more" are the same colour, neither means anything.

**Semantic colour is fully in play** and is a separate group: in stock, low stock, out of
stock, on offer, delivery status. These are information, not decoration, and they do not
count against the one-accent rule. Each must be legible in both schemes and must never be the
only carrier — "low stock" says the words as well as being amber.

Sale pricing shows both numbers, with the original struck and labelled, and never invents a
"was" price.

## 8. Proof

Reviews, and the specification.

- **Show the distribution, not just the mean.** A 4.6 with 300 reviews and a 4.6 with three
  are different facts.
- **Negative reviews stay.** A page with only five-star reviews is read as filtered, and it
  is usually right.
- **Reviews are attributed** to a verified purchase where the platform supports it.
- **The specification is proof.** Buyers who read specs are the ones who complete. Complete
  it.

If there are no reviews yet, say so plainly: "No reviews yet — this went on sale in March."
Inventing them is the fastest way to lose a customer who checks.

## 9. Navigation

Category structure that matches how buyers search, not how the warehouse is organised.

A **mega-menu is correct here** above roughly twenty categories: two levels, grouped, with the
groups labelled. Below that a plain menu is faster.

Persistent: search, basket with a count, account. On a phone, search and basket stay visible;
the category menu collapses.

Breadcrumbs on every product and category page. They carry the buyer back to the set they
were choosing from, which is the most common thing they want to do next.

## 10. The primary action

**Add to basket**, in the purchase panel, sticky through the specification on desktop and
pinned to the bottom of the viewport on a phone.

One primary action per product page. "Save for later" and "Compare" are secondary and look
it. The action states what happens: "Add to basket", not "Buy now" unless it genuinely skips
the basket.

Price, variant and delivery estimate are inside the panel with the action. A buyer should
never scroll to check what they are about to pay.

## 11. Content density

Specifications are dense and complete. Prose is short: two or three sentences per benefit,
because a buyer reading a product page is scanning for a reason to stop worrying.

Every claim about the product maps to a specification line. A benefit with no corresponding
spec is marketing that wandered into the wrong mode.

## 12. Failure modes

1. **The specification is curated.** Six specs shown, twelve exist. The buyer who cares finds
   out and leaves. Show all of them; group them if there are many.
2. **Proof is invented or filtered.** Five-star-only reviews, a fabricated rating count. This
   is the same failure as marketing's invented proof and it costs more here, because the
   buyer is one search away from checking.
3. **The purchase path is decoration.** The add-to-basket button is the same weight as three
   other buttons, the delivery estimate is two screens away, and the basket does not confirm
   the addition. Everything on a product page is either helping the purchase or in its way.
