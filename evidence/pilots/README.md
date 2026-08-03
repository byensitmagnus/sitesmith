# Two more surfaces, and the check that they disagree

`evidence/pilot/` is the first pilot: a glazier's buy surface, built to find out whether the
product works when a stranger uses it. These two exist for a different reason. Design Contract
v1 is a set of fields, and a set of fields is one bad afternoon away from being a template
with fields: the same person fills them the same way twice and the second page inherits the
first page's answers without anybody deciding to.

So the contract was built against three briefs that want different things, and
`tools/test-portfolio-contracts.mjs` fails in CI if any two of the three ever converge.

## The two

**[`02-operate`](02-operate/BRIEF.md), Bjerregaard Sluse.** One lock keeper's console from
22:00 to 06:00, open on a second monitor, looked at every few minutes and mostly not read.
The screen ranks the night by what is closest to going wrong, carries the arithmetic that did
the ranking so a keeper can disagree with it, and puts an age on every reading. The radio
link dropped for six minutes and the ribbon is drawn with an actual hole in it.

**[`03-persuade`](03-persuade/BRIEF.md), Vestkystens Frøbank.** One page whose whole job is
to get a landowner to say yes to two people walking their dune for one morning in September.
Nothing is bought, nothing is booked. The conversion is a written enquiry a person reads, and
the page says on itself that it sends nowhere.

Both companies are fictional. Every number, name, address and reading was invented for the
pilot, the briefs say so, and both pages say so.

## What they agree on: nothing

| | 01 glazier | 02 lock keeper | 03 seed bank |
|---|---|---|---|
| palette strategy | committed | drenched | restrained |
| ground | `#dbe3dd` float glass | `#0f1a1f` canal water at night | `#dfe3d6` grey dune |
| action | `#16584a` glass edge | `#c9a227` brass | `#4a5535` marram |
| type | Bahnschrift + Sitka Text | Cascadia Mono + Segoe UI Variable Text | Palatino Linotype + Corbel |
| signature | a measured drawing of the bench | a time ribbon with a hole in it | one morning as a timeline |
| density | measured | packed | sparse |
| scheme | light | dark | light |

The differences come from the briefs, which is the half a script cannot check. The lock
console is dark because one keeper walks out into the rain with a torch every hour and a
bright screen costs them their night vision. The seed bank is sparse because a page asking a
stranger for access to their land has to leave room to say no. Both briefs are committed next
to their contracts so a reader can check that rather than take it.

## What the checks said

```
                          02-operate            03-persuade
production build          green                 green
verify                    PASS                  PASS
contract check            every pair clears     every pair clears
contract compare          matches the build     matches the build
journey                   passed                passed
critique                  ACCEPT, locked        ACCEPT, locked
gate                      clean                 clean, one waiver claimed
```

The lock console's gate is clean with no waiver, which the first pilot's was not.

## What they cost the product

Five defects, all fixed at root cause in SiteSmith rather than worked around:

7. The dark-scheme check assumed light was the base and refused a page that is entirely dark.
8. `look.md` documented a five-column asset manifest and `gate.mjs` reads six, and nothing in
   the package mentioned the `data-asset` attribute the gate also requires.
9. `contract.mjs` could not resolve playwright from an installed package.
10. And it destructured `chromium` out of a CommonJS module, so it read `.launch` of undefined.
11. `display: grid` beats the browser's own `[hidden]`, so a hidden form stayed visible next
    to its own success state. Only the journey caught it.

And four the contract caught **before implementation**, which is the argument for writing it
before rather than after: a rust that could not carry its own text, a focus-ring pair that
named the wrong background, a paper ground five units from an anti-tell cream, and a disabled
field's sentence at 3.1:1.

## Rebuilding either of them

```bash
cd evidence/pilots/02-operate/site
npm ci
npm run build
```

`npm ci`, not `npm install`. CI does this on every push, serves the production build, and
runs verify, the contract, the journey and the gate against it.
