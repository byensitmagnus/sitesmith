# Direction record

## Autopilot, written first so the rest is written next to it

The page I would make without thinking: a near black console, ground about #0f1115, a left
rail of icons, a top bar with a shift clock, four KPI tiles across the top (vogne i dag,
tons i dag, gennemsnitlig vandprocent, ventetid), each tile a rounded card with a hairline
border and a thin uppercase mono label tracked wide. Under them a data table of the queue
with zebra rows, and to the right a card for den aktuelle vogn with three radial rings for
vand, protein og fremmedlegemer, each ring filling from a teal to an amber, the threshold
drawn as a notch. One green primary button, "Send til silo". Everything flat, everything
Inter, every figure tabular, every divider one pixel of #262a30. The clever move would be
the three rings.

That page is built from dashboard conventions, not from a grain intake. It is not built.

## Surface

operate, indvejningsskærmen i vægthuset ved kornmodtagelsen

## Subject

Kornmodtagelsen hos Hobro Andel. Skærmen på væggen i vægthuset, som én modtagemand passer
fra klokken 06 til sidste vogn i høsten. Den ene ting skærmen skal gøre: vise hvilken vogn
der står på broen og hvor lasten kan komme hen, uden at man læser, og lade manden anvise
lasten fra samme skærm.

## Constraints in force

- Dansk copy. Én selvstændig HTML-fil, ingen framework, ingen ekstern JS. Google Fonts er
  tilladt. Statiske demodata, synligt plausible, aldrig lorem.
- Ingen opfundne grænseværdier og ingen opfundne gårdnavne ud over plausible.
- Bygget til 1440 først, brugbar ved 768, må ikke knække ved 375.
- Ingen stak fundet af `stack.mjs detect`, så ren HTML og CSS uden byggetrin, jf. run.md
  afsnit 12 og `stacks/static.md`.
- Kun brevets fakta må stå som sandt. Alt andet på siden er demodata og skal se ud som
  demodata, ikke som løfter.

## Assets that exist

Ingen. Der er ikke udleveret fotografier, logo, plantegning over cellerne eller skærmbillede
af det nuværende system. Alt visuelt på siden er tegnet her: otte celler i opstalt, en
vandkurve for dagen, en hatch der står for korn. Det fotografi der mangler, og som er bedt
om i rapporten, er cellevæggen set fra vægthusets vindue med nummereringen på.

## Nouns

Brovægt, brodæk, indvejning, udvejning, tara, netto, brutto, kilo, tons, vejeseddel,
fragtbrev. Prøvespyd, spydprøve, delprøve, prøvebakke, vandprocent, proteinprocent,
fremmedlegemer, avner, halmstrå, sten, kornstøv. Tørreri, varmluft, celle, siloceller,
indløb, snegl, elevator, kornsuger, kornlem, hydraulisk tip. Hvede, byg, rug, havre.
Kapacitet, fyldning, resterende plads, svind. Køen på pladsen, lastvogn med hænger,
nummerplade, chauffør, vognmand. Lyskurven ved broen, grønt og rødt. Galvaniseret plade,
beton i graven, malet stål på cellerne, støvet der står i lyset klokken seks om morgenen.
Broen læser hvert sekund, og mellem to vogne læser den nul.

## Theses

1. En brovægt der tænker: den levende vægt er skærmens største tal, og alt andet er noter til den.
2. En cellevæg man kan pege en vogn mod: de otte celler står i opstalt, og anvisningen er at pege på en af dem.
3. Et prøvekort der bliver udfyldt og stemplet: skærmen er vejesedlen, aflæsningerne og underskriften.

## Case for the runner-up

For: 1

Vægten er det eneste tal på pladsen der allerede er afgjort, og det er broen der afgør det.
Den mand der har taget imod i femten høste skal ikke bruge skærmen til at vide hvad vognen
vejer; han skal bruge den til at vide hvor lasten må hen, og det er en anden slags tal. Et
skærmbillede bygget om den levende vægt gør det største objekt til den ene oplysning ingen
skal tænke over, og skubber cellerne ned i en tabel hvor de skal læses. Alligevel er der en
rigtig grund til tese 1: vægten er det eneste der er live, den skifter hvert sekund, og et
tal der bevæger sig er det øjet finder først i et rum med støv og modlys. Havde skærmen
skullet ses fra pladsen gennem vinduet, og ikke fra stolen ved bordet, ville tese 1 være
den rigtige. Den taber på afstanden: manden sidder to meter fra skærmen, og på to meter er
en tegning hurtigere end et tal.

## Built

Built: 2, axis: hvad skærmen gør størst er det manden afgør, ikke det maskinen måler, because anvisningen er dagens eneste beslutning og de otte celler er dens eneste udfald

## Colour

Farverne er taget fra det modtagelsen faktisk er lavet af, og de er talt op efter hvor mange
materialer der er, ikke efter hvor mange roller et interface plejer at have. Fire afgrøder
har fire farver, fordi cellerne står med fire slags korn i. Lyskurven ved broen har to.

