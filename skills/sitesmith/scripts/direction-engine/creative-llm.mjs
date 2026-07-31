/**
 * Optional LLM creative pass for direction packets.
 * Pluggable provider; default xAI when API key present.
 * Always runs through evidence-guard. Original work, MIT.
 */

import { guardCreativePacket, packetFromCard } from './evidence-guard.mjs';
import { ensureCreativeEnv } from './load-local-env.mjs';

const PACKET_KEYS = [
  'designThesis',
  'subjectGrounding',
  'composition',
  'informationHierarchy',
  'typography',
  'colourAndMaterialModel',
  'imageryAndAssetStrategy',
  'interactionConcept',
  'signatureElement',
  'primaryRisk',
  'implementationGuidance',
  'unknowns',
];

function buildPrompt(input, skeleton) {
  return `You are a design director. Produce ONE direction packet as pure JSON.

RULES:
- Use ONLY facts from the pack below. Do not invent testimonials, awards, ratings, free shipping, logos, KPIs, or image files not listed.
- Prefer a bold, specific thesis and a named signature element (like a control or mark), not generic SaaS.
- Honour anti-references and asset constraints.
- unknowns must list genuine unknowns, not invent fillers.

PACK:
--- BRIEF ---
${input.brief}

--- EVIDENCE ---
${input.evidence}

--- BRAND ---
${input.brand || '(none)'}

--- ASSET PLAN ---
${input.assetPlan || '(none)'}

--- ASSET MANIFEST ---
${input.assetManifest || '(none)'}

--- CONSTRAINTS ---
${input.userConstraints || '(none)'}

SKELETON (structure from SiteSmith engine — improve prose, do not ignore constraints):
${JSON.stringify(skeleton, null, 2)}

Return ONLY a JSON object with exactly these keys:
${PACKET_KEYS.join(', ')}
All values strings.`;
}

function extractJson(text) {
  const raw = String(text ?? '').trim();
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fence ? fence[1].trim() : raw;
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('no JSON object in model output');
  return JSON.parse(body.slice(start, end + 1));
}

function resolveApiKey(apiKey) {
  ensureCreativeEnv();
  return (apiKey || process.env.XAI_API_KEY || process.env.GROK_API_KEY || '').trim();
}

function classifyProviderError(err, status) {
  if (err?.code === 'NO_API_KEY') return err;
  if (err?.name === 'AbortError') {
    const e = new Error('xAI request timed out');
    e.code = 'TIMEOUT';
    return e;
  }
  if (status === 401 || status === 403) {
    const e = new Error(`xAI auth failed (HTTP ${status})`);
    e.code = 'AUTH';
    return e;
  }
  if (status === 429) {
    const e = new Error('xAI rate limited (HTTP 429)');
    e.code = 'RATE_LIMIT';
    return e;
  }
  if (status && status >= 500) {
    const e = new Error(`xAI server error (HTTP ${status})`);
    e.code = 'SERVER';
    return e;
  }
  return err;
}

/** Default xAI chat provider — one retry on 429/5xx; fail-closed codes on auth/timeout/no-key. */
export async function xaiChatProvider({ prompt, model, apiKey, timeoutMs = 90000, maxAttempts = 2 }) {
  const key = resolveApiKey(apiKey);
  if (!key) {
    const err = new Error('XAI_API_KEY / GROK_API_KEY not set');
    err.code = 'NO_API_KEY';
    throw err;
  }
  const chosenModel = model || process.env.SITESMITH_CREATIVE_MODEL || 'grok-4-fast-reasoning';
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: chosenModel,
          temperature: 0.7,
          messages: [
            { role: 'system', content: 'You output only valid JSON direction packets. No markdown prose outside JSON.' },
            { role: 'user', content: prompt },
          ],
        }),
        signal: ctrl.signal,
      });
      if (!res.ok) {
        const text = await res.text();
        const err = classifyProviderError(
          new Error(`xAI HTTP ${res.status}: ${text.slice(0, 400)}`),
          res.status,
        );
        err.status = res.status;
        // Retry only transient failures
        if ((res.status === 429 || res.status >= 500) && attempt < maxAttempts) {
          lastErr = err;
          await new Promise((r) => setTimeout(r, 400 * attempt));
          continue;
        }
        throw err;
      }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        const err = new Error('empty model content');
        err.code = 'EMPTY';
        throw err;
      }
      return { text: content, model: data.model || chosenModel, usage: data.usage ?? null };
    } catch (err) {
      if (err?.name === 'AbortError') throw classifyProviderError(err);
      if (err?.code === 'NO_API_KEY' || err?.code === 'AUTH' || err?.code === 'EMPTY') throw err;
      lastErr = err;
      if (attempt >= maxAttempts) throw err;
      await new Promise((r) => setTimeout(r, 400 * attempt));
    } finally {
      clearTimeout(t);
    }
  }
  throw lastErr || new Error('xAI provider failed');
}

