# Pins for the round

Everything in this round is measured against these and nothing else. A run that
cannot name its pin does not count.

## SiteSmith

| what | value |
| --- | --- |
| branch | `lab/beat-impeccable-4.0.4` |
| HEAD at round start | `15a7aa676e3cbef2b9ee21333fa5c5b2b2db09d4` |
| forked from | `feat/design-contract-v1` @ `2ca0278d796ff137fc5a218709f37c3255b5f96f` |
| alpha baseline below it | `release/v3-alpha` @ `00a5f35dd1f6918e04596ef40e80bd8b9db36750` |
| skill package | `skills/sitesmith-v3/` |

`15a7aa6` carries two fixes made before the round opened: `allowed-tools` now
permits the skill's own entry command, and the command is written literally
rather than with a `<skill>/` placeholder. Neither fix changed the observed
Haiku behaviour that prompted them. That is recorded in the commit message and
is not a finding of this round.

PR #4 and PR #5 are untouched by this branch and stay at the SHAs above.

## Impeccable

| what | value |
| --- | --- |
| release | 4.0.4 |
| annotated tag | `skill-v4.0.4` |
| tag object | `fb0942f57736841580a65088637f94da4a4ba87c` |
| commit | `9a949fb543d44cfb406f61bcab99d95d7f12cf1d` |
| local extract | `scratchpad/maaling/pbakaus-impeccable-fb0942f/` |

The local extract is the pin, not a copy of it. Verified by hashing each of the
four mechanism files as a git blob and comparing to the blob SHA the GitHub API
reports at commit `9a949fb`:

```
skill/scripts/concept-seed.mjs             78c13ebc98d2e06d2c6e7017e326c54eb6a8ba97
skill/scripts/lib/concept-catalog.mjs      fc5b66a46030c767b1f1f9987872f2d0dbd20341
skill/scripts/lib/composition-catalog.mjs  16378187eb2a434c61808d9911215af77af4b5ad
skill/reference/new-work.md                4a2265488295c94a7de1a7326047518646897387
```

Four of four match. Reproduce with:

```bash
git hash-object skill/scripts/concept-seed.mjs
gh api "repos/pbakaus/impeccable/contents/skill/scripts/concept-seed.mjs?ref=9a949fb543d44cfb406f61bcab99d95d7f12cf1d" -q .sha
```

## Toolchain

| what | value |
| --- | --- |
| node | v24.15.0 |
| playwright | 1.62.1 |
| platform | win32, Windows 11 Home 10.0.26200 |

## Model configuration

Recorded per run in each run's own record, never assumed from this file. Every
run states the resolved model ID and the effort setting that was actually
configured. Where the harness cannot set an effort level explicitly, the run
says so rather than naming a level it did not set.
