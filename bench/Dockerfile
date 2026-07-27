# The generation environment. Original work, MIT.
#
# Identical for both arms. The only difference between control and treatment is a
# read-only mount added at run time, so the skill difference comes from the
# environment and never from the prompt.
#
# Everything is pinned, and pinning the base image alone was not enough:
#
#   the base image      by digest, passed in from the committed base lock
#   the Debian packages by snapshot.debian.org at a fixed timestamp, because
#                       deb.debian.org is a moving target and apt-get would
#                       otherwise install whatever it serves that morning
#   the CLI             by version AND by verifying the tarball's sha512 against the
#                       integrity hash recorded in the lock, before installing it
#   the build tools     by a committed lockfile
#
# No credential is ever baked in — it arrives on stdin at run time, which is why the
# entrypoint reads before it execs.

ARG BASE_DIGEST
FROM node:22-bookworm-slim@${BASE_DIGEST}

# Frozen Debian archive. Check-Valid-Until is off because a snapshot's Release file is
# deliberately old; that is the entire point of using one.
ARG DEBIAN_SNAPSHOT
RUN rm -f /etc/apt/sources.list /etc/apt/sources.list.d/*.sources /etc/apt/sources.list.d/*.list \
 && printf 'deb http://snapshot.debian.org/archive/debian/%s bookworm main\ndeb http://snapshot.debian.org/archive/debian-security/%s bookworm-security main\ndeb http://snapshot.debian.org/archive/debian/%s bookworm-updates main\n' \
      "${DEBIAN_SNAPSHOT}" "${DEBIAN_SNAPSHOT}" "${DEBIAN_SNAPSHOT}" > /etc/apt/sources.list \
 && printf 'Acquire::Check-Valid-Until "false";\nAcquire::Retries "8";\nAcquire::http::Timeout "120";\n' \
      > /etc/apt/apt.conf.d/99snapshot

RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates fonts-dejavu-core fonts-liberation libnss3 libnspr4 \
      libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 \
      libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 \
      libatspi2.0-0 curl \
 && rm -rf /var/lib/apt/lists/*

# What actually got installed, recorded inside the image. `build` reads this back out
# and hashes it into the fingerprint, so a snapshot that somehow moved shows up as
# drift instead of passing silently.
RUN dpkg-query -W -f='${Package}=${Version}\n' | sort > /opt/apt-manifest.txt

ENV npm_config_update_notifier=false
ARG CLAUDE_VERSION
ARG CLAUDE_INTEGRITY
RUN npm pack "@anthropic-ai/claude-code@${CLAUDE_VERSION}" --pack-destination /tmp > /dev/null \
 && TARBALL="$(ls /tmp/anthropic-ai-claude-code-*.tgz)" \
 && node -e 'const c=require("crypto"),f=require("fs");const got="sha512-"+c.createHash("sha512").update(f.readFileSync(process.argv[1])).digest("base64");if(got!==process.argv[2]){console.error("tarball integrity mismatch");console.error("want "+process.argv[2]);console.error("got  "+got);process.exit(1)}console.log("tarball integrity verified");' "$TARBALL" "${CLAUDE_INTEGRITY}" \
 && npm install -g "$TARBALL" \
 && rm -f "$TARBALL" && npm cache clean --force

# The per-run spend cap is handed to the CLI itself. If this build of the CLI cannot
# take it the cap would be advisory, so the build fails here rather than letting the
# benchmark discover it after the money is gone.
RUN node -e 'const s=require("child_process").execSync("claude --help",{encoding:"utf8"});if(!s.includes("--max-budget-usd")){console.error("this CLI has no --max-budget-usd, so a spend cap cannot be enforced in-process");process.exit(1)}console.log("hard budget flag present");'

WORKDIR /opt/tools
COPY tools-package.json package.json
COPY tools-package-lock.json package-lock.json
RUN npm ci --omit=dev && npm cache clean --force

RUN useradd -m -u 1001 bench \
 && mkdir -p /home/bench/.claude/skills \
 && chown -R bench /home/bench
ENV PLAYWRIGHT_BROWSERS_PATH=/opt/pw
RUN mkdir -p /opt/pw && npx playwright install chromium && chmod -R a+rX /opt/pw

# probe.sh is deliberately NOT copied in. It names the thing the control must never
# see, so baking it into the generation image would put the marker and a URL to the
# public repository inside every control container. It is bind-mounted at /probe for
# the duration of a probe run and is absent from every generation.
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod 0555 /usr/local/bin/entrypoint.sh

USER bench
ENV HOME=/home/bench
ENV NODE_PATH=/opt/tools/node_modules
WORKDIR /work

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