/**
 * @param {object} opts
 * @param {object} opts.input validated input
 * @param {object} opts.card selected engine card
 * @param {'off'|'rules'|'llm'} opts.mode
 * @param {function} [opts.provider] async ({prompt}) => ({text, model})
 * @param {boolean} [opts.fallbackToRules=true]
 */
export async function runCreativePass(opts) {
  const {
    input,
    card,
    mode = 'rules',
    provider = xaiChatProvider,
    fallbackToRules = true,
    model,
  } = opts;

  const skeleton = packetFromCard(card, input, { creativePass: 'skeleton' });
  const base = {
    skeleton,
    mode,
    llmAttempted: false,
    llmSucceeded: false,
    guard: null,
    packet: skeleton,
    card,
  };

  if (mode === 'off') {
    return { ...base, packet: packetFromCard(card, input, { creativePass: 'off' }) };
  }

  // Rules path always available as baseline
  const rulesPacket = packetFromCard(card, input, { creativePass: 'rules' });
  const rulesGuard = guardCreativePacket(rulesPacket, input);
  if (!rulesGuard.ok && mode === 'rules') {
    return {
      ...base,
      packet: rulesPacket,
      guard: rulesGuard,
      llmSucceeded: false,
      problems: rulesGuard.problems,
    };
  }

  if (mode !== 'llm') {
    return {
      ...base,
      packet: rulesPacket,
      guard: rulesGuard.ok ? { ok: true, problems: [] } : rulesGuard,
      card,
    };
  }

  // LLM path
  base.llmAttempted = true;
  try {
    const prompt = buildPrompt(input, skeleton);
    const result = await provider({ prompt, model });
    const parsed = extractJson(result.text);
    const packet = {};
    for (const k of PACKET_KEYS) {
      packet[k] = parsed[k] != null ? String(parsed[k]) : (skeleton[k] ?? 'unknown');
    }
    packet.sourcePointers = {
      arm: 'sitesmith',
      creativePass: 'llm',
      model: result.model ?? model ?? null,
    };
    const guard = guardCreativePacket(packet, input);
    base.guard = guard;
    if (!guard.ok) {
      if (!fallbackToRules) {
        return {
          ...base,
          packet,
          problems: guard.problems,
          llmSucceeded: false,
          creativePassFallback: false,
        };
      }
      return {
        ...base,
        packet: rulesPacket,
        guard: { ok: true, problems: [], llmRejected: guard.problems },
        llmSucceeded: false,
        creativePassFallback: true,
        fallbackReason: 'evidence-guard',
      };
    }
    // Merge LLM prose back onto card for DesignSpec/handoff
    const enrichedCard = {
      ...card,
      thesis: packet.designThesis,
      layoutPrinciple: packet.informationHierarchy,
      type: packet.typography,
      typographicPrinciple: packet.typography,
      colour: packet.colourAndMaterialModel,
      imagery: packet.imageryAndAssetStrategy,
      assetStrategy: packet.imageryAndAssetStrategy,
      motionInteraction: packet.interactionConcept,
      signatureElement: packet.signatureElement,
      primaryRisk: packet.primaryRisk,
      implementationNotes: packet.implementationGuidance,
      creativeLayer: { version: 'llm-1.0.0', boundToEvidence: true, inventsFacts: false },
    };
    return {
      ...base,
      packet,
      card: enrichedCard,
      llmSucceeded: true,
      model: result.model ?? null,
      usage: result.usage ?? null,
    };
  } catch (err) {
    if (!fallbackToRules) {
      return {
        ...base,
        problems: [String(err.message || err)],
        llmSucceeded: false,
        error: String(err.message || err),
      };
    }
    return {
      ...base,
      packet: rulesPacket,
      card,
      llmSucceeded: false,
      creativePassFallback: true,
      fallbackReason:
        err.code === 'NO_API_KEY' ? 'no-api-key'
          : err.code === 'AUTH' ? 'auth'
            : err.code === 'TIMEOUT' ? 'timeout'
              : err.code === 'RATE_LIMIT' ? 'rate-limit'
                : 'provider-error',
      error: String(err.message || err),
      errorCode: err.code ?? null,
      guard: rulesGuard.ok ? { ok: true, problems: [] } : rulesGuard,
    };
  }
}

export { buildPrompt, extractJson, PACKET_KEYS };
