import { defineConfig } from 'astro/config';

export default defineConfig({
  // Relative asset paths, so the build can be read from disk as well as served.
  // The gate is still pointed at a served build with --url: a production build read
  // through file:// cannot load a stylesheet Astro emits at an absolute path, and the
  // gate now withholds rather than judging an unstyled document.
  build: { assets: '_astro' },
});
