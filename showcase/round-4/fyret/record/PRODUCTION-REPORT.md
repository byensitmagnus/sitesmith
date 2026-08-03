# Produktionsrapport, Hirtshals Fyr

- Scenario: read
- draft: yes
- Surface: read
- Bygget: 2026-08-02
- Side: `index.html`, én selvstændig fil, ingen ramme, intet byggetrin, ingen JavaScript
- Skrifter: Google Fonts (Marcellus, Archivo)

`draft: yes` fordi siden handler om noget fysisk, og der findes intet fotografi af det.
`look.md` afsnit 3 kalder det et udkast, ikke en fejl og ikke en stil. De to manglende
fotografier står i `ASSET-MANIFEST.md` som `requested`. Briefen siger at der ikke findes
fotografi, og at alt visuelt skal være CSS, SVG eller typografi, så det er sådan siden er
bygget. Bestillingen bortfalder ikke af den grund, og en udgivelse afventer den.

## Files opened

- SKILL.md
- run.md
- look.md
- stacks/static.md
- verify.md
- scripts/ledger.mjs
- scripts/gate.mjs
- scripts/verify.mjs
- scripts/critique.mjs
- scripts/stack.mjs
- scripts/components.mjs

Ingen gulvfil er åbnet: `run.md` trin 5 siger at en læse-flade ikke har en, fordi afsnit 1
til 8 i `SKILL.md` er hele instruktionen. `motion.md`, `redesign.md` og `delegation.md` er
ikke åbnet, fordi briefen hverken beder om at blive båret gennem noget, om et redesign
eller om arbejde der deler sig i uafhængige dele. `stack.mjs detect` fandt ingen stak, så
`run.md` afsnit 12 gælder: ren HTML og CSS uden byggetrin, hvilket er præcis det briefen
beder om. `components.mjs detect` fandt intet installeret og ingen lokal komponentmappe.

## Retningen, som den blev afgjort

  thesis 1: En fyrlisteoptegnelse man kan stå inde i
  thesis 2: Et ur der tilfældigvis er en bygning
  thesis 3: En vagtplan med et tårn på
  built: thesis 2 på aksen tid mod sted
  runner-up argued: thesis 1
  signature: `.optik`, 1. ordens Fresnellinsen i snit på sit kviksølvbad, målsat 920 mm
  risk: siden viser aldrig selve fyret
  answer to the risk: `.rejsning`, tårnet i opstalt med 35 m og koten 57 m over havet
  second reading: `.trappen`, 154 trin tegnet ét for ét
  originality pass: to swaps. Den anden ændrede planen fra tre figurer i ét dokument til
  to koordinatsystemer med hver sin læseretning, tid på tværs og højde ned

Anti-gentagelses-ledgeren blev kørt: `ledger.mjs check` mod nio tidligere aftryk på denne
maskine, verdict passed, ingen veto. Aftrykket er `light|sans|supporting|flat-surfaces+
hairline-separators+tabular-figure-motif`, bunden er akromatisk, og der er ingen mættet
accent at kollidere med. Aftrykket er ikke committet til den delte ledger: det ville skrive
uden for byggemappen, og opgaven her holder alt inde i den.

## Kritikken, taget mod den render der sendes

Besvaret af en frisk agent, der kun fik briefen og skærmbillederne. Hverken
retningsprotokollen, kildekoden, gate-output eller denne rapport var i dens kontekst.
Låst mod render `4bbba442a2ec5252`, én korrektionsrunde.

1. Øjet lander på det sorte 445x575 linsesnit ved x110/y287, den eneste mørke masse på den
   blege flade, så siden først fortæller hvordan en Fresnellinse er bygget, og selve svaret,
   Fl(3) W 30s ved 64px, skal vinde en kamp det aldrig burde have været i.
2. Værditabellen med etiket til venstre og tal til højre læses som skabelon, og den bruges
   to gange i træk under et fire-spaltet fodgitter, så sidens underliggende form er
   datablad, datablad, kontaktspalter.
