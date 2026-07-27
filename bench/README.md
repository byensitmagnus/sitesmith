# Running the isolated benchmark

Two commands from you. The gate that decides whether the eighteen paid generations
may start costs nothing and never touches the model.

---

## 1. Install Docker Desktop — about 15 minutes

<https://www.docker.com/products/docker-desktop/> · install · start · wait for the whale
icon to stop animating.

```bash
docker info --format "{{.ServerVersion}}"
```

## 2. Build, start and prove — about 10 minutes, no spend

```bash
node tools/bench-container.mjs build && node tools/bench-container.mjs up && node tools/bench-container.mjs probe
```

The probe must print **PASS**. It runs no model and needs no key.

---

## The key

**You are never asked to store it.** There is no `setx`, no `.env`, no file. The runner
prompts for it at the moment it is needed, with the input hidden, holds it in memory and
pipes it to the container's standard input as a single line.

It is therefore not an argument, not a `docker run -e` variable, not a file and not an
image layer, which means `docker inspect` on a running container cannot show it. It is
never written to a log or a manifest; the manifest records only that a credential was
supplied.

Only two commands ask for it: `probe-model` (optional, one short call per arm) and `run`.

## What the mechanical probe checks

Shell commands in the same image, network, entrypoint and mounts a real generation uses.
The model's own account of its confinement is kept as a supplement and is not the gate: a
subject reporting on its own cage can be wrong or agreeable, and a shell either connects
or it does not.

| Check | Must be |
| --- | --- |
| workspace read, write | works |
| `/mnt/c/Users/.../sitesmith`, `/mnt/c`, `/repo` | denied |
| mount table beyond `/work` and the skill | empty |
| `~/.claude.json`, `projects`, `todos` | absent |
| direct connection ignoring the proxy | denied — the network is `--internal` |
| `raw.githubusercontent.com` through the proxy | denied |
| `example.com` through the proxy | denied |
| `evil.api.anthropic.com` through the proxy | denied — exact host matching |
| `api.anthropic.com` through the proxy | connects |
| env naming sitesmith, `OLDPWD`, `CLAUDE_PROJECT_DIR` | absent |
| control: any file naming the skill | absent |
| treatment: skill present at `~/.claude/skills/sitesmith` | yes, and read-only |

## Optional, paid, one short call per arm

```bash
node tools/bench-container.mjs probe-model
```

Proves through the CLI's own debug output that treatment loads the skill and control never
sees it. A readable mount is not the same as a loaded skill.

## Then

```bash
node tools/bench-container.mjs preflight
```

Lists the eighteen runs, the pinned image, base digest, CLI version, model, skill commit,
timeout and turn cap, and refuses if anything drifted since the probe. Spends nothing.

A green probe is bound to a fingerprint: runner hash, Dockerfile hash, entrypoint hash,
probe hash, proxy hash, dependency lock, base digest, image id, CLI version, allowlist,
model, skill commit, skill payload hash and prompt hash. Change one and `run` rejects the
old verdict rather than trusting it.

## Afterwards

```bash
node tools/bench-container.mjs down
```

Measurement runs on the host, after generation. The generation environment never measures
itself.
