# The generation environment. Original work, MIT.
#
# Identical for both arms. The only difference between control and treatment is a
# read-only mount added at run time, so the skill difference comes from the
# environment and never from the prompt.
#
# Nothing about sitesmith is baked in. No API key is baked in, ever: it arrives as
# an environment variable at run time and is never written to the image, the
# manifest or the logs.

FROM node:22-bookworm-slim

# Playwright's Chromium needs these; installing them here rather than at run time
# keeps the two arms byte-identical and keeps the container offline-capable.
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates fonts-dejavu-core fonts-liberation libnss3 libnspr4 \
      libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 \
      libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 \
      libatspi2.0-0 curl \
 && rm -rf /var/lib/apt/lists/*

ENV npm_config_update_notifier=false
RUN npm install -g @anthropic-ai/claude-code@latest \
 && npm cache clean --force

# Build tools both arms get. Pinned by the lockfile copied below so the dependency
# hash in the manifest means something.
WORKDIR /opt/tools
COPY tools-package.json package.json
COPY tools-package-lock.json package-lock.json
RUN npm ci --omit=dev \
 && npx playwright install chromium \
 && npm cache clean --force

# Unprivileged, and with a home that is not the workspace, so a skill mounted into
# the normal skill path is discovered exactly as it would be on a real machine.
RUN useradd -m -u 1001 bench && mkdir -p /home/bench/.claude/skills && chown -R bench /home/bench
USER bench
ENV HOME=/home/bench
ENV NODE_PATH=/opt/tools/node_modules
ENV PLAYWRIGHT_BROWSERS_PATH=/home/bench/.cache/ms-playwright

# Copied at build time so Chromium lives under the bench user.
USER root
RUN cp -r /root/.cache/ms-playwright /home/bench/.cache/ms-playwright 2>/dev/null || true \
 && chown -R bench /home/bench/.cache 2>/dev/null || true
USER bench

WORKDIR /work
ENTRYPOINT ["/bin/bash", "-lc"]
