---
title: WordPress, block theme or classic child theme
read: at run order step 4, after stack detection, before the first file is written
---

**Decide which WordPress this is first.** `theme.json` with a `templates/` directory of
HTML files is a block theme and the site editor owns layout. `style.css` with a
`Template:` header and PHP templates is a classic child theme and PHP owns layout. Say
which in the plan; everything below forks there.

**Tokens live in `theme.json`** on a block theme: `settings.color.palette`,
`settings.typography`, `settings.spacing`. WordPress compiles them into
`--wp--preset--*` properties and preset classes, in the editor as well as the page. Put a
value in a stylesheet instead and the editor goes on offering its own, so the client meets
the mismatch, not you. An `!important` aimed at the preset output means the value is in
the wrong file. A classic child theme has no such layer; your stylesheet is it.

**Routes come from the database, not the filesystem.** A page is a row and the hierarchy
picks what renders it: `templates/*.html` and `parts/*.html` on a block theme,
`front-page.php` and `page-{slug}.php` in the child on a classic one. A new route is new
content, so never write to the database from a build step; report the missing page
instead. Never edit a parent theme or plugin, because the next update deletes it.

**Fonts are registered, not linked.** Block theme: declare the face under
`fontFamilies[].fontFace` in `theme.json`, `src` inside the theme, so the editor loads it
too. Classic: `wp_enqueue_style` from the child's `functions.php` on
`wp_enqueue_scripts`. Self-host and preload the face above the fold; an `@import` queues
it behind the CSS and the shift lands after paint. Enqueue every asset that way, versioned
from `filemtime`, or an optimisation plugin reorders and strips what you hand-wrote into a
template.

**Verify has no dev server of its own.** PHP and a database must already run, so use the
project's own: `wp-env start` on port 8888, DDEV, Local or a staging origin. Pass it to
`scripts/verify.mjs`. Confirm the theme you edited is active, and run its asset build
first, because the enqueued file is the built file.

**WooCommerce overrides go stale silently.** An override is a copy of the plugin's
template into `woocommerce/` in the child, frozen at the version copied. Record the path
and that version in `.sitesmith/direction.md`: a Woo update changes the original while
your copy still renders the old markup, usually at checkout. Prefer a hook, and never
override cart or checkout for appearance alone.

**Two more, only here.** A caching plugin serves the previous stylesheet after you edit
it, which reads as a rule not applying, so purge before you diagnose. And block markup
hand-edited past its comment delimiters is marked invalid, so the editor discards it the
next time the client saves.