- --zink: #b2b6b7, den galvaniserede plade på vægthuset, sidens bund
- --dis: #d0d5d6, kornstøvet der står i lyset, de flader der løftes op fra bunden
- --tryk: #1b2428, trykfarven på vejesedlen, al brødtekst og alle tal
- --beton: #364042, graven under broen, anden tekst og etiketter
- --rille: #98a0a2, ridsen i pladen, alle hårstreger og alle skillelinjer
- --hvede: #c9a227, hvede som den ligger i bakken
- --byg: #c3bd82, byg, lysere og gråere end hvede
- --rug: #7d6a55, rug, brun og mat
- --havre: #9aa06d, havre, grågrøn med skal på
- --lampe: #0f6a2a, det grønne lys ved broen, og kun det: en celle der kan tage lasten
- --stop: #98291f, det røde lys ved broen, og kun det: afvist last og overskredet grænse
- --damp: #1f5763, dampen over tørreriet, og kun det: last der skal på tørreri

Pladen er mørkere end en skærm plejer at være, og den er uden farvestik. Det er den, fordi
galvaniseret stål er grå metal og ikke papir, og fordi `ledger.mjs` afviste tre lysere og
kulørte plader i træk, først en grågrøn og så to der lå for tæt på tidligere kørslers
grønne og blå. Farven på siden kommer derfor fra kornet og fra lyskurven, ikke fra bunden.
Den grønne lampe er sidens mest mættede farve, hvilket den også er på pladsen: det er
signalet der siger kør frem.

## Type

To roller, to forskellige snit, og ingen af dem er det par man griber til på et dashboard.

- display: "Big Shoulders Display", et smalt industrielt snit tegnet til skiltning, brugt
  til h1, celletallene og den levende brovægt, og ikke andre steder
- body: "Atkinson Hyperlegible", tegnet til at kunne læses hurtigt og forkert belyst, som
  er præcis den situation skærmen står i, brugt til al brødtekst, etiketter og aflæsninger
  med tabulære cifre

Trin: 12, 16, 21, 27, 34 og 58 px. Vægte: 400 og 700 i brødskriften, 500 og 700 i display.
Ingen versaler som stiltræk, ingen udspærring.

## Density, motion and boldness

Tæt, som en vejeseddel er tæt. Én arbejdsenhed på skærmen: den vogn der står på broen og de
otte celler den kan komme i. Al frimodighed ligger i cellevæggen; resten er stille.

Der bevæger sig én ting på siden, og det er broens aflæsning, som brevet siger læser hvert
sekund. Den står stille mens man taster, fordi man ikke skal tælle mod et tal der løber, og
den kan holdes med en knap. Ingen overgange, ingen indtoning, intet der venter mellem et
klik og dets resultat.

## Structure

Tre strimler i fuld bredde med samme indrykning, så alt blæk starter på samme lodrette
linje. Nummereringen 1 til 8 er cellernes egen. Grupperingen hvede 1 til 4, byg 5 og 6, rug
7, havre 8 er anlæggets egen. Grænserne 15,0 og 2,0 er brevets. Der er ingen 01/02/03, ingen
trinmarkører og ingen etiketter der kun siger at der kommer noget.

## First screen

Den stærkeste sande ting modtagelsen har er de otte celler med hver sin kapacitet og sin
fyldning. Det er det objekt der ejer første skærm.

```
+--------------------------------------------------------------+
| Hobro Andel  Kornmodtagelsen        På broen Cellerne Køen ...|
+--------------------------------------------------------------+
| PÅ BROEN                          | SPYDPRØVE                 |
| CV 41 872, Bramslev Hede          | vand [__] protein [__]    |
| ind 47.860 kg   ud vejes ved      | fremmedlegemer [__]       |
| udkørsel        broen: 47.862 kg  | [Godkend prøve]           |
+--------------------------------------------------------------+
| Hvede, 13,8 % vand: celle 1, 2 og 3 kan tage lasten           |
|  __   __   ___  ___   __   __   _    _                        |
| |::| |::| |   ||:::| |''| |''| |.|  |,|    otte celler i      |
| |::| |::| |   ||:::| |''| |''| |.|  |,|    opstalt, arealet   |
| |__| |__| |___||___| |__| |__| |_|  |_|    af kornet er tons  |
| [Anvis][Anvis][Anvis] 22 t   forkert afgrøde                  |
+--------------------------------------------------------------+
```

## Imagery treatment

Tegnet her, ikke fotograferet, og det er det rigtige svar for netop disse elementer: en
opstalt af et anlæg og en kurve over dagens vand er snit og diagram, ikke ting man kan
fotografere fra stolen. Cellerne er tegnet i skala: bredde og højde vokser med kvadratroden
af kapaciteten, så det tegnede kornareal er tonnagen. Fyldningen er en hatch, ikke en flade,
fordi korn ligger i lag. Ingen ikoner, ingen piktogrammer, ingen illustration af noget der
findes i virkeligheden og kunne være fotograferet.

Det ene fotografi siden mangler er cellevæggen med nummereringen, set fra vægthusets vindue.
Det er bedt om i rapporten.