3. Signaturen er den afkodede kending, Fl (3) W 30s sat stort med blink / tre af dem /
   hvidt / perioden under hver sin tegngruppe, og den overlever på én linje ved 375, men den
   er livløs: en side hvis emne er en rytme i tiden gengav den rytme udelukkende som tal i
   en tabel, og intet på siden tog nogensinde 0,3 eller 21,1 sekunder.
4. Tommest er Tågesignal-båndet: 3 s og 60 s sidder i venstre halvdel, afsnittet stopper ved
   omkring x715 og efterlader 350px død bund ud til højre kant, og ved 375 stabler de to tal
   sig til to ensomme rækker. Det er ikke stilhed omkring et tågesignal, det er et afsnit
   der løb tør for materiale.
5. Hirtshals, Fyr, Fl (3) W 30s, Tågesignalet, 3 s, 60 s. Ingen konkurrent kan sige det,
   fordi Fl(3) W 30s er netop dette tårns fingeraftryk og ingen andres, og det er det ene
   sted hvor siden uomtvisteligt er sig selv.
6. Ja. Med hoved, titel og linsesnit dækket til lader tårnets opstalt med 35 m, 57 m over
   havet og 154 trin plus Fyret passes af Sonja Kvist og Aage Thomsen ingen tvivl om at
   dette er et fyr i drift, som man muligvis kan komme op i.

ACCEPT. Det værste: Tågesignal-afsnittet er et hul, to tal og et afsnit med 350px ingenting
ved siden af, på en side der ellers aldrig én eneste gang viser en varighed som varighed.

**Korrektionsrunden, én, som `look.md` tillader.** Tågesignal-båndet fik en strimmel i hele
spaltens bredde: ét minut i samme skala, hvor stødet er en massiv blok på 3 sekunder, resten
af minuttet er en flade, og der er mærke for hvert 10. sekund. Tomheden i båndet er nu selve
indholdet, fordi det er præcis det tågesignalet er. Tågesignalets tal er de eneste i briefen
der går op, så det er den ene rytme der kan tegnes målfast, og det er grunden til at det er
den der blev tegnet. Inden for samme runde tvang gaten tre mekaniske rettelser frem, som
står nedenfor. Kritikken blev derefter låst om igen mod den render der faktisk sendes, uden
en anden korrektionsnote, så hashen beskriver den side der ligger her.

Reviewerens punkt 1 er ikke fulgt, og det er en uenighed og ikke et overset punkt.
`look.md` afsnit 4 forlanger at et **objekt** ejer første skærm, og kendingen er typografi.
Snittet ejer skærmen, kendingen ejer argumentet ved siden af, og reviewerens punkt 5 og 6
siger at netop kendingen er det ene sted siden er sig selv. Punkt 2 er noteret: to
værditabeller er sidens hovedgreb, og strimlen er nu det tredje bånds eget greb i stedet
for en tredje tabel.

## Mechanical findings

- `verify/tap-target-nav`: navigationslinkene "Lyset" og "Besøg" målte 33px og 40px i bredden, under gulvets 44px, på alle tre bredder.
- `verify/measure-34ch-at-768`: afsnittet i Tågesignal-båndet målte 34 tegn ved 768px, under gulvets 45.
- `verify/duplicate-phone-label`: to kontroller med samme etiket, "98 94 22 71", i besøgsafsnittet og i foden, på alle tre bredder.
- `gate/em-dash-in-brief-copy`: `builds/L/BRIEF.md:2` indeholdt et tankestreg-tegn, som pakken forbyder i enhver fil under byggemappen.
- `gate/token-literal-wordmark`: `index.html:107`, `font-size: 1.375rem` som literal på et kaldested i `.navn`.
- `gate/token-literal-value`: `index.html:202`, samme literal i `.værdier .stor dd`.
- `gate/lopsided-band-fog`: `section#tagesignalet` ved y=980, 547px høj, 68 procent af dens rækker stoppede mod én kant, den smalleste med 4 procent af bredden, 112px bund til venstre og 1267px til højre.
- `critique/fog-band-is-a-hole`: den friske reviewers værste punkt, se ovenfor.
- `critique/signature-inert`: siden gengav en rytme i tiden udelukkende som tal.
- `critique/eye-lands-on-the-drawing`: øjet lander på snittet før kendingen.
- `critique/spec-table-repeats`: værditabellen er brugt to gange i træk.

