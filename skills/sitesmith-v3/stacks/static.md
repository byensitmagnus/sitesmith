---
title: Static HTML and CSS, no build step
read: at run order step 3, after stack detection, before the first file is written
---

**A sufficient stack, and its four conditions.** Something renders HTML, styles are
authored in one system, there is a way to serve the pages while you work, and there is
an output you can copy to a host. Here the first two are the files themselves and the
last two are a local static server and the directory. Do not add beyond this without
being asked. Serve the scaffold and open it before you write a line of design code, so
that a stack failure arrives as one instead of as a design failure later. Every addition
is a dependency someone has to maintain. If CSS can do it, use CSS.

**Never install a paid or key-gated service as part of setup.** If a component source or
asset API needs an account, name it as an option and let the user decide. Do not ask
for, store, or write API keys into config on the user's behalf.

**A named system is installed, a named aesthetic is built.** If the brief names a real
design system (Fluent, Material, Carbon, GOV.UK, Bootstrap), install the official
package and use its own components rather than approximating one by hand, and never mix
two in one project. Confirm the package name and current version against the registry at
build time rather than trusting a name written here. If the brief names an aesthetic
instead (bento, brutalism, glassmorphism, Liquid Glass), there is no package to install
and none to claim: build it natively.

**Anything generated or vendored is restyled from the direction's own token layer before
it ships.** At default styling it is the vendor's design, and it is the same design on
every site that installed it.

**Specificity is the bug this stack actually produces.** You are writing the cascade by
hand, so a type selector like `.section` and an element-scoped selector like `.cta`
against the same element cancel each other out, and the symptom is a rule that reads
correctly in the file and does nothing on screen. Keep one class per concern, and when a
value does not take, read the computed style in the browser rather than re-reading the
stylesheet.

**Count rather than judge.** At any decision point, count the visible interactive
options, the top-level nav entries, and the competing same-weight elements: four or
fewer is manageable, five to seven is the boundary, eight or more is overloaded.
