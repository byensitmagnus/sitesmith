# Modes

> Original work, MIT. Read exactly one of these per build, after routing.

Three modes. Everything that genuinely changes with context is decided here, once per mode,
instead of being issued as a global rule that is wrong two thirds of the time.

| Mode | The site is | File |
| --- | --- | --- |
| **M** Marketing | A company, a service, a launch, a portfolio. The visitor is deciding whether to care. | [marketing.md](marketing.md) |
| **E** E-commerce | A catalogue and a product. The visitor is deciding whether to buy, and from whom. | [ecommerce.md](ecommerce.md) |
| **P** Product UI | A dashboard, an admin, a form, a console. The visitor already committed and is now working. | [product-ui.md](product-ui.md) |

A site can contain more than one. A shop's About page is **M**, its listing and product pages
are **E**, its order admin is **P**. Route per page, not per project — and keep one design
system across all of them. Different modes, one contract.

## The topics each mode decides

Every mode file answers all twelve, in this order, with an actual decision rather than a
range. Where a mode's answer is "it depends", it says what it depends on and gives the two
answers.

1. **Argument shape** — the section order the page kind actually needs, and what the first
   screen must establish.
2. **Hero family** — which hero this mode uses, and the two alternatives with when to pick
   them.
3. **Density** — which end of the spacing ramp is in play, and the base type size.
4. **Radius** — the values for this mode and why. There is no global answer.
5. **Imagery** — what the images are of, how they are cropped and treated, and what stands in
   when there is none.
6. **Motion** — what is allowed to move here, and what is not.
7. **Colour emphasis** — how hard the accent works, and whether semantic colour is in play.
8. **Proof** — what counts as evidence in this mode and how it is presented.
9. **Navigation** — the shape, the depth, and what happens on a phone.
10. **The primary action** — where it sits, how often it repeats, and what it says.
11. **Content density** — how much copy per section, and what a section is for.
12. **Failure modes** — the three ways this mode's pages usually go wrong.

## How to use one

Read [00-done.md](../00-done.md) and [10-core.md](../10-core.md) once. Then read the one mode
file for the page you are building, and keep it open. It overrides nothing in core — core is
the floor — but it is the only place that answers the twelve questions above, and it answers
them for your context rather than in general.