## Argument order

1. Cellevæggen, fordi det er den beslutning der skal træffes.
2. Linjen over den, som siger med ord hvad væggen viser.
3. Vognen på broen, hvem den er og hvad den vejer ind.
4. Spydprøven, de tre aflæsninger og grænserne.
5. Køen, dagens vand og anvisningerne der ikke kan laves om.

## Signature

`.siloer`, cellevæggen: otte beholdere i opstalt på samme gulvlinje, hver tegnet i skala
efter sin kapacitet, fyldt med en hatch op til sin faktiske fyldning, og med lastens plads
tegnet som et bånd oven på fyldningen. Kornarealet i tegningen er tonnagen. Slaget er en
opstalt af en maskine, ikke et diagram: cellerne har konisk bund, forskellig højde og
forskellig bredde, og de der ikke kan tage lasten står stadig der, dæmpede, med grunden til
at de ikke kan.

## Risk

Skærmen bruger sit største areal på otte beholdere, hvoraf de fleste er dæmpede og ikke skal
bruges til noget lige nu, i stedet for på de tal et vægtprogram normalt gør størst. Hvis
manden i virkeligheden er flaskehalset på aflæsningen og ikke på valget af celle, har jeg
gjort det forkerte objekt størst.

## Answer to the risk

Risikoen er besvaret af `.melding`, linjen lige over væggen, som med ord siger det væggen
tegner: afgrøde, vandprocent og hvilke celler der kan tage lasten. Den kan læses uden at
tegningen læses, den står i samme skriftstørrelse som en overskrift, og den siger også hvad
der mangler, hvis prøven kun er halvt aflæst. Er tegningen forkert prioriteret, koster det
et blik ned på linjen og ikke en omvej.

## Second reading

`.dagsvand` tegner en anden af modtagelsens egne målinger end signaturen: vandprocenten i
hver af dagens anvisninger, i tidsrækkefølge, med grænsen 15,0 lagt tværs over, så man ser
formiddagens tørre korn og eftermiddagens stigning. Signaturen tegner tons og plads, denne
tegner procent og klokkeslæt. Den ligger under første skærm, i afsnittet Køen og dagen.

## The shell

Who: Hobro Andel, Kornmodtagelsen, i sidehovedet og igen i bunden. Where: vægthuset ved
broen, nævnt i bunden sammen med vagten fra 06.00 til sidste vogn. Do: den ene handling er
at anvise lasten til en celle, og den sidder på `.siloer` som en knap under hver celle der
kan tage den. Sidehovedet har fire genveje til skærmens egne afsnit, og bunden gentager dem.

## Assumptions

- Nettovægten kendes ikke mens vognen står på broen, fordi udvejningen først sker når den
  kører af. Pladsen i cellen regnes derfor på bruttovægten, og skærmen skriver det. Dette er
  den ene antagelse der ville have ændret hvad der blev bygget, hvis den var forkert.
- Modtagemanden taster de tre aflæsninger ind. Brevet siger prøven læses, ikke af hvem eller
  hvordan tallet når skærmen.
- Kun én vogn ad gangen står på broen, og køen er den rækkefølge de er kommet i.
- Alle navne, nummerplader, vægte, klokkeslæt, kapaciteter og fyldninger er demodata.
- Ingen stak, ingen komponentmappe, ingen fotografier. Bygget som én HTML-fil.

## Originality pass

Første ombytning, nabovirksomheden i samme fag: giv planen til en foderstofforretning ti
kilometer væk, som også vejer ind og også har celler. Det meste holder, og det er netop
tegnet på at planen indtil da handlede om branchen. Det der ikke holder er skalaen: en anden
modtagelse har andre kapaciteter, og cellevæggens skyline er kun sand for otte celler på
1.400, 1.400, 900, 900, 1.200, 1.200, 600 og 600 tons. Ændret: cellerne tegnes ikke ens og
normaliseret, men i faktisk skala, så væggen er dette anlægs silhuet og ikke en søjlegraf.
Grænserne 15,0 og 2,0 skrives på tegningen, ikke i en legende.

Anden ombytning, en helt anden branche: giv samme plan til et pantsystem eller en
lufthavnsgate. En strimmel foroven med det der er ankommet, et stort objekt i midten med
otte udfald, en logstrimmel forneden. Formen overlevede, og det er en proces og ikke et
design. Ændret: den levende aflæsning stopper mens man taster, fordi det kun giver mening
hvor et tal løber mens en hånd tæller; nettoen står som ukendt indtil udvejning, hvilket kun
findes hvor vægten måles to gange; og cellerne der ikke kan bruges bliver stående med deres
egen grund i stedet for at blive filtreret væk, fordi manden kender cellerne og skal se dem
alle otte. Ingen af de tre kan flyttes til gaten uden at blive løgn.

## One-offs
- `none` ingen literal længde, farve eller skygge står på et kaldested; alt går gennem tokens

## Deliberate
- `none` denne build påberåber sig intet antimønster med vilje
