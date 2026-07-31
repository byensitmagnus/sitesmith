/** Separate critic context for direction cards. Original work, MIT. */

import { createHash } from 'node:crypto';
import { isRound8Recipe } from './worlds-and-cards.mjs';

/**
 * Critic receives only blinded cards — no generator favorite, no internal IDs.
 * Same model family would still be context-isolated only, never model-independent.
 */
export function critiqueBlindedCards(blindedCards, input) {
  const scores = blindedCards.map((card) => scoreCard(card, input));
  const ranked = [...scores].sort((a, b) => b.total - a.total);

  const top = ranked[0];
  const second = ranked[1];
  const tie = top && second && top.total === second.total;
  const rejectAll = ranked.every((row) => row.total < 12)
    || ranked.every((row) => row.flags.includes('round8-recipe'))
    || ranked.every((row) => row.flags.includes('weak-subject'));

  return {
    independence: 'context-isolated',
    notModelIndependent: true,
    scores,
    rankedIds: ranked.map((r) => r.blindId),
    tie,
    rejectAll,
    recommendation: rejectAll ? null : (tie ? null : top.blindId),
    notes: rejectAll
      ? 'reject-all: no card clears subject + diversity floor'
      : tie
        ? 'tie: user or external adjudicator required'
        : `prefer ${top.blindId} on evidence fit without generator scores`,
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
  const subjectToken = (input.subjectHints?.subject ?? '').toLowerCase().split(/\s+/)[0];
  if (subjectToken && blob.includes(subjectToken)) {
    subject += 3;
    briefFit += 2;
  } else {
    flags.push('weak-subject');
  }

  if (card.thesis && card.thesis.length > 40) briefFit += 2;
  if (card.signatureElement && subjectToken && card.signatureElement.includes(subjectToken)) {
    originality += 2;
  }
  if (card.composition && card.typographicPrinciple) composition += 2;
  if (card.imagery) composition += 1;
  if (card.primaryRisk) implementability += 1;
  if (card.assetStrategy && !/stock gradient|purple glow/i.test(card.assetStrategy)) originality += 1;

  // Penalise known house recipe even if only one field cluster appears.
  if (isRound8Recipe(card)) {
    flags.push('round8-recipe');
    originality -= 4;
  }

  // Mode fit
  if (input.mode === 'product-ui' && /interface|canvas|keyboard/i.test(blob)) briefFit += 2;
  if (input.mode === 'ecommerce' && /object|product|sku|price|cart|slip/i.test(blob)) briefFit += 2;
  if (input.mode === 'marketing' && /poster|bleed|statement|type/i.test(blob)) briefFit += 1;

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
 * User choice is primary. Adjudicator only as explicit fallback for ties / benchmark.
 */
export function resolveChoice({ critic, userChoiceBlindId, allowAdjudicator = false, key }) {
  if (critic.rejectAll) {
    return {
      status: 'reject-all',
      selectedBlindId: null,
      selectedInternalId: null,
      by: 'critic-reject-all',
    };
  }
  if (userChoiceBlindId) {
    return {
      status: 'selected',
      selectedBlindId: userChoiceBlindId,
      selectedInternalId: key[userChoiceBlindId] ?? null,
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
  if (critic.recommendation) {
    // Recommendation is advisory only unless user opts into auto.
    return {
      status: 'awaiting-user',
      selectedBlindId: null,
      selectedInternalId: null,
      advisoryBlindId: critic.recommendation,
      by: 'none',
    };
  }
  return { status: 'awaiting-user', selectedBlindId: null, selectedInternalId: null, by: 'none' };
}

export function criticContextHash(blindedCards) {
  return createHash('sha256').update(JSON.stringify(blindedCards)).digest('hex');
}
