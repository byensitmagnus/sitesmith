/**
 * Evidence-bound creative enrichment for Direction Engine cards.
 * Does NOT invent products, prices, awards, or assets.
 * Composes director-grade prose from pack signals + seed structure only.
 * Original work, MIT.
 */

const MODE_TYPE = {
  ecommerce: {
    display: 'Barlow Condensed 600–700 (product names / workshop signage)',
    body: 'IBM Plex Sans 400–500 (plain trade English, 45–75ch)',
    utility: 'IBM Plex Mono 400–500 (grades, lead times, prices)',
  },
  marketing: {
    display: 'Fraunces or similar display serif for edition titles',
    body: 'Source Serif / Source Sans pair for reading length',
    utility: 'tabular figures for edition sizes only',
  },
  portfolio: {
    display: 'Fraunces or similar display serif for edition titles',
    body: 'Source Serif / Source Sans pair for reading length',
    utility: 'tabular figures for edition sizes only',
  },
  'product-ui': {
    display: 'UI sans (Inter / system-ui) medium for section titles',
    body: 'UI sans regular for labels and helper text',
    utility: 'IBM Plex Mono for vessel IDs, timestamps, shortcuts',
  },
  component: {
    display: 'UI sans medium',
    body: 'UI sans regular',
    utility: 'mono for tokens/states',
  },
  redesign: {
    display: 'Match preserved brand display if documented; else neutral grotesque',
    body: 'Readable sans for body',
    utility: 'mono sparingly',
  },
  editorial: {
    display: 'High-contrast display serif',
    body: 'Reading serif',
    utility: 'small caps for deck labels',
  },
  audit: {
    display: 'UI sans',
    body: 'UI sans',
    utility: 'mono for findings IDs',
  },
};

/** Map free-text brand cues to concrete roles — never invents a second accent system. */
export function colourModelFromSignals(s, seedColour) {
  const palette = s.brandPalette ?? [];
  const materials = s.materials ?? [];
  if (palette.length || materials.length) {
    const ground = palette.find((p) => /cream|chalk|white|paper|bone|fog|light/i.test(p))
      || (s.imageless ? 'near-black shell / fog panels' : 'warm light ground from brand cues');
    const ink = palette.find((p) => /ink|brown|black|harbour|near-black|soot/i.test(p))
      || 'primary ink on ground';
    const accent = palette.find((p) => /brass|coral|amber|accent/i.test(p))
      || 'single reserved accent from brand only';
    const mat = materials.length ? ` Materials in play: ${materials.join(', ')}.` : '';
    return `${ground}; type/rules in ${ink}; accent only on primary CTA/hardware (${accent}).${mat} Seed note: ${seedColour}`;
  }
  return seedColour;
}

export function signatureFromSignals(s, mode, composition) {
  const subject = s.subject || 'subject';
  const products = s.products ?? [];
  const primary = products[0] || subject;
  if (mode === 'ecommerce' || s.commerce) {
    if (/hide|leather|grade/i.test(`${s.materials?.join(' ')} ${s.subject}`)) {
      return `Hide Grade Strip under ${primary} plate — chips bind plate → grade → make-slot`;
    }
    return `Make-slot control on ${primary} — primary CTA is the product, not a hero slogan`;
  }
  if (mode === 'product-ui' || s.operational) {
    return `Always-on status strip + primary work canvas for ${subject} — amber only for faults`;
  }
  if (mode === 'marketing' || mode === 'portfolio' || s.editorial) {
    const ed = products[0] || 'named edition';
    return `Registration / edition mark as UI grammar on ${ed} — process proof over award chrome`;
  }
  const short = String(composition).split(',')[0].trim();
  return `${subject}: ${short} as the single memorable first-fold device`;
}

export function thesisFromSignals(s, mode, composition) {
  const subject = s.subject || 'Subject';
  const action = s.primaryAction || 'primary action';
  const products = (s.products ?? []).slice(0, 3).join(', ');
  const materials = (s.materials ?? []).slice(0, 3).join(', ');
  const anti = (s.antiRefs ?? [])[0] || '';
  if (mode === 'ecommerce' || s.commerce) {
    return `${subject} is a make-slot desk, not a boutique shelf: open on ${products || 'the primary product'} with trade facts on the plate edge; primary argument is material truth + “${action}” — never lifestyle hero${anti ? `; ban ${anti}` : ''}.`;
  }
  if (mode === 'product-ui' || s.operational) {
    return `${subject} is a night-watch instrument: first screen is the work journey (“${action}”), not marketing chrome${s.imageless ? '; deliberately imageless' : ''}${anti ? `; ban ${anti}` : ''}. Composition: ${composition}.`;
  }
  if (mode === 'marketing' || mode === 'portfolio' || s.editorial) {
    return `${subject} presents named work (${products || 'editions'}) as press proof, not agency theatre: “${action}” after material facts${anti ? `; ban ${anti}` : ''}. Composition: ${composition}.`;
  }
  return `${subject}: make “${action}” inevitable via ${composition}.${materials ? ` Materials: ${materials}.` : ''}`;
}

