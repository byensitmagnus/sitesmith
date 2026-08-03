# Direction record

## Autopilot, skrevet først så resten planlægges ved siden af det den ikke må blive

Varm råhvid bund omkring #f7f5f1, én mørkegrøn accent, Fraunces eller en anden display-serif,
en hero med "Få prisen på din rude på 30 sekunder", underrubrik og en grøn knap til højre.
Derunder tre afrundede kort med glastyperne og et lille ikon i en afrundet firkant på hvert.
Så en beregner i et kort med skygge og en klæbrig totalpris i bunden af skærmen, en
FAQ-harmonika, og en fod med åbningstider. Mono-versaler som øjenbryn over hver sektion,
hårfine streger mellem rækkerne. Det er den side der bygger sig selv. Den bygges ikke.

## Surface

buy

## Subject

Et glarmesterværksted i Horsens der skærer enkeltruder til gamle vinduer og drivhuse og
sælger dem i trækasse eller til afhentning. Til folk der har et hul i huset i dag, kan holde
et målebånd, men ikke ved hvad 4 mm float er. Den ene ting siden skal gøre: give en rigtig
pris ud fra kundens egne to mål, før nogen løfter telefonen.

## Constraints in force

- Dansk copy hele vejen.
- Astro med et rigtigt produktions-build. Ingen CMS, ingen database, ingen betalingsudbyder.
- Prisen regnes i browseren uden netværkskald.
- 375, 768 og 1440. Tastaturet hele vejen, synligt fokus.
- prefers-reduced-motion standser arbejdet, ikke kun animationen.
- Intet fotografi er leveret og intet må genereres. Alt visuelt er CSS, SVG eller typografi.
- Ingen anmeldelser, ingen kundenavne, ingen tal på hvor mange ruder der er skåret, ingen
  påstande om kvalitet eller håndværk ud over de fakta briefen giver.
- Siden skal selv sige at Glarmester Nordlys er et opdigtet eksempel bygget for at vise SiteSmith.

## Assets that exist

Ingen. Der er ikke leveret et eneste billede, og briefen forbyder at generere et. Alt visuelt
på siden er tegnet her i SVG og CSS, og ASSET-MANIFEST.md fører hver tegning med kilde og
licens. Det aktiv der mangler, står navngivet i manifestet: et fotografi af skærebænken på
Glarmestervej 8. Kørslen er derfor en draft indtil værkstedet leverer det.

## Nouns

rude, sprosse, kitfals, sømfals, bundglasliste, linoliekit, falsdybde, falsmål, vaterpas,
glarmesterdiamant, skæreolie, skærebænk på 2,4 m, ridsen, knækket, kanten, trækasse,
lagerplade, klart float 4 mm og 6 mm, valset katedral 4 mm, trukket antikglas 3 mm,
0,15 m² minimum, 3 mm luft på hver side, 2.200 mm, 11 m² tilbage, 285 kr,
2 og 5 arbejdsdage, 07:30, 15:30, 12:00, Glarmestervej 8, 8700 Horsens, 75 62 11 09,
Verner Nordlys 1954, Solvej Nordlys, Rikke Damm, Tobias Bjerg.

Mærkerne værkstedet efterlader: ridsen fra diamanten, den friske kant, kridtet på bænken,
olien på hjulet, tallet skrevet på glasset, kassen der er skruet og ikke sømmet.

## Theses

1. En rude man kan læse prisen igennem: siden er et stykke glas, og tallet står inde i det.
2. Skæresedlen der udfylder sig selv, mens du måler: siden er værkstedets egen seddel, og
   den besøgende sidder og skriver den ordre som Rikke eller Tobias skærer efter i morgen.
3. Et målebånd med en pris på: siden er et måleinstrument, og prisen er en aflæsning.

## Case for the runner-up

For: 1

Glas er det eneste materiale i denne forretning, og forslag 1 tager konsekvensen af det:
bunden er en rudeflade set fladt på, tallet ligger inde i fladen, og hele siden er ét
gennemsigtigt lag hvor prisen bogstaveligt kan læses igennem materialet. Det har en styrke
som sedlen ikke har, nemlig at kunden aldrig behøver forstå et papir for at forstå tallet;
man kigger på glasset og tallet er der. Det ville også løse førsteskærmen uden en eneste
kasse, fordi en flade kan bære et enkelt tal alene. Det blev fravalgt på ét punkt: en flade
kan ikke bære fire fejltilstande, to mål, en glastype og et leveringsvalg uden at blive en
formular oven på en flade, og så er gennemsigtigheden pynt.

## Built

Built: 2, axis: hvilket fysisk dokument handlen efterlader, because briefen slutter ikke i en
betaling men i en skriftlig specifikation som værkstedet kan skære efter, og det dokument er
skæresedlen. Når sedlen er artefaktet, bliver hvert felt en linje på den, og kunden ser hele
tiden præcis det som glarmesteren kommer til at læse.

