# Blocks — reference contract

The token set the blocks in this folder read from. A project substitutes its own values;
the **names** are the interface. Format:
[`references/12-design-system.md`](../references/12-design-system.md).

These values are deliberately neutral. They exist so the blocks can be rendered and checked
on their own, not as a recommended palette — a project that ships this grey has not chosen
a direction.

```css contract
:root{
  --step:8px;
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-5:24px; --space-6:32px; --space-7:48px; --space-8:64px; --space-9:96px;

  --text-micro:0.75rem; --text-small:0.875rem; --text-body:1rem;
  --text-lead:1.125rem; --text-h3:1.25rem; --text-h2:1.5rem;
  --text-h1:2rem; --text-display:2.75rem;
  --leading-tight:1.2; --leading-body:1.55;
  --measure:66ch;

  --radius-inner:4px; --radius-outer:10px; --radius-full:999px;

  --elev-0:none;
  --elev-1:0 1px 2px rgb(0 0 0 / .07);
  --elev-2:0 10px 30px rgb(0 0 0 / .12);

  --container:1120px; --gutter:24px; --grid-columns:12;

  --bg:#f7f7f6; --surface:#ffffff; --surface-2:#eeeeec;
  --line:#dcdcd8; --line-2:#c2c2bc;
  --ink:#17181a; --ink-2:#54585e; --ink-3:#666a70;
  --accent:#1f5f4b; --on-accent:#ffffff; --accent-soft:#e2f0ea;
  --ok:#1c6238; --ok-soft:#e4f2e9;
  --warn:#7a4b00; --warn-soft:#fbf1dd;
  --bad:#a4231c; --bad-soft:#fbe9e7;

  --font-display:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
  --font-body:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
  --font-mono:ui-monospace,'Cascadia Mono','SF Mono','Segoe UI Mono',monospace;

  --motion-fast:120ms; --motion-base:200ms; --motion-slow:320ms;
  --ease:cubic-bezier(.2,.6,.2,1);
}
@media (prefers-color-scheme:dark){
  :root{
    --bg:#121316; --surface:#1a1c1f; --surface-2:#212429;
    --line:#2b2f35; --line-2:#3c414a;
    --ink:#e9eaec; --ink-2:#a8adb5; --ink-3:#979ca4;
    --accent:#63c6a2; --on-accent:#101512; --accent-soft:#122a22;
    --ok:#63c68e; --ok-soft:#0f2a1c;
    --warn:#e0b062; --warn-soft:#2b2214;
    --bad:#ff8b81; --bad-soft:#2e1614;
  }
}
```

## Components

**Focus.** One treatment everywhere: `2px solid var(--accent)`, `outline-offset: 2px`,
`border-radius: var(--radius-inner)`. Learned once, recognised everywhere.

**Buttons.** Primary fills `--accent` with `--on-accent`. Secondary is `--surface` on
`--line-2`. Both use `--radius-inner`, `--space-2`/`--space-4` padding, and shift
`translateY(1px)` on active. Disabled is opacity .45 with no transform.

**Motion.** Colour and border transitions use `--motion-fast`. Nothing on this page moves on
scroll.

## Voice

Sentence case. Second person. Numbers are tabular where they are compared.
