---
title: Blind dom — Kornmodtagelsen, Hobro Andel
surface: operate
reviewer: a fresh agent given the brief, four renders and index.html, and nothing else
saw: not the direction record, not the production report, not the gate output, not another reviewer
verdict: ACCEPT
ai_generated: "(C)"
---

# ACCEPT

> vognen på broen og de tre celler der kan tage lasten kan ses fra døren uden at læse en
> linje, og skærmen modsiger ikke sig selv ét eneste sted.

## De fem værste ting jeg ser

1. **Køen er usynlig fra arbejdsstillingen.** På 1440-folden slutter skærmen ved
   Anvis-knapperne; de fire ventende vogne ligger et helt bånd længere nede. Mellem 11 og 15
   er køen det jeg styrer dagen efter.
2. **Prøvens tilstand er tvetydig.** Felterne står udfyldt og den grønne melding svarer
   allerede som om prøven er godkendt — men "Godkend prøve" står stadig mørk og ladt. Der er
   ingen kvittering nogen steder.
3. **To næsten ens store tal.** "47.857 kg" (broen lige nu, kæmpe) og "47.860 kg, klokken
   12.01" (vejet ind) står ét øjekast fra hinanden og afviger 3 kg. Det tal min anvisning
   bygger på er det indvejede — og det er sat mindst.
4. **Manualtekst trykt på skærmen.** Højre rail bruger tre afsnit på at forklare at siloerne
   er tegnet i skala. Efter femten høster læser jeg det aldrig igen — mens det tal jeg
   faktisk sammenligner er den mindste tekst på skærmen.
5. **Lastbåndet i silotegningen bærer ikke sit eget budskab.** Fordi både bredde og højde
   vokser med kapaciteten kan fyldningsgraden ikke sammenlignes på tværs med øjet.

## Første skærm

> Ja — det er opgaven: vognen kan ikke overses, og "hvor kan lasten gå hen" er afgjort af
> farve og dæmpning før man læser noget. To huller: afgrøden står kun i 16px, og den
> *ventende* kø er slet ikke med på folden.

## Det bedste ved den

> Cellevæggen træffer beslutningen fysisk: kun celler med rigtig afgrøde OG plads til netop
> denne last får en knap, og hver dæmpet celle siger hvorfor med tre ord — "Kun byg", "Kun
> rug", "Kun 22 t tilbage", "Kun våd last". Melding og knapper er drevet af samme regel i
> koden, så de kan ikke blive uenige.

## Den næstbedste ting

> Brutto/netto-ærligheden. "Vejes først når vognen kører af broen. Indtil da regnes plads i
> cellen på bruttovægten" — og koden gør det den siger: pladsen regnes på indvejningen,
> cellen reserveres ved anvisning, og rækken i loggen låses med "Låst, vognen har forladt
> broen" i samme øjeblik vognen kører. Det er briefens kendsgerninger oversat 1:1, ikke
> pyntet.

## Hvad ville have væltet dommen til afvis

1. Hvis cellevæggen med Anvis-knapperne havde ligget under folden — så var kerneopgaven
   ikke løst uden scroll.
2. Hvis meldingen og knapperne kunne modsige hinanden. Én selvmodsigelse i
   anvisningsgrundlaget, og jeg stoler aldrig på skærmen igen.
3. Hvis en låst anvisning kunne fortrydes efter vognen har forladt broen — det bryder den
   hårdeste kendsgerning i briefen.

## Venstrekanter

> Én fælles kant på 40 hele vejen; eneste afvigelse er meldingens bevidste indryk.

## Layoutfamilier

Tre: to-spaltet strimmel med rail (3 sektioner, kun delingsforholdet varierer),
kontobogsrækker over fuld bredde (køen og anvisningsloggen), mørk kantstrimmel (header og
footer).
