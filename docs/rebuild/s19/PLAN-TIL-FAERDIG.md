---
title: Planen til færdig, og stopreglen der binder
state: S19_COLD_LOOP
branch: rebuild/sitesmith-unified
ai_generated: "(C)"
---

# Færdig betyder én ting

En blind køber, der kun har set briefen og renderen, siger ACCEPT om en side bygget koldt
af en frisk agent med skillet alene. **Status: 0 af 9.**

Alt andet er grønt og har været det længe. Det er ikke målet.

## Stopreglen, fastlagt før runde 4 og ikke til forhandling bagefter

Løkken stopper når **det første** af disse indtræffer:

1. **To af tre kolde sider i én runde får ACCEPT** fra blinde køberdommere. → udgiv.
2. **En runde producerer ingen ny fejlklasse.** → udgiv med en skreven liste over hvad der
   stadig trækker ned, og uden en påstand om at siderne er gode.

Uden reglen kan hver runde finde noget nyt i det uendelige. Det er præcis den fælde
`docs/rebuild/s14/A9-ROUND4-RESULT.md` allerede har dokumenteret: alt der måles holder op
med at konvergere, og konvergensen flytter til den nærmeste umålte akse.

## Trinnene

| # | Trin | Tid |
|---|---|---|
| 1 | Runde 4 kold: tre nye briefs, tomt install, tre friske agenter | 50 min |
| 2 | Blind dom pr. side med den udvidede rubrik | 10 min |
| 3 | Er der en ny fejlklasse bekræftet to gange? Mål den, kalibrér mod alle tidligere builds, fixture-par, suite | 45 min |
| 4 | Stopreglen tjekkes. Ikke opfyldt → runde 5 | 2,5 t pr. runde |
| 5 | Release: FAERDIG-note, memory, tag. Stop før push | 40 min |

## Hvad runde 4 er den første prøve på

`Second reading` findes for første gang: et fast felt i journalen med sin egen selector, og
en gate der kræver at den renderer, ligger uden for første skærm, og læser andre
kendsgerninger end signaturen.

Det er det eneste vi har bygget der forsøger at fremtvinge det gode træk mere end én gang.
Ni dommere roste det samme træk ni gange, og fire af de første seks sagde at siden var
generisk hvis man klippede det ene element ud.

Hvis runde 4 giver tre afvisninger og "den næstbedste ting" stadig ligger i første skærm,
er mekanismen forkert og skal ikke lappes. Så er svaret gren 2 i stopreglen.

## Hvad der ikke bliver gjort, og hvorfor

- **Ingen benchmark mod de andre skills.** Det er en stående beslutning, og v1.0 udgives
  uden en påstand om at være bedre end noget.
- **`check-v3-docs` har tre åbne fejl** om dokumentationsceremonien i `docs/v3/`: en stale
  seal og to manglende review-filer fra en tidligere fase. De var der før denne session,
  de handler ikke om skillet, og de flytter ingen side.
- **Fire fund fra kilde-syntesen er ikke bygget**: fact-dækning pr. bånd, dekoration uden
  kendsgerning, varians i gentagne rækker, eyebrow-budget. De bygges kun hvis en runde
  bekræfter dem to gange.
