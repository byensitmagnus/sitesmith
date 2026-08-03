# Direction record

## Surface

buy

## Autopilot, written first and not built

Warm cream ground, one timber brown accent, a big serif over a neutral grotesk. First
screen: a full width band with a soft wood coloured gradient, a centred headline about
craftsmanship and drying, and two buttons. Under it four rounded cards with soft shadows,
one per species, each with a small tree icon in a rounded square, the price as a large
number and a "Se mere" link. Then a price table, then a contact form, then a footer with
opening hours. The clever move would be a hover that lifts each card two pixels. Every one
of those decisions is available to anyone who read the brief once, which is why none of
them is in the build.

## Subject

Rold Savværk, Røverstuevej 6, 9520 Skørping. Fem mennesker saver og tørrer løvtræ fra Rold
Skov og sælger det plankevis til møbelsnedkere og bådebyggere. Læseren er en møbelsnedker,
der allerede ved hvad kvartskåret betyder, og hvad fugtprocenten gør ved et emne. Det ene
siden skal kunne: vise hvad der ligger på pladsen, i hvilken tykkelse, ved hvilken fugt og
til hvilken pris, og lade læseren stille en bestilling op ud fra det.

## Constraints in force

Dansk tekst. Der findes ingen fotografier, så alt visuelt er CSS, SVG eller typografi. Én
selvstændig HTML fil, ingen framework, ingen ekstern JS, Google Fonts tilladt. Ingen
anmeldelser, ingen kundenavne, ingen påstande om årer, farve eller bearbejdning. Virker på
375, 768 og 1440. Kun briefens egne facts må stå som sande.

## Assets that exist

Intet blev leveret. Der findes ikke ét fotografi af pladsen, båndsaven, kamrene, stakken
eller en enkelt plankeende. Bygget afleveres derfor med `--draft`, og det manglende
fotografi står navngivet i ASSET-MANIFEST.md som det aktiv, der ville afløse tegningen på
den første skærm.

## Nouns

Båndsav med 1,3 m klinge. Kævle. Savsnit. Tørrekammer, to af dem, 22 m³ hvert. Kammerdør.
Tørrecyklus. Strøer i stakken. Planke. Endetræ. Modstandsmåler med to spidser, sat i
plankens midte. Fugtprocenten skrevet på endetræet. Grønt træ. Tørt træ. Kubikmeter høvlet
bræt. Tykkelse i millimeter: 27, 40, 52, 65. Længde 2,4 til 4,8 m, hele planker. Bøg, eg,
ask, elm. Restlager. Pladsen. Lastbillæs til Jylland og Fyn. Telefonen, hverdage 07 til
15. Rold Skov. Savsmuld og spåner. Mærkekridt.

## Theses

1. Stakken set for enden. Siden er enden af stakken ude på pladsen: hver planke på lager tegnet i sin sande tykkelse, med det mærke savværket selv skriver på endetræet.
2. Tørrejournalen fra kammerdøren. Siden er journalen: hvad der er inde, hvad der er ude, hvor mange dage der er igen, og man reserverer sig ind i ventetiden.
3. Prislisten som regneark, med tegningen som bilag. Siden er en tæt, sorterbar tabel først, og alt billedligt er underordnet den.

## Case for the runner-up

For: 2

En møbelsnedker, der allerede ved hvad 8 procent betyder, mangler ikke at få forklaret
hvad en planke er. Det han ikke kan skaffe andre steder, er pladsens tilstand: hvor meget
der står tørt nu, hvor meget der står grønt, og hvor mange dage der er igen inde i
kammeret. Journalen er den eneste af de tre former, hvis egen kolonne er tid, og derfor
den eneste der kan bære både det tørre og det grønne lager i én læsning. De 21 og 34 dage
er ikke baggrundsviden i den form, de er selve grunden til at man kan reservere noget, der
endnu ikke findes. Elmens 3,4 m³ får samtidig et ærligt sted at stå: en restkolonne i en
journal læses som en optælling, hvor det samme tal på et skilt læses som knaphed.

## Built

Built: 1, axis: hvad den første skærm kan gøre sammenligneligt på ét blik, because tykkelsen er det tal en snedker vælger ud fra, og stakken set for enden gør 27, 40, 52 og 65 mm til fire højder man kan måle mod hinanden uden at læse et ord, mens journalen først bliver sammenlignelig efter at den er læst. Tegningen kan desuden bære journalens bedste tal længere nede på siden, hvor journalen ikke kan bære tegningen længere oppe.

## Colour

Ni værdier, og tallet falder ud af, hvad et mørkt skur med lyse endetræer faktisk er
farvet. Ingen af dem har en rolle, der hedder accent eller surface.

