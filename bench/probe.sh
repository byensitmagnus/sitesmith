#!/bin/bash
# Mechanical isolation probe. Original work, MIT.
#
# NOT part of the generation image. It is bind-mounted read-only at /probe for the
# duration of a probe run and is absent from every generation container, because
# this file necessarily names the thing the control must never see.
#
# No model, no credential, no cost. Every check is a shell command whose exit status
# is the evidence, run in the same image, network, entrypoint and mount configuration
# as a real generation.
#
# ARM is "with" or "without". Emits one JSON object on the last line.

set -uo pipefail
ARM="${ARM:-without}"
ENDPOINT="${ENDPOINT:-api.anthropic.com}"
# The marker is passed in rather than written here, so this file can be scanned for
# leaks alongside everything else without matching itself.
MARK="${MARK:?MARK is required}"
BLOCKED_URL="${BLOCKED_URL:?BLOCKED_URL is required}"
HOST_PATH="${HOST_PATH:?HOST_PATH is required}"

pass=0; fail=0
declare -A R
check() { # name expected(ok|denied) cmd...
  local name="$1" expect="$2"; shift 2
  local out rc
  out="$("$@" 2>&1)"; rc=$?
  local got="ok"; [ $rc -ne 0 ] && got="denied"
  R[$name]="$got"
  if [ "$got" = "$expect" ]; then pass=$((pass+1))
  else fail=$((fail+1)); echo "FAIL $name expected=$expect got=$got :: ${out:0:200}" >&2; fi
}

# ── workspace ──────────────────────────────────────────────────────────────
check workspace_read   ok     test -r /work/BRIEF.md
check workspace_write  ok     bash -c 'echo ok > /work/.probe-write && grep -q ok /work/.probe-write'

# ── the host is not reachable ──────────────────────────────────────────────
check host_path        denied ls "$HOST_PATH"
check host_c_drive     denied ls /mnt/c
check host_repo_root   denied ls /repo

# ── a fresh home ───────────────────────────────────────────────────────────
check home_no_history  denied test -e /home/bench/.claude.json
check home_no_projects denied test -e /home/bench/.claude/projects
check home_no_todos    denied test -e /home/bench/.claude/todos

# ── the skill, per arm ─────────────────────────────────────────────────────
if [ "$ARM" = "with" ]; then
  check skill_present  ok     test -r "/home/bench/.claude/skills/${MARK}/SKILL.md"
  check skill_readonly denied touch "/home/bench/.claude/skills/${MARK}/.probe"
else
  check skill_absent   denied test -e "/home/bench/.claude/skills/${MARK}"
  # The whole readable filesystem, not just the workspace. /probe is this script and
  # the paths it was given, and is excluded because it is not present during a
  # generation. Kernel pseudo-filesystems are excluded because they are not files.
  check fs_no_marker   denied bash -c "grep -rIl --binary-files=without-match -e '${MARK}' \
      /work /home /opt /usr /etc /tmp /var /srv 2>/dev/null | grep -v '^/probe' | grep -q ."
  check env_no_marker  denied bash -c "env | grep -v '^MARK=' | grep -v '^BLOCKED_URL=' | grep -v '^HOST_PATH=' | grep -qi '${MARK}'"
fi

# ── network ────────────────────────────────────────────────────────────────
check direct_endpoint  denied curl -sS --noproxy '*' --max-time 8 "https://${ENDPOINT}/v1/models"
check direct_neutral   denied curl -sS --noproxy '*' --max-time 8 https://example.com
check direct_blocked   denied curl -sS --noproxy '*' --max-time 8 "$BLOCKED_URL"
check proxy_blocked    denied curl -sS --max-time 12 "$BLOCKED_URL"
check proxy_neutral    denied curl -sS --max-time 12 https://example.com
check proxy_subdomain  denied curl -sS --max-time 12 "https://evil.${ENDPOINT}/"
# 401 from the API is a successful connection; -f is deliberately not used.
check proxy_endpoint   ok     curl -sS --max-time 15 -o /dev/null "https://${ENDPOINT}/v1/models"

# ── inherited context ──────────────────────────────────────────────────────
check env_no_parent    denied bash -c "env | grep -qE '^(OLDPWD|CLAUDE_PROJECT_DIR|INIT_CWD|PWD_PARENT)='"
R[cwd]="$(pwd)"
check cwd_is_work      ok     bash -c 'test "$(pwd)" = /work'

verdict=$([ $fail -eq 0 ] && echo pass || echo fail)
{
  printf '{"arm":"%s","verdict":"%s","passed":%d,"failed":%d,"checks":{' "$ARM" "$verdict" "$pass" "$fail"
  sep=""
  for k in "${!R[@]}"; do printf '%s"%s":"%s"' "$sep" "$k" "${R[$k]}"; sep=","; done
  printf '}}\n'
}
[ $fail -eq 0 ]