## Colour

Værkstedets egne materialer, ikke roller. Seks, fordi værkstedet har seks.

- --glasflade: #dbe3dd, floatglas set fladt på i nordlys. Sidens bund.
- --skaerebaenk: #c3cec6, filten på skærebænken. Fladen som seddel og tabel ligger på.
- --blyant: #1c2426, blyantsstregen på sedlen. Brødtekst, rubrikker og målstreger.
- --rudekant: #16584a, det grønne i en frisk skåret glaskant. Bærer prisen og den ene knap.
- --linoliekit: #cbb684, linoliekit i falsen. Antikglasset og det der er ved at slippe op.
- --roedkridt: #a33a1e, rødkridtet der markerer et snit der ikke må laves. Fejl.

Målt i browseren: brødtekst #1c2426 på #dbe3dd giver 13,9:1. Hvid på #16584a giver 6,4:1.
#a33a1e på #dbe3dd giver 5,4:1. #cbb684 bruges aldrig som tekstfarve.

## Type

To roller, to forskellige snit, begge findes på den maskine der renderer.

- display: "Bahnschrift", den DIN-afledte smalle grotesk der følger med Windows. Den er
  hånden der skriver mål på en tegning, og den bruges kun til rubrikker og til hvert tal der
  er et mål. Vægt 400 og 600, skala 17 / 21 / 27 / 38 / 54 px, sporing -0,01em.
- body: "Sitka Text", en læseserif med rigtig karakter. Al løbende tekst, 17 px,
  linjeafstand 1,55, målet holdt mellem 45 og 78 tegn.

Ingen af de to er det par man griber efter. Den tekniske grotesk står kun på målene, og
serifen bærer alt det der skal læses som sprog.

## Density, motion and boldness

Tæt hvor der er tal, luftigt hvor der er sprog. Sedlen er sat i en 8 px basisrytme, tabellen
i en 4 px. Intet bevæger sig: ingen transition på transform eller opacity, ingen entrance,
ingen hover-effekt der flytter noget. Prisen er simpelthen anderledes på næste optegning, og
formen af svaret står der i forvejen så layoutet ikke hopper. Dristigheden ligger ét sted, på
bænketegningen, og alt omkring den er stille.

## Structure

Fire sektioner og ingen nummerering, fordi rækkefølgen ikke er en rækkefølge kunden skal
følge: skæresedlen, glasset, leveringen, værkstedet. Ingen øjenbryn over sektionerne, fordi
et øjenbryn påstår en kategori som ikke findes her. De eneste streger på siden er målstreger
med pilespids, og de påstår noget sandt: her er der målt fra og til. De fire glastyper står
som én liste med samme kolonner og ikke som kort, fordi de er én liste.

## First screen

Bænken. Skærebænken er 2,4 m, og det er derfor intet over 2.200 mm forlader den, så det er
det stærkeste sande materiale forretningen har. Førsteskærmen er en målt tegning af bænken
med 2.200-grænsen sat af, og så snart det første mål er tastet, tegnes ruden ind på bænken i
rigtigt forhold med målstreger og tallene siddende på stregerne. Rubrik og felter ligger til
højre for tegningen på 1440 og under den på 375.

```text
1440
+--------------------------------------------------------------+
| Glarmester Nordlys   Glarmestervej 8      Sedlen  Glasset ... |
+--------------------------------------------------------------+
|  h1 Skriv skæresedlen selv         |  fals til fals: [     ]  |
|  <-------- 2.200 --------->        |                 [     ]  |
|  +==============================+  |  glas:  ( ) ( ) ( ) ( )  |
|  |  +---------+                 |  |  udlevering:  ( ) ( )    |
|  |  |  ruden  | 604             |  |  -----------------------  |
|  |  +---------+                 |  |  falsmål   594 x 894 mm  |
|  +==============================+  |  areal     0,531 m²      |
|      874                           |  pris      340 kr        |
|                                    |  [ Skriv skæresedlen ]   |
+--------------------------------------------------------------+
```

## Imagery treatment

Ingen fotografier findes og ingen må laves, så alt billedmateriale er målte tegninger i SVG,
tegnet her, med målstreger og tal på stregerne og aldrig et tal uden en streg der siger
hvorfra og hvortil. Tre tegninger i samme stregtykkelse og samme pilespids: bænken med ruden
på, ugen i værkstedet, og et snit gennem falsen. Ingen ikoner, ingen dekorativ grafik. Det
manglende fotografi er navngivet i manifestet i stedet for at blive tegnet udenom.

## Argument order

