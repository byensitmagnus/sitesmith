# SiteSmith distributions

`skills/sitesmith-v3/` is the only canonical source for SiteSmith v3.

Build the distributable archives with Node 20:

```bash
node tools/package-sitesmith-v3.mjs
```

The command creates:

- `dist/sitesmith-v3.zip` — the complete source package, including package tests.
- `dist/sitesmith-install.zip` — the user-facing install package, rooted at `sitesmith/` and excluding package-only tests.
- `dist/SHA256SUMS` — SHA-256 integrity hashes for both archives.

The archives are deliberately generated rather than edited or assembled by hand. Their file order, timestamps and compression method are fixed, so the same canonical source produces the same hashes on every supported machine.

GitHub Actions runs `.github/workflows/package-v3.yml` whenever the canonical source or packager changes. It unpacks both archives, compares the full archive to `skills/sitesmith-v3/`, verifies that the install archive excludes tests, rebuilds the files a second time, checks deterministic hashes and uploads the three outputs as the `sitesmith-v3-zips` workflow artifact.

Do not edit generated ZIP files directly. Change `skills/sitesmith-v3/`, run the package command, and let the hashes prove what was shipped.
