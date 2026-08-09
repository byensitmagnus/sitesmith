# Budget, written before the first model call

```
Sonnet calls planned: 4
```

Three direction generations and one judge. No normalisation call, no scrub call, no second
judge, no follow-up brief. If a fourth generation is needed for any reason, the run stops and
reports instead.

## Model

| what | value |
| --- | --- |
| model passed to the harness | `sonnet` |
| resolved id per this session's environment | `claude-sonnet-5` |
| effort passed | `max` |
| effort actually honoured | **not observable from inside the run** |

The effort line is the value passed, not a claim about what the runtime did with it. Every
arm and the judge get the same three values.

## The brief

Chosen before any generation, by a rule that cannot be steered:

```
sha256(poolSha256).readUInt32BE(0) % 16, over the 16 included slugs sorted alphabetically
poolSha256 = 02aefec56f85077d39727b2f110eb19ea259b44001fd039ea7cb8cf71aaed9cb
index      = 4
brief      = halgarth-rotor-balancing   (surface: buy)
sha256     = d0d421ed080d13468b7e3b5e2fe1f1a0ab53219bd4ba2dfa9e24bc717b97c052
```

Recorded in `BRIEF-SELECTION.json` with the full candidate list, so the arithmetic can be
repeated.

## The three arms

| arm | what |
| --- | --- |
| A | SiteSmith at `lab/beat-impeccable-4.0.4` HEAD, all P0 fixes in, external assignment **disabled** |
| B | the same SiteSmith, same HEAD, same P0 fixes, `assign.mjs` **active** |
| C | Impeccable 4.0.4 at `9a949fb543d44cfb406f61bcab99d95d7f12cf1d`, `--scope direction` |

A and B differ in the assignment mechanism and in nothing else. Both run against the same
working tree, so the P0 fixes are identical by construction rather than by care.

## What this run is

An instrument and signal test on one brief. It cannot show that any arm is generally better,
and the report will not say that it did.

## Preconditions for C, checked before any model call

1. the pin resolves to `9a949fb543d44cfb406f61bcab99d95d7f12cf1d`
2. the seed is run with `--scope direction`
3. the roll is not degraded: a live catalogue and dealt challengers

If any of the three cannot be shown, the run stops with zero model calls.
