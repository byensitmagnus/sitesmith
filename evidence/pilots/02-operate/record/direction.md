# Direction record

## Surface

operate

## Subject

Bjerregaard Sluse, en fiktiv kanalsluse. Skærmen er én slusevagts konsol fra 22:00 til 06:00,
åben på en anden skærm, kigget på hvert par minutter og for det meste ikke læst.

## Constraints in force

Dansk. Astro med rigtig produktionsbuild. Ingen levende forbindelse: natten den 3. august er
faste data i siden. 375, 768 og 1440. Tastaturnåelig, synligt fokus. prefers-reduced-motion
stopper arbejdet, ikke kun animationen. Ingen fotografier, intet genereret billedmateriale.
Ingen opdigtede måleværdier ud over briefens. Siden skal sige at slusen er et fiktivt eksempel.

## Assets that exist

Ingen. Ingen fotografier, intet logo, intet mærke. Alt visuelt er CSS, SVG eller typografi.
Manglende aktiv, navngivet: der findes intet fotografi af slusen, og en konsol har ikke brug
for et.

## Nouns

Kammer, port, portblad, portvinkel, hydraulisk tryk, portmotor, kammervandstand, datum,
sluseslag, radiolink, slusehus, vagt, kvittering, hold, skipper, lygte, regn, mørke,
måleinterval, aflæsningens alder, hul i data.

## Theses

1. Natten er en liste, sorteret. Skærmen er en rangordning af hvad der er tættest på at gå
   galt, med det øverste øverst og resten under. Vagten læser første linje og går ud.
2. Natten er et forløb. Skærmen er otte timer tegnet som ét bånd, og hændelserne sidder på
   båndet hvor de skete. Vagten ser formen på natten og hvor hullerne er.
3. Natten er et sæt instrumenter. Skærmen viser hver måling for sig med sin egen alder, og
   vagten laver rangordningen selv.

## Case for the runner-up

For: 3. Tese 3 er den ærligste. Slusevagten kender slusen bedre end skærmen gør, og en skærm
der rangordner, påstår at den ved hvad der betyder mest lige nu, hvilket den ikke gør: den
har fem tal og ingen ører. Tese 3 lyver ikke, og den er også grunden til at vagten går hele
slusen igennem hver time, for en væg af lige store instrumenter har ikke sorteret noget.
Briefen siger det direkte: en skærm der viser natten ligeligt, har sorteret ingenting.

Så vi bygger tese 1, og vi bygger tese 3's ærlighed ind i den: rangordningen siger hvad den
rangordnede på, hver måling bærer sin alder, og kvittering fjerner ikke problemet. Tese 2
bliver ikke førstepladsen, men den bliver anden læsning, fordi natten har en form, og
radiohullet kan kun ses som et hul i noget der ellers er sammenhængende.

## Built

Built: 1, axis: hvor rangordningen bor, because en vagt der kigger hvert andet minut for at
finde ud af hvad de skal gå ud og se på, skal have svaret i første linje og ikke i en væg af
instrumenter de selv skal sortere; og rangordningen bærer sit eget regnestykke, så den kan
bruges af nogen der er uenig i den.

## Colour

Drenched. Farven er fladen. Vagten sidder i et slusehus klokken to om natten med lyset nede,
og en lys skærm på en anden monitor er en lampe der peger på ansigtet i otte timer.
Materialerne kommer fra det rum, ikke fra en mørk palette:

- slusevand #0f1a1f, kanalvand set ned i om natten under én lampe. Sidens bund.
- kammer #16242b, betonen i kammervæggen under vandlinjen, våd. Fladen bånd og rækker ligger på.
- lygte #dfeae6, lyskeglen fra en arbejdslygte på våd beton, som er et køligt lys og ikke
  et varmt. #e8ece4 stod her først og blev afvist af gaten som 8 enheder fra en creme i
  anti-tell-paletten; materialet blev set på igen i stedet for at skrive en undtagelse.
- messing #c9a227, messingskiltene på portmotorhuset, pudset af hænder. Det der haster.
- tovvaerk #7f8f7a, det grønlige tovværk på pullerterne. Det der er i orden.
- rust #dd7050, rusten på portbeslagene, våd og under lygten. Fejl og afvist. Den tørre
  rust #b4462a stod her først og faldt på 2,91 mod kammerbetonen; kontrakten fandt det før
  der var skrevet en linje kode.
- taage-kant: lygten ved 45 procent, til de streger der adskiller rangordnede poster og
  derfor betyder noget. taage-flade: lygten ved 9 procent, til flader der ikke betyder noget.

Rollerne kommer efter farverne: bund er slusevand, forgrund er lygte, handling er messing,
på handling er slusevand, fokusring er messing, kant er taage-kant ved 45 procent over kammer.

## Type

To roller, to snit, ingen webfont.