- --kammer: #2b1310, indersiden af et tørrekammer med døren lukket, og den jernmønje pladsen maler stål med. Sidens bund.
- --grus: #35211d, vådt grus under stakken i samme lave lys. Paneler og bestillingssedlen.
- --kerf: #55403a, den linje en 1,3 m båndsav efterlader. Hver eneste streg og adskillelse.
- --endetrae: #cdc0ab, nysavet endetræ i lyset. Forsiden af hver planke i tegningen.
- --endetrae-dyb: #b3a48d, samme ende én planke længere inde i stakken, uden for lyset.
- --tekst: #d9d2c6, savsmuld sat på mørkt stål. Brødtekst.
- --kridt: #e5eaef, kridt. De største tal og overskrifterne.
- --damp: #a99a86, dampen ud af kammeret når døren åbnes. Bilinjer og billedtekster.
- --kridtgul: #c6b45a, mærkekridtet pladsen skriver med. Det ene der forpligter, og rettelsen når et tal ikke går an.

## Type

- Display: "Vollkorn" 700, kun tre steder: h1, træsortens navn i stakken, og prisen pr. m³. Ingen andre steder.
- Body: "Spline Sans" 450 til løbende tekst og 500 til etiketter, tabelceller og alle tal der ikke er en pris. 450 og ikke 400, fordi lys tekst på mørk bund taber vægt, og verify.mjs måler det.
- Skala: 0,78 / 0,88 / 1 / 1,3 / 1,75 / 2,6 rem, de to største med clamp. Hvert trin mindst 1,15 gange det forrige.
- Sporing: ingen positiv sporing nogen steder. Overskrifter på -0,01em, tal på 0.

## Density, motion and boldness

Tæt som en lagerliste: én linje pr. tykkelse, ikke én boks pr. træsort. Boldness ligger
samlet i den første skærms tegning og intet andet sted. Bevægelse: ingen. Ingen
indgangsanimation, ingen scroll reveal, intet der flytter sig mellem en hensigt og dens
resultat, og ingen figur nær et beløb der animerer. Kontroller skifter farve på 90 ms, og
det er hele bevægelsesbudgettet.

## Structure

En smal etiketkolonne til venstre i bånd 1 og 3, der bærer én stående linje. Den påstår:
dette bånd har ét emne, og her står det. Bånd 2 og 4 har ingen etiketkolonne, fordi en
specifikation og en seddel læses fra kant til kant. Hårfine streger i `--kerf` kun hvor en sav ville
efterlade en, altså mellem planker i stakken og mellem rækker i specifikationen. Ingen
nummerering, fordi båndene ikke er trin i en rækkefølge, men tre spørgsmål en køber
stiller i vilkårlig orden. Ingen etiketter i versaler, fordi pladsen skriver med små tal på
endetræ og ikke med skiltebogstaver.

## First screen

Det stærkeste sande materiale savværket har, er endetræet med tallet skrevet på. Den
første skærm er derfor stakken set for enden: fire søjler, én pr. træsort, hver bygget af
sine faktiske tykkelser i sand indbyrdes højde, 1 mm tegnet som 2 px. Bøg står 119 mm højt
af tre planker, eg 184 mm af fire, ask 67 mm af to, elm 40 mm af én. Forskellen i
søjlehøjde er lagerbredden, og den læses før man har læst noget som helst. Prisen pr. m³
står på søjlens eget hoved, og mærket 8 % står på hver eneste plankeende. Til højre for
rubrikken står pladsens fire stående linjer: adresse, åbningstid, hjemtransport og at grønt
træ kan reserveres, så hele forpligtelsen kan læses uden at rulle.

```text
+--------------------------------------------------------------+
| ROLD SAVVÆRK          Lager  Tørring  Bestilling   98 39 12 40|
+--------------------------------------------------------------+
| Løvtræ fra Rold      |   BØG    EG     ASK   ELM              |
| Skov, savet og       |  8.900  19.400 12.700 16.200 kr/m³     |
| tørret siden 1958.   |   ___    ___                           |
|                      |   |52|   |65|                          |
| Alt tørret til 8 %,  |   |__|   |__|                          |
| målt i plankens      |   |40|   |52|   ___                    |
| midte.               |   |__|   |__|   |40|    ___            |
|                      |   |27|   |40|   |__|    |40|           |
| [ Til bestilling ]   |   |__|   |__|   |27|    |__|           |
|                      |          |27|   |__|                   |
+--------------------------------------------------------------+
```

## Imagery treatment

Tre tegninger, én behandling: flade fyld fra tokenlaget, hårfine kerf streger, og tal sat i
brødskriften i sand indbyrdes størrelse. Skalaen står skrevet på siden som ord frem for som
et px tal, fordi px tallet ændrer sig med bredden: 1 mm er 2 px ved 1024 og derover, 1,7 px
derunder og 1,45 px under 640. Alle fire
træsorter tegnes med det samme fyldpar, så ingen tegning påstår noget om årer eller farve.
Kun tykkelsen er målsat.

