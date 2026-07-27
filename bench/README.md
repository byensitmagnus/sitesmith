# Running the isolated benchmark

Three steps. About 25 minutes, most of it Docker downloading.

Nothing here is run until the probe passes. The probe is cheap; the eighteen
generations are not.

---

## 1. Install Docker Desktop — about 15 minutes

Download from <https://www.docker.com/products/docker-desktop/>, install, and start it.
Wait until the whale icon in the tray stops animating.

Check it is up:

```bash
docker info --format "{{.ServerVersion}}"
```

A version number means ready. An error means Docker Desktop has not finished starting.

## 2. Add the API key — about 2 minutes

Get a key at <https://console.anthropic.com/settings/keys>.

Set it as a **user** environment variable so it lives in your account and not in this
repository:

```bash
setx ANTHROPIC_API_KEY "sk-ant-..."
```

Then **close this terminal and open a new one** — `setx` only affects new sessions.

Confirm it is visible without printing it:

```bash
node -e "console.log(process.env.ANTHROPIC_API_KEY ? 'key present' : 'NOT SET')"
```

**The key never enters this repository.** It is not written to the image, the manifests,
the logs or any committed file. The runner passes it to the container by reference at run
time, and the manifest records only whether one was present.

## 3. Build, start and probe — about 8 minutes

```bash
node tools/bench-container.mjs build
```
```bash
node tools/bench-container.mjs up
```
```bash
node tools/bench-container.mjs probe
```

The probe must print **PASS**. It runs one throwaway generation in each arm and checks:

| | must be |
| --- | --- |
| workspace read and write | works |
| local absolute path to the repo | denied |
| `raw.githubusercontent.com/.../sitesmith` | denied |
| any other internet host | denied |
| inherited context, prompt or parent directory | none |
| skill mounted in treatment | yes, and read-only |

A **FAIL** stops there. Do not run the generations on a failed probe: the result would
not be evidence, and the runner refuses anyway — `run` reads
`benchmarks/v2/isolation-probe.json` and will not start without a pass.

---

## What makes it isolated

- **Fresh container per run.** No inherited conversation, agent context or working
  directory.
- **`docker network create --internal`.** The generation containers have no route off the
  host at all.
- **One egress proxy**, the only container on both networks, allowlisting the model
  endpoint. `github.com` is not on the list, so "the control cannot fetch the public
  repository" is a fact about the network rather than a line in a prompt.
- **Mounts are the only difference.** Control gets the workspace. Treatment gets the same
  workspace plus the skill, read-only, at `~/.claude/skills/sitesmith` — the path a real
  installation uses.
- **Identical prompt.** Both arms are given the same words, and the prompt does not
  mention that a skill exists. Telling a control not to look at something tells it where
  to look.

## Afterwards

```bash
node tools/bench-container.mjs down
```

Measurement runs on the host, after generation, against the collected sites. The
generation environment never measures itself.