- data: "Cascadia Mono", faldende til "Consolas", SF Mono, ui-monospace, monospace. Hvert tal på
  skærmen er en aflæsning der skal sammenlignes med den samme aflæsning ti minutter før, og
  tal der skal sammenlignes lodret, skal stå lodret. Tabulære cifre er hele grunden.
- body: "Segoe UI Variable Text", faldende til "Segoe UI", system-ui, sans-serif. Vagtens eget
  sprog, sat i det skærmen allerede har. Genericitetsrisikoen står i kontrakten og er reel:
  det er den mest almindelige grænsefladeskrift der findes.

Skala 12 / 14 / 16 / 20 / 28 / 44 px. 44 er kun til den ene værdi der afgør hastende.

## Density, motion and boldness

Density 8 af 10: en vagt der kigger hvert andet minut skal have hele skiftet på skærmen på én
gang, og luft mellem rækker er luft der koster en række. Motion 2 af 10: bevægelse
rapporterer kun tilstandsændringer, aldrig scroll, og stopper mens nogen taster. Boldness 6
af 10: én farve råber, resten er våd beton.

## Structure

Øverst båndet: otte timer på tværs, hændelserne siddende hvor de skete, radiohullet tegnet
som et hul. Under båndet den sorterede liste: øverste post i fuld bredde med sin egen
handling ved sig, resten som rækker under. Nederst loggen, nyeste øverst, sluttende ved
22:00. Ingen spalter ved siden af hinanden på 1440: en vagt læser oppefra og ned, og to
spalter er to steder at kigge.

## First screen

Båndet og den øverste post. Båndet viser natten som form, den øverste post siger hvad der er
tættest på at gå galt lige nu og hvad der kan gøres ved det, og der er intet andet i første
skærm. Kl. 03:55 er Nord-motoren på 71 grader, tre under udkobling, og den er ikke kommet
ned; det er nattens øverste post.

## Imagery treatment

Ingen billeder. Båndet, portvinklerne og hullet i data er SVG tegnet her. Portvinkel tegnes
som en vinkel, ikke som en procent: 76 grader mod 83 er et blad der ikke er nået i mål, og
det ligner et blad der ikke er nået i mål.

## Argument order

Formen på natten, det der haster, hvad der kan gøres, hvad der er sket, hvad der mangler.

## Signature

`.baand`: de otte timer af vagten tegnet som ét vandret bånd, hvor hver hændelse sidder på sit
klokkeslæt, sluseslagene er markeret i deres faktiske varighed, og radiohullet fra 02:40 til
02:46 er tegnet som et fysisk hul i båndet med de fire manglende aflæsninger navngivet. Ikke
en graf: et bånd, hvor bredden er tid og hullet er fravær.

## Risk

En rangordnet skærm påstår at den ved hvad der betyder mest, og den har fem tal og ingen
ører. Hvis vagten én gang opdager at skærmen sorterede forkert, holder de op med at læse den
øverste linje, og så er hele skærmen en langsommere version af tese 3.

## Answer to the risk

The risk above is answered by `.hvorfor`, which bærer den sætning der sorterede hver post, med
det tal og den grænse den blev sorteret på. Nord-motoren står øverst fordi 71 er tre grader
under 74, og det står der, med tallet og grænsen. Kvittering flytter posten ned og fjerner den
ikke, og det står også der. Vagten kan se rangordningens regnestykke og være uenig i det uden
at holde op med at bruge skærmen.

## Second reading

`.slag` renders sluseslagenes varighed mod normen, below the first screen, from a different
fact than the signature. Elleve slag med hver sin varighed, den normale cyklus på 11 minutter
sat af som en linje, og slaget kl. 23:14 på 19 minutter stikkende ud over den. Signaturen
læser klokkeslæt og fravær; slagene læser varighed mod en norm.

## The shell

Who: Bjerregaard Sluse, i hovedet, med vagtens tidsrum. Where: en fiktiv kanalsluse, adresse
og mål i foden. Do: kvitter for den øverste post, eller bed om hold på næste slag, begge på
posten selv i .post-top. Fire ankre til skærmens egne afsnit og ét spring-link som første
fokuserbare element.

## Assumptions

Natten den 3. august er faste data i siden, som briefen kræver, så alderen på hver aflæsning
regnes fra et fast referencetidspunkt kl. 04:10, som er hvor skærmen står. Det siges på siden.

## Originality pass

En konsol med lige store kort er den mest reproducerede skærm der findes, og den bygger vi
ikke. Der er ingen kort, ingen ikoner, ingen diagrambiblioteks-palette, og ingen tal uden
alder. Båndet er tegnet fordi natten har en form; hvis samme brief kom igen om en anden
sluse, ville hændelserne ligge andre steder på båndet og skærmen ville se anderledes ud.

## One-offs
- `44px` kun paa den ene vaerdi der afgoer hastende, fordi den ene vaerdi er hele grunden til at skaermen findes

## Deliberate
- `look/no-photograph` briefen leverer ingen fotografier og forbyder at generere dem, og en konsol i et slusehus har intet at fotografere
