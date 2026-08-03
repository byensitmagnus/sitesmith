# Designplan — Klinke & Datter

Metode: `frontend-design` (brainstorm → plan → kritik af planen → kode → kritik igen).

## Grundlag i emnet

Subjekt: et pneumatisk selvspillende klaver. Publikum: én person, der har arvet et
instrument og ikke ved om det er skrot. Sidens ene job: gør det klart, at næste skridt
er en vurdering til 1.850 kr., og at man starter med et telefonopkald.

Emnets materialer: manilapapir med perforeringer, messing-tracker-bar, læder, gummierede
slanger, træ og luft. Alt visuelt på siden skal komme derfra — ikke fra "håndværk"-klichéer.

## Tokens

### Farve — 6 navngivne værdier

| Navn | Hex | Rolle |
|---|---|---|
| `--papir` | `#E9DFC6` | sidebaggrund. Manila, gulere og mere støvet end den cremede standard |
| `--papir-lys` | `#F5EFDE` | selve noderullen og kort |
| `--blaek` | `#16201B` | tekst, og "indeni kassen"-sektionen. Grønsort, ikke neutralsort |
| `--daempet` | `#4C5146` | sekundær tekst |
| `--messing` | `#6E5210` | links og labels på papir (5,8:1) |
| `--messing-lys` | `#B08F2E` | messing på mørk baggrund (5,4:1) |

Ingen terrakotta, ingen syregrøn, ingen sort-med-én-neonfarve.

### Type — 3 roller

- **Display: Archivo, bredde-aksen skruet op (wdth 112–120), 700.** Bred grotesk = navneplade
  på et instrument, ikke boghistorie. Fravalgt: højkontrast-serif-display (standardsvaret).
- **Brød: Newsreader, 400/500.** Lav kontrast, stor x-højde, læsbar for et publikum der
  typisk er midaldrende og opefter. Passer til ordet "tilstandsrapport".
- **Nytte: Martian Mono, 300/500, 0,72rem, spatieret.** Bruges kun til labels og tal —
  samme rolle som stemplerne på en rulleæske.

Skala: h1 `clamp(2.1rem, 6.2vw, 4.4rem)`, h2 `clamp(1.6rem, 3.4vw, 2.4rem)`,
brød `clamp(1.02rem, …, 1.14rem)`, linjehøjde 1.65.

### Layout

Regnskabs-opslag: smal venstrekolonne med mono-label og hårfin messinglinje, bred
højrekolonne med overskrift og indhold. Ét brud på rytmen: sektionen "Når kassen er åben"
er fuldbredde og mørk — man kigger ind i instrumentet.

```
1440                                   375
+------------------------------------+  +--------------+
| Klinke & Datter        66 12 47 09 |  | navn / tlf   |
+------------------------------------+  +--------------+
| h1 (2 linjer)                      |  | h1           |
| deck. [Ring 66 12 47 09]           |  | [Ring]       |
+====================================+  +==============+
|##  RULLE, ruller mod venstre   ## |  |## rulle ##   |
|  ||tracker bar                    |  |  ||          |
+====================================+  +==============+
| 1.850 kr. | en halv dag | rapport  |  | 3 linjer     |
+------------------------------------+  +--------------+
| SÅDAN   | DU  Ring | VI  Vi kommer |  | DU Ring      |
| STARTER | DU  Rapport | DU Beslut  |  | VI Vi kommer |
+------------------------------------+  | …            |
| OMFANG  | tager ind / tager ikke   |  +--------------+
+------------------------------------+
|##### mørk: fem fejl, mono-eyebrow  |
|  SMULDRET / REVNET / SLIDT / …     |
+------------------------------------+
| TID     | 4–9 måneder. fire pladser|
+------------------------------------+
| RULLER  | 38 titler. 340 kr. [rulle|
+------------------------------------+
| VÆRKSTED| 1981 Verner / 2011 Liv   |
|         | Havnegade 22. Tir–tor.   |
+------------------------------------+
```

### Signatur

**Noderullen under tracker baren.** Et fuldbredde bånd i hero: ti papirspor med
uregelmæssigt perforerede slidser, der kører langsomt mod venstre under en messingbjælke
med ti huller. Det er ikke dekoration — det er præcis den mekanik kunden har arvet og ikke
kan få til at virke. Ren CSS: ti `linear-gradient`-spor med hver sin stopliste over en
240px-periode, animeret på `background-position-x`. Slukkes ved `prefers-reduced-motion`.
Rullen optræder én gang mere, stillestående, i sektionen om noderuller.

## Kritik af planen, før der skrives kode

1. **Nummererede markører (01/02/03) — fjernet.** "Sådan starter du" *er* en ægte
   sekvens, så numre ville være tilladt. Men den information, læseren mangler, er ikke
   rækkefølgen — det er *hvem der handler*. Markørerne er derfor `DU / VI / DU / DU`.
   Det er strukturen som indhold.
2. **De fem fejl fik ikke numre eller ikoner.** Deres eyebrow er fejltypen fra briefen:
   SMULDRET / REVNET / SLIDT / SPRUKKET / HÅRDE. Igen: struktur der er sand.
3. **Cremet baggrund + serif-display var det første jeg tegnede.** Det er standard nr. 1 i
   AI-design. Rettet to steder: papiret er skubbet mod manila (`#E9DFC6`, gult og støvet),
   og display-facen er en *bred grotesk*, ikke en serif. Serif'en er henvist til brødtekst,
   hvor den arbejder for læseren i stedet for at posere.
4. **Fjernet ét smykke (Chanel-reglen):** perforerede kanter i venstre og højre margen hele
   siden ned. Rullen skal være ét sted, ellers er den tapet.
5. **Ingen formular.** Briefen giver kun et telefonnummer. En kontaktformular ville opfinde
   en kanal, der ikke findes. CTA er `tel:`-link, hele vejen igennem.
6. **Ingen udregnede tal.** "Siden 1981" bliver ikke til "45 års erfaring". Kun tal fra
   briefen: 1.850, 340, 38, 4, 9, 4, 66 12 47 09, 22, 5000, 9.00–16.00.

## Risikoen jeg tager, og hvorfor

Et ambient, uendeligt loopende bånd i hero er normalt et dårligt tegn — det er ofte
bevægelse uden grund. Her er det begrundet: rullen der løber under tracker baren *er*
produktet, og den forklarer på to sekunder, hvad et pneumatisk klaver overhovedet er, for
en læser der måske aldrig har set det køre. Farten er lav (240px / 8s), kontrasten er
lav, og bevægelsen stopper helt ved `prefers-reduced-motion`.
