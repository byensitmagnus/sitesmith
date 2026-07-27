#!/usr/bin/env node
/**
 * The only way out of the generation network. Original work, MIT.
 *
 * The generation containers sit on a Docker network created with `--internal`,
 * which gives them no route off the host at all. This proxy is the single
 * container attached to both that network and a normal one, so every byte the
 * generation makes must pass through here — and only hosts on the allowlist are
 * connected.
 *
 * That is what makes "the control cannot fetch the public repository" a fact about
 * the network rather than a promise in a prompt. github.com and
 * raw.githubusercontent.com are not on the list and cannot be added by the
 * container, which has no write access to this file.
 *
 * ALLOW is a comma-separated host list, defaulting to the model endpoint only.
 */

import { createServer } from 'node:http';
import { connect } from 'node:net';

const PORT = Number(process.env.PORT ?? 8888);
const ALLOW = (process.env.ALLOW ?? 'api.anthropic.com')
  .split(',')
  .map((h) => h.trim().toLowerCase())
  .filter(Boolean);

const permitted = (host) => {
  const h = host.toLowerCase().replace(/:\d+$/, '');
  // Exact host or a subdomain of an allowed host. No wildcards, no regex: a
  // permissive matcher here would quietly undo the whole isolation claim.
  return ALLOW.some((a) => h === a || h.endsWith('.' + a));
};

const log = (verdict, host) =>
  console.log(`${new Date().toISOString()} ${verdict.padEnd(7)} ${host}`);

const server = createServer((req, res) => {
  // Plain HTTP is refused outright. Everything the runner needs is HTTPS, and
  // allowing cleartext would leave a channel that is harder to reason about.
  log('refused', `http ${req.headers.host ?? '?'}`);
  res.writeHead(403, { 'content-type': 'text/plain' });
  res.end('egress: plain HTTP is not permitted\n');
});

server.on('connect', (req, clientSocket, head) => {
  const [host, port = '443'] = String(req.url).split(':');
  if (!permitted(host) || port !== '443') {
    log('BLOCKED', `${host}:${port}`);
    clientSocket.write('HTTP/1.1 403 Forbidden\r\n\r\negress: host not on allowlist\r\n');
    clientSocket.destroy();
    return;
  }
  log('allowed', `${host}:${port}`);
  const upstream = connect(Number(port), host, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    upstream.write(head);
    upstream.pipe(clientSocket);
    clientSocket.pipe(upstream);
  });
  const bail = () => {
    upstream.destroy();
    clientSocket.destroy();
  };
  upstream.on('error', bail);
  clientSocket.on('error', bail);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`egress proxy on ${PORT}; allowlist: ${ALLOW.join(', ')}`);
});
