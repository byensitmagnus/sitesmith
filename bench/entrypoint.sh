#!/bin/bash
# Container entrypoint. Original work, MIT.
#
# The credential arrives on stdin, as the first line, and nowhere else. It is never
# an argument, never an environment variable set by `docker run -e`, never a file,
# never an image layer. `docker inspect` on a running container shows the command
# and the environment; neither contains it.
#
# Usage: printf '%s\n' "$KEY" | docker run -i ... IMAGE '<shell command>'
# Omit the key line entirely for the unpaid mechanical probe.

set -uo pipefail

_S=""
if [ ! -t 0 ]; then
  # A single read, with a short timeout so the unpaid probe does not hang when no
  # credential is piped in.
  IFS= read -r -t 5 _S || true
fi

if [ -n "${_S}" ]; then
  export ANTHROPIC_API_KEY="${_S}"
fi
unset _S

# Anything the CLI would phone home about is off. The egress allowlist would block
# it anyway; turning it off as well means the benchmark is not measuring retries.
export DISABLE_TELEMETRY=1
export DISABLE_ERROR_REPORTING=1
export DISABLE_BUG_COMMAND=1
export DISABLE_AUTOUPDATER=1
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1

# The rest of stdin is closed to the child: the generation reads its brief from a
# file, and leaving the pipe open invites a stray read of whatever followed the key.
exec bash -lc "$*" < /dev/null
