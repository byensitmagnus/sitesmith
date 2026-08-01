# Aktivliste, driftskonsol Nordbo Fjernvarme

Siden er én selvstændig HTML-fil. Den henter to skrifter fra Google Fonts og intet andet
over netværket. Der er ingen billedfiler, ingen inline-tegninger, ingen ikoner og intet
mærke, fordi der ikke findes noget billedmateriale i briefen, og fordi en intern
driftskonsol ikke har brug for at skaffe noget. Alt synligt er tekst, streger og farvefelter.

| id | hvad | hvor | kilde | licens | tilstand |
| --- | --- | --- | --- | --- | --- |
| `ingen-billeder` | Ingen billedfiler og ingen inline-tegninger på siden. Beslutningen står i `.sitesmith/direction.md` under Imagery treatment. | hele siden | egen beslutning i denne build | ikke relevant, intet materiale distribueres | ready |
| `papirlinjer` | Den linjerede baggrund bag vagtjournalen. En `repeating-linear-gradient` i CSS, tre linjer kode, ingen fil. | `.journal` | egen CSS i `index.html` | ikke relevant, ren CSS | ready |
| `skrift-zilla-slab` | Displayskriften til sidetitel og blokoverskrifter. | `--formular` | Google Fonts | SIL Open Font License 1.1 | ready |
| `skrift-archivo-narrow` | Brødskriften til aflæsninger, etiketter, journallinjer og betjeningselementer. | `--kolonne` | Google Fonts | SIL Open Font License 1.1 | ready |

## Noter

- Ingen af rækkerne peger på en fil i denne mappe, fordi der ikke ligger nogen. Byg altså
  ikke videre på en antagelse om et `assets/`-katalog. Det findes ikke.
- Skrifterne indlæses fra `fonts.googleapis.com`. Uden netværk falder siden tilbage på
  Georgia for display og Arial Narrow for brødtekst, og layoutet holder, fordi hver
  talkolonne også er højrestillet i en fast bredde og ikke er afhængig af tabulartal.
- Der optræder intet fremmed mærke, intet kundenavn og intet certifikat nogen steder på
  siden, så der er ingen tredjepartsrettighed at redegøre for.