1. `.stak`, lageret set for enden, tykkelse i skala 1 mm = 2 px.
2. `.tavle`, tørretiden som streger i rækker af syv, 21 og 34 dage.
3. `.maaling`, én plankeende i skala 1 mm = 8 px, med brudt højre kant fordi bredden ikke er oplyst, og med målerens to spidser gående ned fra fladen til midterlinjen.

## Argument order

Hvad ligger der på pladsen lige nu, og hvad koster det. Hvad 8 procent betyder her, og hvor
længe kammeret er om det. Hvad det koster at få det hjem. Sedlen man ringer ind.

## Signature

`.stak`: lageret tegnet som en stak set for enden, hvor hver plankes højde er dens
faktiske tykkelse i én oplyst skala, så 27, 40, 52 og 65 mm bliver fire målbare højder i
stedet for fire tal. Dens art er et snit, ikke et diagram: den viser tingens ende, som
pladsen selv ser den, når stakken står under halvtaget. Mediets første greb her ville være
et fotogitter eller en kortrække, og siden ville miste det eneste den kan sige uden et
fotografi: at eg findes i fire tykkelser og elm i én.

## Risk

Den første skærm er en tegning på næsten sort bund uden ét fotografi, på en side hvis
eneste opgave er at tage imod en bestilling. Hele branchen åbner med et billede af træ, og
en køber, der bare vil se en pris, kan læse det her som en plakat i stedet for som en
handel.

## Answer to the risk

The risk above is answered by `.ordrepanel`, som bærer de samme tal som tegningen bærer,
plus fragt og ventetid, og som slutter siden i en udfyldt seddel, man kan læse op i
telefonen. Prisen står desuden på søjlens eget hoved i tegningen, så intet tal kun findes
ét sted.

## Second reading

`.tavle` renders tørretiden: 21 dage for 27 mm og 34 dage for 52 mm, sat som streger i
rækker af syv, så 21 er tre hele uger og 34 er fire uger og seks dage. Den ligger under den
første skærm og læser en anden måling af emnet end signaturen, som læser millimeter.

## The shell

Who: Rold Savværk, i toppen og igen i bunden. Where: Røverstuevej 6, 9520 Skørping, i
bunden og ved siden af afhentningslinjen. Do: skriv bestillingssedlen, på knappen i
`.ordrepanel`, og telefonnummeret 98 39 12 40 i toppen som den anden vej ud.

## Assumptions

- Priserne 8.900, 19.400, 12.700 og 16.200 kr/m³ står som de står i briefen. Briefen siger
  intet om moms, så siden siger hverken med eller uden.
- Bestillingen kan ikke sendes nogen steder, fordi der ikke findes et system at sende den
  til. Sedlen skrives derfor på siden og læses op i telefonen, som er den eneste kanal
  briefen giver. En knap, der lod som om den sendte, ville være opdigtet.
- 1 mm tegnet som 2 px er valgt her og står ikke i briefen. Skalaen står skrevet på
  tegningen.
- Reservation af grønt træ antages at foregå i samme telefon, da briefen kun siger at det
  kan reserveres.

## Originality pass

Swap the brief: samme plan lagt på et andet savværk i samme branche. Etiketkolonnen, den
mørke bund og prislisten overlevede uændret, hvilket betyder at de handler om kategorien og
ikke om Rold. Det, der ikke overlevede, var søjlehøjderne: et savværk med alle fire
tykkelser i alle sorter tegner fire lige høje søjler, og så siger tegningen ingenting.
Rettelsen: tegningen er bundet til dette ujævne lager, søjlerne står på samme grundlinje og
måles opad, og de fire højder er pointen frem for pynt over en tabel.

Swap the trade: samme plan givet til en fysioterapiklinik. Formen holdt, og det er
problemet: ni farver, en etiketkolonne, én tegning øverst, én tegning nedenunder og en
seddel til sidst er en proces og ikke et design. Det, der brød sammen da jeg tvang den
over, var at klinikken ikke har en måling, hvis sande størrelse betyder noget for køberen.
Rettelsen: signaturen må ikke være "en tegning øverst", den skal være denne tegning, og den
er derfor bundet til tykkelse i millimeter i en oplyst skala, så den ikke kan flyttes til
noget, der ikke måles i millimeter. Samtidig flyttede den anden læsning fra en gentagelse
af stakken til kammerets dagestreger, som en klinik ikke kan tegne, og sedlen fik
plankelængden 2,4 til 4,8 m med som det, pladsen selv ikke ved på forhånd.

Sektion 5 blev skrevet først, og af autopilotsiden overlevede intet: hverken den lyse bund,
den ene brune accent, kortrækken, skyggerne, ikonerne i afrundede firkanter eller løftet
ved hover.

## One-offs

- `none` no literal length or shadow is written at a call site

## Deliberate

- `none` this build claims no antipattern on purpose
