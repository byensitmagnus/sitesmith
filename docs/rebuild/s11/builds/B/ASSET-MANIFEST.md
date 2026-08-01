# Aktivliste, driftskonsol for Nordbo Fjernvarme

Siden viser hverken fotografier, ikoner, logoer eller streg-illustrationer. Der findes
ingen `<img>` og ingen `<svg>` i `index.html`. Alt visuelt er skrift, streger og flader.
Det tegnede er instrumentet selv, og det er sat med CSS. Nedenfor står hver af de ting, der
faktisk bliver tegnet på skærmen, og hvor de kommer fra.

| id | hvad | hvor | kilde | licens | tilstand |
| --- | --- | --- | --- | --- | --- |
| rudenet | Den vandrette linjering på skriverpapiret, tegnet som repeating-linear-gradient hver 60. pixel | `.felt` i vandskalaen, trykskalaen og alderskalaen | Egen CSS i `index.html` | Ejet af dette projekt | ready |
| lodrette-delestreger | Delestregerne under akseværdierne, tegnet som positionerede kasser på 1 pixel | `.lodret` i alle tre skalaer | Egen CSS og JavaScript i `index.html` | Ejet af dette projekt | ready |
| graenselinjer | De trykte grænser: 45 grader i vandskalaen, 0,30 og 0,90 bar i trykskalaen, 20 minutter i alderskalaen | `.graenselinje` | Egen CSS i `index.html`, værdierne kommer fra briefen | Ejet af dette projekt | ready |
| trykbaand | Det accepterede bånd 0,30 til 0,90 bar, tegnet som en flade i papirets margenfarve | `.baand` i trykskalaen | Egen CSS i `index.html` | Ejet af dette projekt | ready |
| vandspaend | De 61 vandrette bjælker fra retur til fremløb med en tyk ende i den kolde side | `.spaend` og `.kold` i vandskalaen | Egen CSS og JavaScript i `index.html` | Ejet af dette projekt | ready |
| rytter | De 61 lodrette mærker på trykskalaen og på alderskalaen | `.rytter` | Egen CSS og JavaScript i `index.html` | Ejet af dette projekt | ready |
| martian-mono | Skriften til titel, overskrifter, enheder og grænsetal | `--skrift-vis` | Google Fonts, tegnet af Evil Martian | SIL Open Font License 1.1 | ready |
| ibm-plex-sans | Skriften til brødtekst, tal, tabeller og kontroller | `--skrift-brod` | Google Fonts, tegnet af Bold Monday for IBM | SIL Open Font License 1.1 | ready |

## Det der ikke findes

Ingen mærker fra andre virksomheder, ingen certifikater, ingen portrætter af de tre montører
og intet kortmateriale over ledningsnettet. Briefen leverer ingen af delene, så siden viser
ingen af delene. Der er heller ikke sat en plads af til dem.
