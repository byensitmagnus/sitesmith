#!/bin/bash
# Mechanical isolation probe. Original work, MIT.
#
# No model, no credential, no cost. Every check is a shell command whose exit status
# is the evidence, run in the same image, network, entrypoint and mount configuration
# as a real generation. The model's own account of what it could reach is a useful
# supplement and a worthless gate: a subject that reports on its own confinement can
# be wrong or agreeable, and a shell either connects or it does not.
#
# ARM is "with" or "without". Emits one JSON object on the last line.

set -uo pipefail
ARM="${ARM:-without}"
ENDPOINT="${ENDPOINT:-api.anthropic.com}"

pass=0
fail=0
declare -A R
check() { # name, expected(ok|denied), command...
  local name="$1" expect="$2"; shift 2
  local out rc
  out="$("$@" 2>&1)"; rc=$?
  local got="ok"; [ $rc -ne 0 ] && got="denied"
  if [ "$got" = "$expect" ]; then R[$name]="$got"; pass=$((pass+1));
  else R[$name]="$got"; fail=$((fail+1)); echo "FAIL $name expected=$expect got=$got :: ${out:0:160}" >&2; fi
}

# ── the workspace works ────────────────────────────────────────────────────
check workspace_read     ok     test -r /work/BRIEF.md
check workspace_write    ok     bash -c 'echo ok > /work/.probe-write && grep -q ok /work/.probe-write'

# ── the host is not reachable ──────────────────────────────────────────────
# The repository's real path on the host, and the WSL view of the same drive.
check host_path_win      denied ls '/mnt/c/Users/Usmo1/Documents/sitesmith'
check host_path_root     denied ls /repo
check host_c_drive       denied ls /mnt/c

# ── the mount table holds only what was asked for ──────────────────────────
# /work always; the skill only in treatment. Anything else bound from the host is
# a leak, so the count is asserted rather than eyeballed.
BINDS=$(awk '$2 ~ /^\/(work|home\/bench\/\.claude)/ {print $2}' /proc/mounts | sort -u | tr '\n' ',')
R[mounts]="$BINDS"
if [ "$ARM" = "with" ]; then
  check skill_present    ok     test -r /home/bench/.claude/skills/sitesmith/SKILL.md
  check skill_readonly   denied touch /home/bench/.claude/skills/sitesmith/.probe
else
  check skill_absent     denied test -e /home/bench/.claude/skills/sitesmith
  # Nothing anywhere in the control's filesystem may name the skill. grep the roots
  # a generation can actually reach rather than the whole disk.
  check no_skill_marker  denied bash -c "grep -rIl --exclude-dir=node_modules -e sitesmith /work /home/bench 2>/dev/null | grep -q ."
fi

# ── HOME is fresh ──────────────────────────────────────────────────────────
# Beyond the skill mount, the home directory must carry no prior session: no
# ~/.claude.json, no history, no projects from another run.
check home_no_history    denied test -e /home/bench/.claude.json
check home_no_projects   denied test -e /home/bench/.claude/projects
check home_no_todos      denied test -e /home/bench/.claude/todos

# ── the network ────────────────────────────────────────────────────────────
# Direct, ignoring the proxy: the network is --internal, so there is no route.
check direct_endpoint    denied curl -sS --noproxy '*' --max-time 8 "https://${ENDPOINT}/v1/models"
check direct_neutral     denied curl -sS --noproxy '*' --max-time 8 https://example.com
check direct_github      denied curl -sS --noproxy '*' --max-time 8 https://raw.githubusercontent.com/

# Through the proxy: only the exact endpoint is connectable. 403 from the proxy is a
# refusal at the CONNECT, so curl exits non-zero without ever reaching the host.
check proxy_github       denied curl -sS --max-time 12 https://raw.githubusercontent.com/byensitmagnus/sitesmith/main/skills/sitesmith/SKILL.md
check proxy_neutral      denied curl -sS --max-time 12 https://example.com
check proxy_subdomain    denied curl -sS --max-time 12 "https://evil.${ENDPOINT}/"
# The endpoint itself must connect, or the benchmark cannot run at all. 401 from the
# API is a successful connection; curl -f is deliberately not used.
check proxy_endpoint     ok     curl -sS --max-time 15 -o /dev/null "https://${ENDPOINT}/v1/models"

# ── no inherited context ───────────────────────────────────────────────────
check env_no_sitesmith   denied bash -c "env | grep -qi sitesmith"
check env_no_parent_cwd  denied bash -c "env | grep -qiE '^(OLDPWD|CLAUDE_PROJECT_DIR|INIT_CWD)='"
R[cwd]="$(pwd)"
check cwd_is_work        ok     bash -c 'test "$(pwd)" = /work'

# ── result ─────────────────────────────────────────────────────────────────
verdict=$([ $fail -eq 0 ] && echo pass || echo fail)
{
  printf '{"arm":"%s","verdict":"%s","passed":%d,"failed":%d,"checks":{' "$ARM" "$verdict" "$pass" "$fail"
  sep=""
  for k in "${!R[@]}"; do printf '%s"%s":"%s"' "$sep" "$k" "${R[$k]}"; sep=","; done
  printf '}}\n'
}
[ $fail -eq 0 ]
