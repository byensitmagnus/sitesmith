# Running the isolated benchmark

Two gates stand between here and the eighteen paid generations. The first costs nothing
and never touches a model. The second costs two short calls. Neither can be skipped.

---

## 1. Install Docker Desktop — about 15 minutes

<https://www.docker.com/products/docker-desktop/> · install · start · wait for the whale
icon to stop animating.

```bash
docker info --format "{{.ServerVersion}}"
```

## 2. Build, start, prove — about 10 minutes, no spend

```bash
node tools/bench-container.mjs build && node tools/bench-container.mjs up && node tools/bench-container.mjs probe
```

`build` writes `bench/image.lock.json`. **Commit it.** It pins the base image by digest, so
every later build is the same image rather than a similar one.

`probe` must print **PASS**. It runs no model and needs no key.

---

## The key

You are never asked to store it. There is no `setx`, no `.env`, no file, no shell profile
line. The runner prompts for it at the moment it is needed, with the input hidden, holds it
in memory and pipes it to the container's standard input as a single line.

It is therefore not an argument, not a `docker run -e` variable, not a file and not an image
layer, which is why `docker inspect` on a running container cannot show it. It is never
written to a log or a manifest; the manifest records only that a credential was supplied.

Two commands ask for it: `discovery` (two short calls) and `run-all` (asks once, for all
eighteen).

## Gate one: the mechanical probe — unpaid

Shell commands in the same image, network, entrypoint and mount configuration a real
generation uses. The model's own account of its confinement is a supplement, not the gate: a
subject reporting on its own cage can be wrong or agreeable, and a shell either connects or
it does not.

| Check | Must be |
| --- | --- |
| workspace read, write | works |
| the host repository path, `/mnt/c`, `/repo` | denied |
| bind mounts, read from the daemon | exactly `/work`, plus the skill in the treatment arm |
| `~/.claude.json`, `projects`, `todos` | absent |
| a direct connection that ignores the proxy | denied — the network is `--internal` |
| `raw.githubusercontent.com` through the proxy | denied |
| `example.com` through the proxy | denied |
| `evil.api.anthropic.com` through the proxy | denied — exact host matching |
| `api.anthropic.com` through the proxy | connects |
| control: any file anywhere naming the skill | absent |
| control: any environment variable naming it | absent |
| treatment: the skill present and read-only | yes |

The probe script is not in the image. It necessarily names the thing the control must never
see, so it is bind-mounted at `/probe` for the duration of a probe run and is absent from
every generation container.

## Gate two: skill discovery — paid, two short calls

```bash
node tools/bench-container.mjs discovery
```

Asks each arm to list its own skills and reads the CLI's debug output. A readable mount is
not the same as a loaded skill, and this is the only thing that tells them apart. Treatment
must name it; control must not. Both must exit 0 and return the exact model id.

## Then

```bash
node tools/bench-container.mjs preflight
```

Lists the eighteen runs, the pinned image, base digest, CLI version, model, skill commit,
timeout, turn cap and budget, and refuses if anything drifted since the gates. Spends
nothing.

A green gate is bound to a fingerprint: runner hash, Dockerfile hash, entrypoint hash, probe
hash, proxy hash, dependency lock, base digest, image id, CLI version, allowlist, model,
skill commit, skill payload hash and prompt hash. Change one and the runner rejects the old
verdict rather than trusting it.

## The runs

```bash
node tools/bench-container.mjs run-all
```

Asks for the key once and runs exactly eighteen. Each run is capped at 45 minutes, 220 turns
and $12; the benchmark is capped at $160. A run is data only if the CLI exits 0, the JSON
parses, `is_error` is false, the returned model id matches exactly, the observed bind mounts
match exactly, and `site/` is not empty. Anything else lands under `INVALID-*` and the whole
benchmark stops there rather than continuing with a hole in it.

## Afterwards

```bash
node tools/bench-container.mjs down
```

Removes the benchmark network and its proxy, and nothing else.

Measurement runs on the host, after generation. The generation environment never measures
itself.