Ingen andre fund. `verify.mjs` meldte nul blokerende: ingen konsolfejl, ingen døde links,
ingen vandret overløb ved 375, 768 eller 1440, nul axe-overtrædelser i begge farveskemaer,
og nul fund i reduced-motion-passet. `gate.mjs` melder nu at hver eneste kontrol kørte og
ingen af dem afviste.

## Reconciliation

- `verify/tap-target-nav`: confirmed. Målingen var rigtig og det var bredden, ikke højden. Navigationslinkene har nu `min-width` på 44px og centreret indhold, og afstanden mellem dem er 28px, over gulvets 24.
- `verify/measure-34ch-at-768`: confirmed. Tågesignalets gitter skiftede til tre spalter allerede ved 48rem. Knækket er flyttet, så det er to spalter fra 20rem og tre fra 62rem, og afsnittet spænder over begge spalter indtil 62rem. Målet ligger nu inden for 45 til 80 på alle tre bredder.
- `verify/duplicate-phone-label`: false-positive, reason: de to kontroller har samme etiket fordi de har samme mål og samme hensigt, og `SKILL.md` afsnit 7 forlanger netop at en kontrol beholder samme ord hele vejen igennem. Reglen den er skrevet imod rammer to *forskellige* etiketter på én hensigt, og gatens egen `cta/duplicate-intent` afviser ikke her. To numre havde været fejlen.
- `gate/em-dash-in-brief-copy`: confirmed. Briefen blev kopieret ind i byggemappen for at gøre kritik-pakken selvstændig. Den er slettet igen. Tegnet står i kundens egen tekst og bliver ikke rettet i kundens tekst.
- `gate/token-literal-wordmark`: confirmed. Nu `--str-plade-lille`.
- `gate/token-literal-value`: confirmed. Samme token, samme sted i skalaen, hvilket var pointen med at give den et navn.
- `gate/lopsided-band-fog`: confirmed, og det var det samme problem som reviewerens værste punkt, målt i stedet for set. Rettet på to måder: sætningen i rækken sidder nu i den anden ende af båndet, så rækken når fra kant til kant, og strimlen har fået sin egen flade, så minuttet er en malet flade og ikke et fravær. Båndet er nu det eneste på siden der når helt ud i begge sider, hvilket er det rigtige for det bånd, fordi det er der tiden ligger.
- `critique/fog-band-is-a-hole`: confirmed. Korrektionsrunden, se ovenfor. Reviewerens anden halvdel af punktet, de to ensomme rækker ved 375, er lukket i samme runde: tallene står nu som et par fra 20rem og opefter, og afsnittet spænder over begge spalter indtil 62rem, hvor det flytter ud i den anden ende af rækken.
- `critique/signature-inert`: confirmed i det omfang det kunne lukkes. Strimlen viser nu en varighed som varighed. Selve kendingens rytme er stadig kun tal, og det er med vilje: briefens fire tal om lyset går ikke op, se spørgsmålet nedenfor, så enhver målfast tegning eller animation af dem ville hævde et tal kunden ikke har oplyst.
- `critique/eye-lands-on-the-drawing`: missed-by-the-model i den forstand at reviewer og bygger er uenige om hvad der bør eje første skærm, ikke om hvad der gør det. Ikke ændret. Begrundelsen står under kritikken.
- `critique/spec-table-repeats`: confirmed, delvist rettet. Tredje bånd har nu sit eget greb i stedet for en tredje tabel. De to tilbageværende tabeller står i hver sit koordinatsystem, sekunder og meter, og bliver stående.

