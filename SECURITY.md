# Security

## Scope

sitesmith is a set of markdown instructions, CSV datasets and two scripts. It has no server, no
network calls and no credential handling. The realistic risks are narrow but real:

| Risk | Where |
| --- | --- |
| Prompt injection via reference content | An agent reads these files as instructions. Malicious text merged here would execute against every user's project |
| Arbitrary code execution | `scripts/verify.mjs` launches a browser; `scripts/search.py` reads local CSVs |
| Supply chain | `playwright` and `@axe-core/playwright` are optional peer dependencies |
| Navigation to untrusted origins | `verify.mjs` visits whatever URL you pass and follows same-origin links |

## Reporting

Open a [private security advisory](https://github.com/byensitmagnus/sitesmith/security/advisories/new).
Do not open a public issue for anything exploitable.

Expect a first reply within seven days. There is no bounty — this is an unfunded open-source project.

## What we consider a vulnerability

- Text in any bundled file that would cause an agent to take an action the user did not ask for —
  exfiltrating files, writing outside the project, installing packages, contacting a network host.
- Command injection in `verify.mjs` or `search.py` through arguments, URLs or file contents.
- A path in either script that writes outside its `--out` directory.

## What we don't

- The skill instructing an agent to write files in the user's own project. That is the purpose.
- `verify.mjs` loading a page you explicitly pointed it at.
- Vulnerabilities in `playwright` or Chromium. Report those upstream.

## Using it safely

- `verify.mjs` only against origins you control. It executes page JavaScript and follows links.
- Review a fork's diff before installing it. A skill is instructions to an agent with file access,
  so treat an untrusted fork the way you would treat an untrusted script.
- `search.py` reads only the CSVs in `data/` and takes no network input.
