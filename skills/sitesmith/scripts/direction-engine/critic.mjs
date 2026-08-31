/** Deterministic preflight critic — not an external isolated agent. Original work, MIT. */

import { createHash } from 'node:crypto';
import { isRound8Recipe } from './worlds-and-cards.mjs';

/**
 * Local keyword preflight only.
 * independence claim: deterministic-preflight (never "context-isolated" without external run evidence).
 */
export function critiqueBlindedCards(blindedCards, input, options = {}) {
  const externalRunEvidence = options.externalRunEvidence === true;
  const scores = blindedCards.map((card) => scoreCard(card, input));
  const ranked = [...scores].sort((a, b) => b.total - a.total);

  const top = ranked[0];
  const second = ranked[1];
  const tie = Boolean(top && second && top.total === second.total && top.total > 0);
  const rejectAll = ranked.length === 0
    || ranked.every((row) => row.total < 4)
    || ranked.every((row) => row.flags.includes('round8-recipe'))
    || ranked.every((row) => row.flags.includes('weak-subject'))
    || ranked.every((row) => row.flags.includes('mode-misfit'));

  return {
    role: 'deterministic-preflight',
    independence: externalRunEvidence ? 'context-isolated' : 'deterministic-preflight',
    notModelIndependent: true,
    externalRunEvidence: Boolean(externalRunEvidence),
    scores,
    rankedIds: ranked.map((r) => r.blindId),
    tie,
    rejectAll,
    recommendation: rejectAll ? null : (tie ? null : top?.blindId ?? null),
    notes: rejectAll
      ? 'reject-all: no card clears subject + mode-fit floor'
      : tie
        ? 'tie: user or external adjudicator required'
        : `preflight prefers ${top.blindId}; not an independent critic verdict`,
  };
}

function scoreCard(card, input) {
  const flags = [];
  let briefFit = 0;
  let originality = 0;
  let subject = 0;
  let composition = 0;
  let implementability = 0;

  const blob = JSON.stringify(card).toLowerCase();
  const subjectToken = (input.signals?.subject ?? input.subjectHints?.subject ?? '')
    .toLowerCase()
    .split(/\s+/)[0];
  if (subjectToken && blob.includes(subjectToken)) {
    subject += 3;
    briefFit += 2;
  } else {
    flags.push('weak-subject');
  }

  if (card.thesis && card.thesis.length > 40) briefFit += 2;
  if (card.composition && card.typographicPrinciple) composition += 2;
  if (card.imagery) composition += 1;
  if (card.primaryRisk) implementability += 1;

  if (isRound8Recipe(card)) {
    flags.push('round8-recipe');
    originality -= 4;
  }

  if (input.mode === 'product-ui' && /interface|canvas|keyboard|panel/i.test(blob)) briefFit += 2;
  if (input.mode === 'product-ui' && /material-board|editorial|photography-led/i.test(blob)) {
    flags.push('mode-misfit');
    briefFit -= 3;
  }
  if (input.mode === 'ecommerce' && /object|product|sku|price|cart|slip/i.test(blob)) briefFit += 2;
  if (input.mode === 'marketing' && /poster|bleed|statement|type/i.test(blob)) briefFit += 1;
  if (input.signals?.imageless && /photography-led|product plate/i.test(blob)) {
    flags.push('mode-misfit');
    briefFit -= 2;
  }

  implementability += /imageless|slot|diagram/i.test(blob) ? 1 : 2;

  const total = briefFit + originality + subject + composition + implementability;
  return {
    blindId: card.blindId,
    briefFit,
    originality,
    subject,
    composition,
    implementability,
    total,
    flags,
  };
}

/**
 * User choice is primary. Unknown blind ID fails closed.
 */
export function resolveChoice({ critic, userChoiceBlindId, allowAdjudicator = false, key }) {
  if (critic.rejectAll) {
    return {
      status: 'reject-all',
      selectedBlindId: null,
      selectedInternalId: null,
      by: 'preflight-reject-all',
    };
  }

  if (userChoiceBlindId != null && userChoiceBlindId !== '') {
    if (!Object.prototype.hasOwnProperty.call(key, userChoiceBlindId)) {
      return {
        status: 'error',
        ok: false,
        problems: [`unknown blind id: ${userChoiceBlindId}`],
        selectedBlindId: null,
        selectedInternalId: null,
        by: 'none',
      };
    }
    return {
      status: 'selected',
      selectedBlindId: userChoiceBlindId,
      selectedInternalId: key[userChoiceBlindId],
      by: 'user',
    };
  }

  if (critic.tie) {
    if (!allowAdjudicator) {
      return {
        status: 'tie-needs-user',
        selectedBlindId: null,
        selectedInternalId: null,
        by: 'none',
      };
    }
    const pick = critic.rankedIds[0];
    return {
      status: 'selected',
      selectedBlindId: pick,
      selectedInternalId: key[pick] ?? null,
      by: 'adjudicator-fallback',
    };
  }

  return {
    status: 'awaiting-user',
    selectedBlindId: null,
    selectedInternalId: null,
    advisoryBlindId: critic.recommendation,
    by: 'none',
  };
}

export function criticContextHash(blindedCards) {
  return createHash('sha256').update(JSON.stringify(blindedCards)).digest('hex');
}