## Run notes

- viewports: 375, 768 og 1440 px optaget af `verify.mjs`, plus en reduced-motion-render ved 1440. Fire PNG i `.sitesmith/shots/`.
- axe both schemes: ran, både light og dark, 0 overtrædelser, 0 alvorlige eller kritiske
- live server: ran, `.sitesmith/server.mjs` på http://localhost:4173/. `verify.mjs` kørte mod den, `gate.mjs` og `ledger.mjs` mod `index.html` som file-URL.
- anti-slop linter: ran, `gate.mjs` med `--draft`: ærlighed, forbudt palet, navngivne skrifttyper, AI-lilla, dublerede CTA-hensigter, token-drift, antipattern-detektoren og de målte look-kontroller
- fallbacks: none

## Tilstande, gået igennem på den byggede side

Siden har præcis én slags interaktivt element, links: tre i navigationen, ét spring-link og
to telefonlinks.

- rest: alle syv, i brødtekstfarve eller dæmpet farve
- hover: understregningen bliver dobbelt så tyk, og navigationslinks skifter til fuld tekstfarve. Aldrig den eneste markering, fordi berøring ikke har hover.
- focus-visible: 3px kontur i `--blæk` med 3px afstand, målt til 12,2:1 mod sin egen flade, over gulvets 3:1. `verify.mjs` gik gennem 6 tabulatorstop på alle tre bredder og fandt ingen uden synlig markering.
- active: teksten skifter til `--dæmp`
- disabled: findes ikke. Der er intet på siden der kan slås fra, og et link der ser klikbart ud og ikke virker ville være en fejl at bygge.
- loading: findes ikke. Siden er én statisk fil, og der hentes intet efter indlæsning.
- empty, error, partial: findes ikke af samme grund. Der er ingen liste der kan være tom, ingen indtastning der kan fejle, og intet indhold der kan ankomme halvt.

## Journeys

Ingen. `verify.md` beder ikke om en for en læse-flade, og `gate.mjs` kræver den kun for
buy, operate og redesign. Siden har ingen interaktiv sti at køre igennem: der er links, og
et link er ikke en rejse. En spec-fil her ville være en røgtest med et kontraktnavn på.

## Designprotokol, skrevet fra det der faktisk står i stylesheetet

**Farver.** Ti værdier, alle navngivet efter et materiale i fyret og ingen efter en rolle:
`--kalk` rgb(222,230,224) som bund, `--mørke` rgb(11,26,22) som tegningens bund, `--blik`
hvid, `--kviksølv` rgb(154,163,166), `--glas` rgb(74,107,99), `--blæk` rgb(29,38,36),
`--dæmp` rgb(77,91,87), `--linje` rgb(182,193,187), `--mål` rgb(111,127,121) og `--felt`
rgb(213,223,216) til minuttets flade. Ingen af dem er mættet, og gaten måler ingen accent.
Målt kontrast: brødtekst 12,2:1, dæmpet tekst 5,6:1, mållinjer 3,3:1, hvid på mørk 17,9:1.

**Typografi.** To skrifter, to opgaver. Marcellus 400 til overskrifter, kendingen og de
store tal. Archivo 400 og 500 til alt andet, med `font-variant-numeric: tabular-nums` på
hver målt værdi. Alle brødstørrelser er `clamp()`, og den ene faste størrelse har et navn,
`--str-plade-lille`. Ingen versaler og ingen sperret majuskel-mærkat noget sted: det er den
ene vane fra husets egen runde 8 som denne side bevidst ikke har.