1. Du kan skrive sedlen selv, og her er bænken den skal skæres på.
2. To mål, en glastype, afhentning eller kasse, og prisen står der.
3. Hvad de fire glas er, hvad de koster pr. m², og hvad der er tilbage af antikglasset.
4. Hvornår den er skåret, og hvordan den kommer hjem, målt mod værkstedets egen uge.
5. Hvem der skærer den, hvor, og hvad de ikke laver.

## Signature

Bænken med ruden på, `.baenk`: en målt tegning i SVG hvor skærebænkens 2.200 mm er tegnet én
gang for alle, og den besøgendes egen rude tegnes ind på den i rigtigt forhold, med
målstreger og tallene siddende på stregerne. Den er tom på en ærlig måde før der er tastet
noget: bænken står der, grænsen står der, og ruden mangler.

## Risk

Siden er en formular og ellers ingenting, så den der ikke har målt endnu har intet at læse og
går igen. Det er en reel risiko her, fordi målebåndet ligger i skuffen når ruden går i
stykker, og fordi briefen forbyder alt det man plejer at fylde en sådan side med.

## Answer to the risk

Risikoen ovenfor besvares af `.falsmaal`, et målt snit gennem falsen med de 3 mm luft på hver
side tegnet ind, som står på siden uanset om der er tastet noget. Den der ikke har målt endnu
får dér den ene ting vedkommende kom efter, nemlig hvor målebåndet skal sættes, og kan gå hen
og måle og komme tilbage.

## Second reading

`.uge` tegner værkstedets egen uge: mandag til torsdag 07:30 til 15:30, fredag 07:30 til
12:00, weekenden lukket, og skæredagene og kassedagene lagt ind i den. Den ligger i
leveringsafsnittet under første skærm og læser en helt anden måling af forretningen end
signaturen gør: signaturen læser millimeter og bænkens længde, ugen læser klokkeslæt og
arbejdsdage.

## The shell

Who: Glarmester Nordlys, i toppen til venstre og igen i foden med Solvej, Rikke og Tobias.
Where: Glarmestervej 8, 8700 Horsens, i toppen og i foden. Do: skriv skæresedlen, knappen
`.skriv` i skæreafsnittet, og ring 75 62 11 09 i foden som telefonlink.

## Assumptions

- 1.000 x 700 mm for trækassen læses uafhængigt af orientering: den længste side skal være
  1.000 mm eller derunder og den korteste 700 mm eller derunder.
- Grænserne 30 mm og 2.200 mm gælder falsmålet, altså den rude der forlader bænken, og ikke
  det tal der tastes. Fejlbeskeden skriver begge tal så det er til at se.
- Kassemålet vurderes også på falsmålet, fordi det er ruden der ligger i kassen.
- Arealet regnes af falsmålet og rundes til tre decimaler, som briefen skriver. Minimum
  0,15 m² lægges på efter afrundingen.
- Briefen har ingen e-mailadresse, så ordren afsluttes ikke i en afsendelse. Sedlen skrives,
  og telefonnummeret og adressen står på den. Det er også den ærlige version: intet betales
  før afhentning eller faktura.
- Ingen dark mode. Briefen beder ikke om den, og der er ét lys i dette værksted.
- Ingen islands. Der er ingen framework-komponent på siden; regnestykket er ét modulscript i
  index.astro, så der er ingen client-direktiver at føre.

## Originality pass

Byttet brief: samme plan lagt på et andet glarmesterværksted i samme by. Det der overlevede
var prislisten og leveringsafsnittet, altså det generiske, og det der faldt var bænken, fordi
2,4 m og 2.200 mm er dette værksteds tal og ikke fagets. Rettelse: bænken flyttede fra en
illustration i bunden til at være selve førsteskærmen og selve prisfeltets baggrund, så
sidens stærkeste billede ikke kan flyttes til naboen.

Byttet fag: samme plan givet til et bogbinderi på en anden etage. Formen holdt, og det var
problemet: to mål ind, et areal ud, en pris, en leveringstid, en tegning der skalerer. Det er
en proces og ikke et design. Rettelse: sedlen er ikke længere et resultatpanel ved siden af
formularen. Felterne er selve sedlens linjer, så der ikke findes en formular og et resultat,
kun ét dokument der er halvt udfyldt. Et bogbinderi ville skulle rive det ned og bygge sit
eget dokument, fordi en skæreseddel er glarmesterens papir og ikke et panel.

Rundens husstil, tjekket mod SKILL.md afsnit 5: ingen mono-versaler, ingen kortgitre, ingen
skygger, ingen afrundede hjørner over 0, ingen nær-sort bund, ingen bred sporing på versaler,
hverken øjenbryn eller nummererede trin.

## One-offs
- `none` intet literalt mål, ingen skygge og ingen farve står på et kaldested; alt går gennem var()

## Deliberate
- `none` dette build påstår ingen antipattern med vilje
