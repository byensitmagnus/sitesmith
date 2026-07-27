# The generation environment. Original work, MIT.
#
# Identical for both arms. The only difference between control and treatment is a
# read-only mount added at run time, so the skill difference comes from the
# environment and never from the prompt.
#
# Everything is pinned: the base image by digest, the CLI by exact version, the
# build tools by lockfile. No credential is ever baked in — it arrives on stdin at
# run time, which is why the entrypoint reads before it execs.

ARG BASE_DIGEST
FROM node:22-bookworm-slim@${BASE_DIGEST}

RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates fonts-dejavu-core fonts-liberation libnss3 libnspr4 \
      libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 \
      libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 \
      libatspi2.0-0 curl \
 && rm -rf /var/lib/apt/lists/*

ENV npm_config_update_notifier=false
ARG CLAUDE_VERSION
RUN npm install -g "@anthropic-ai/claude-code@${CLAUDE_VERSION}" && npm cache clean --force

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