**Struktur.** Fire bånd, fire forskellige former: lyset som to spalter 38/62 med tegningen
først, tågesignalet som en tre-delt række fra kant til kant plus en strimmel, besøget som to
spalter 62/38 med teksten først, foden som fire lige spalter. Hvert båndhoved bærer sin egen
enhed til højre for samme streg, fordi lyset måles i sekunder og turen op måles i meter og
trin. Ingen trinnumre og ingen eyebrows: intet på siden er ordnet, så intet påstår at være
det.

**Tegninger.** To inline SVG plus én strimmel bygget i ren CSS. Begge SVG males udelukkende
gennem CSS-klasser der peger på sidens egne custom properties, uden en eneste `fill`,
`stroke` eller `stroke-width` som attribut, så tegningerne flytter sig når systemet gør.
Optikken er tegnet i millimeter, én brugerenhed er én millimeter, så de 920 mm er en
virkelig afstand på siden.

**Materialitet.** Ét trykraster: `repeating-radial-gradient` i `--korn` ved 3px, to
erklæringer, alene på `body`.

**Bevægelse.** Ingen. Se spørgsmålet nedenfor.

**Afvigelse fra planen.** Planen sagde at tågesignalet skulle bæres af typografi alene. Det
holdt ikke, hverken for reviewer eller for gate, og båndet fik en strimmel. Retningen er
ikke ændret af det: strimlen er den samme akse som båndets egen enhed lovede, tid på tværs,
og den er nu holdt i stedet for kun skrevet. Tågesignalets gitter fik desuden et knæk mere
ved 36rem, fordi målingen ved 768px viste 34 tegn, under gulvet på 45.

**Defekter denne bygning bærer.** Ingen kendte tekniske. Siden har ét farveskema, lyst, og
det er en beslutning med en grund: siden er et ark fra en søfartsmyndighed og har ét
udseende, og mørket ligger inde i tegningen, hvor det hører hjemme. Det skal ikke arves som
en regel af den næste bygning.

## Spørgsmålet jeg ville have stillet

Der var ingen at spørge, så det står her, og min default er kørt.

**Briefens fire tal om kendingen går ikke op.** Tre blink på 0,3 sekund, 3 sekunder
imellem, og derefter 21,1 sekunders mørke giver 0,3 + 3 + 0,3 + 3 + 0,3 + 21,1 = 28,0
sekunder, mens perioden er opgivet til 30 sekunder. To sekunder er ikke gjort rede for.
Enten er mørket 23,1 sekunder, eller også er mellemrummet 4 sekunder. Spørgsmålet er hvilket
af de to tal der skal rettes.

Min default: alle fire tal står på siden nøjagtigt som briefen giver dem, hvert med sin egen
etiket, og ingen geometri på siden hævder en varighed for lyset. Det er derfor kendingen
ikke er tegnet som en 30-sekunders skive, og det er derfor siden ikke bevæger sig. En skive
eller en animation skal vælge et tal som kunden ikke har oplyst, og det valg er ikke mit.
Tågesignalet er tegnet målfast, fordi dets tal er de eneste der går op.

## Andet der ikke er lukket

- **Fotografiet.** Se `draft: yes` øverst. To rækker i `ASSET-MANIFEST.md` venter på kunden.
  Uden dem er dette et udkast, uanset at alle kontroller er grønne.
- **Højden over terræn.** Briefen giver 35 m tårn og 57 m over havet. Opstalten tegner lyset
  øverst i tårnet, hvilket er det de to tal tilsammen antyder, men grundlinjen er med vilje
  uden tal, så der ikke står et mål briefen ikke har givet.
- **Linsens højde og bredde.** Kun brændvidden er opgivet, så kun brændvidden er målsat.
  Snittets lodrette udstrækning er en tegnekonvention, og billedteksten siger det.
- **Reviewerens punkt 1.** Uenigheden om hvad der skal eje første skærm er ikke løst, den er
  begrundet. En anden runde ville være den runde hvor siden bliver slebet flad.
