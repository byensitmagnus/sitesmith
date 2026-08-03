# Production report, kiln watch desk

Built with `skills/sitesmith-v3`, surface `operate`, stack `static`.

Scenario: operate

## Files opened

- `skills/sitesmith-v3/SKILL.md`
- `skills/sitesmith-v3/run.md`
- `skills/sitesmith-v3/floor/operate.md`
- `skills/sitesmith-v3/stacks/static.md`

## Where the facts came from

Band limits, draught figures, charge times and the watch log are the works' own. What is
deliberately absent: production targets, shift rosters and any per-person history, because
the watch desk does not keep them.

## Run notes

- viewports: 375, 768 and 1440 all rendered, none skipped
- axe both schemes: ran in light and dark
- live server: a local static server, not a file:// URL
- anti-slop linter: `gate.mjs` ran over this directory with a browser present
- fallbacks: none taken

## Mechanical findings

- action-contrast-dark: the commit blue failed AA at 12px in the dark scheme
- state-by-colour: status carried by colour alone was rejected before it was built
- log-order: an action had to appear in the log and in the status line, not only in the panel

## Reconciliation

- action-contrast-dark: confirmed at 3.91:1, fixed by darkening the action blue until it clears AA in both schemes at the size it is actually used
- state-by-colour: missed-by-the-model in the first sketch and caught by the direction record before any code, so every state is a bordered word and the colour is redundant
- log-order: confirmed, fixed. Every action writes a log line and speaks in role="status", because an operator who looked away has to be able to see what they did

Nothing on this list is still open.
