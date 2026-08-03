# Design Read, dials og pre-flight (Klinke & Datter)

Metode: `taste-skill` / design-taste-frontend, SKILL.md, 1207 linjer.

## 0.B Design Read (én linje)

Reading this as: a local craft-service landing for a non-expert who has inherited a pneumatic
instrument, with a workshop-honest, mechanically literate language, leaning toward native CSS +
one grotesk + a perforated-roll motif built from gradients, no photography.

Ingen afklarende spørgsmål stillet (0.C): briefet er entydigt nok til at læse retningen.

## 1. Dials

| Dial | Værdi | Begrundelse |
|---|---|---|
| `DESIGN_VARIANCE` | 5 | 1.A "trust-first / accessibility-critical" trækker mod 3-4. Emnet (håndværk, mekanik) løfter til 5: asymmetriske spaltforhold og en bento uden symmetri, men ingen kaos-layout for et publikum der leder efter en pris og et telefonnummer. |
| `MOTION_INTENSITY` | 3 | Ingen ekstern JS er tilladt, og publikum er en person der lige har arvet et instrument. Skillet: "if you cannot ship working motion in the available scope, drop the dial to 3 and ship a clean static page." Siden har derfor kun hover/focus/active-states. Der påstås ingen scroll-koreografi. |
| `VISUAL_DENSITY` | 4 | Almindelig web-rytme (`py-16`-`py-24`-ækvivalent). Ni fakta skal kunne læses uden at siden bliver et datablad. |

## 2. System vs. æstetik

Ingen af Section 2.A-systemerne passer (ikke offentlig sektor, ikke enterprise, ikke Shopify).
Det er en æstetik, ikke et system: **native CSS + custom properties**, én fil, ingen framework.
Ærligt navngivet: papir/perforering-motivet er CSS-gradienter, ikke et bibliotek.

## 4.2 Palette

Premium-consumer-forbuddet er relevant (håndværk/arv), så beige + messing + oksblod + espresso er
udelukket. Roteret til **"Forest"-familien uden det varme håndværkslook**: kølig papirgrå neutral
plus ét accentgrønt.

- Lys: `#eef0ef` papir, `#f7f8f7` flade, `#181c1b` blæk, `#525a58` dæmpet (6,2:1), `#12513c` accent (7,9:1 mod papir, 9,0:1 mod hvid).
- Mørk: `#131615` bund, `#1a1e1d` flade, `#e8ebea` blæk, `#a2acaa` dæmpet (8,0:1), `#48b98f` accent (7,6:1).
- Én accent, låst hele siden igennem. Ingen anden kulør nogen steder.

## 4.1 Typografi

`Archivo` (Google Fonts), én familie, vægt 400/500/600/700 plus kursiv til fremhævning i samme
familie. Ingen serif (4.1 serif-disciplin: intet i briefet retfærdiggør den), ingen Inter,
ingen mono (holder ét copy-register, jf. 4.9).

## Sektioner og layoutfamilier (4.7)

1. Hero: asymmetrisk split, tekst venstre, perforeret rulle højre.
2. Afgrænsning: to-spaltet ja/nej-par, hårfin linje, ingen kort.
3. Vurderingen: figur-blok, ét stort tal plus tre linjer.
4. Fem fejl: bento med præcis 5 celler (3+3 / 2+2+2), tre celler med reel visuel variation.
5. Restaurering: fuldbredde-statement plus to korte afsnit.
6. Nodruller: vandret perforeret bånd med tekst under.
7. Verner og Liv: to-op med årstal som display-typografi.
8. Sådan starter du: kontakt-grid.

Otte sektioner, otte forskellige familier. Ingen billede+tekst-split overhovedet, så
zigzag-kappen er triviel opfyldt.

## 14. Pre-flight

- [x] Design read erklæret, dials begrundet, æstetik navngivet ærligt.
- [x] **Nul em-dash og nul en-dash** på hele siden (verificeret med søgning).
- [x] Ét tema-lås: lys og mørk defineret som tokens, ingen sektion vender om midt på siden.
- [x] Én accent hele vejen; én radius (0 px) på alt interaktivt og alle flader.
- [x] Knapkontrast: primær hvid på `#12513c` = 9,0:1; mørk knap `#0d1211` på `#48b98f` = 7,8:1. Sekundær har synlig 1 px kant.
- [x] Ingen CTA ombrydes på desktop. Én label pr. intention: kontakt hedder altid "Ring 66 12 47 09".
- [x] Ingen formularer på siden, så formularkontrast-tjekket er ikke relevant.
- [x] Hero: overskrift 2 linjer på desktop (grænsen er 2), brødtekst 17 ord på 3 linjer, begge CTA'er synlige uden scroll, `padding-top` 88 px, altså under loftet på 96 px.
- [x] Hero-stak: 3 tekstelementer (overskrift, brødtekst, CTA'er). Ingen eyebrow, ingen mikro-tagline, ingen trust-strip.
- [x] **Eyebrow-tælling: 0.** Grænsen var 3.
- [x] Ingen split-header, ingen svævende tekst i øverste højre hjørne af sektionsoverskrifter.
- [x] Ingen logo-væg, ingen testimonials, ingen tal ud over briefets egne.
- [x] Bento: fem emner, fem celler, ingen tom celle. Tre celler har reel fladevariation.
- [x] Copy-audit: hver streng genlæst på dansk. Intet lorem, intet engelsk i brugerflader, ingen påstand uden dækning i briefet.
- [x] Motion: dial 3, kun hover/focus/active. Ingen påstået animation der ikke findes. `prefers-reduced-motion` slår alligevel transitions og smooth scroll fra.
- [x] Ingen `window.addEventListener`, ingen JS overhovedet.
- [x] Navigation på én linje, højde 68 px desktop.
- [x] Mørk tilstand via `prefers-color-scheme`, testet i begge tilstande.
- [x] Mobil-kollaps eksplicit pr. sektion. Ingen vandret scroll ved 375.
- [x] `min-height: 100dvh` bruges ikke som hero-tvang, og `h-screen`-mønstret optræder ikke.
- [x] Ingen ikonbiblioteker importeret, og ingen håndtegnede ikon-SVG'er. Det eneste visuelle er
      perforeringsmotivet, som briefet eksplicit hjemler ("anything visual must be CSS, SVG or type").
- [x] Ingen skrå streger af AI-tells: ingen scroll-cues, ingen sektionsnumre, ingen status-prikker,
      ingen versionsfod, ingen by/tid/vejr-strimmel, ingen falske skærmbilleder.

## Kendt afvigelse fra skillet

Section 4.8 kræver rigtige billeder. Briefet siger direkte at der ikke findes fotos, og at alt
visuelt skal være CSS, SVG eller type. Briefet vinder. Perforeringsmotivet er derfor bygget af
gradienter alene og forestiller virksomhedens eget produkt, ikke dekoration.