export function hierarchyFromSignals(s, mode, action) {
  const products = (s.products ?? []).join(', ') || 'primary subject object';
  const materials = (s.materials ?? []).join(', ') || 'evidence facts';
  if (mode === 'ecommerce' || s.commerce) {
    return `1) ${products} plate recognition 2) ${materials} 3) choice control (grade/size if evidenced) 4) ${action} 5) secondary SKUs — no fake ★/testimonials`;
  }
  if (mode === 'product-ui' || s.operational) {
    return `1) work object 2) required fields/states 3) ${action} 4) validation/offline/success — no KPI theatre`;
  }
  return `1) named work (${products}) 2) process/material proof (${materials}) 3) ${action} 4) secondary pieces`;
}

export function imageryFromSignals(s, seedImagery) {
  if (s.imageless) {
    return 'Deliberately imageless — chrome, type, and states carry the first screen; no stock illustration.';
  }
  if (s.hasProductPlates) {
    const products = (s.products ?? []).slice(0, 3).join(', ') || 'declared plates';
    return `Object-led plates only for ${products} (have in manifest/plan). No lifestyle models, no stock handshakes. Needed-only assets stay labelled slots.`;
  }
  return `${seedImagery} — only assets listed in plan/manifest; no invented photography.`;
}

export function typeFromMode(mode, seedType) {
  const t = MODE_TYPE[mode] || MODE_TYPE.ecommerce;
  return `Display: ${t.display}. Body: ${t.body}. Utility: ${t.utility}. Seed structure: ${seedType}.`;
}

export function implementationFromSignals(s, card, mode) {
  const action = s.primaryAction || 'primary action';
  const parts = [
    `Thesis lock: ${card.thesis}`,
    `Signature selector: [data-signature] implements “${card.signatureElement}”.`,
    `Hierarchy: ${card.layoutPrinciple}`,
    `Type: ${card.type}`,
    `Colour/material: ${card.colour}`,
    `Imagery: ${card.imagery}`,
    `Interaction: ${card.motionInteraction}; honour dials if explicit on brief.`,
    `CTA language stays pack-true: “${action}”.`,
    'Fail closed: no invented reviews, awards, KPIs, logos, or free shipping.',
  ];
  if ((s.antiRefs ?? []).length) {
    parts.push(`Anti-refs enforced: ${(s.antiRefs ?? []).join('; ')}`);
  }
  return parts.join(' ');
}

/**
 * Enrich a generated card in place (returns new object).
 */
export function enrichCard(card, input) {
  const s = input.signals ?? {};
  const mode = input.mode;
  const thesis = thesisFromSignals(s, mode, card.composition);
  const signatureElement = signatureFromSignals(s, mode, card.composition);
  const layoutPrinciple = hierarchyFromSignals(s, mode, s.primaryAction || 'primary action');
  const colour = colourModelFromSignals(s, card.colour);
  const type = typeFromMode(mode, card.type);
  const imagery = imageryFromSignals(s, card.imagery);
  const enriched = {
    ...card,
    thesis,
    signatureElement,
    layoutPrinciple,
    colour,
    type,
    typographicPrinciple: type,
    imagery,
    assetStrategy: imagery,
    designIntent: `${mode}: ${s.primaryAction || 'action'} for ${s.subject || 'subject'}`,
    implementationNotes: implementationFromSignals(s, {
      thesis,
      signatureElement,
      layoutPrinciple,
      type,
      colour,
      imagery,
      motionInteraction: card.motionInteraction,
    }, mode),
    creativeLayer: {
      version: '1.0.0',
      boundToEvidence: true,
      inventsFacts: false,
    },
  };
  return enriched;
}

export function enrichCards(cards, input) {
  return (cards ?? []).map((c) => enrichCard(c, input));
}
