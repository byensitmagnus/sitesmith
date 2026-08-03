# Asset manifest, Rold Savværk

Stigen i `look.md` afsnit 3 er klatret oppefra. Trin 1, et fotografi leveret af
savværket, findes ikke. Trin 2, et licenseret fotografi af netop denne plads, findes
heller ikke, og et fotografi af et hvilket som helst andet savværk ville vise et sted,
der ikke er dette. Derfor er alt på siden trin 3, tegnet her, og bygget afleveres som
udkast med `--draft`.

| id | what | where | source | licence | state |
| --- | --- | --- | --- | --- | --- |
| `stak` | Lageret set for enden: fire søjler, én pr. træsort, bygget af de tykkelser sorten ligger i. Hver plankes højde er dens tykkelse i den samme skala for alle fire søjler, og hver ende bærer tykkelsen og fugtprocenten. Uden den er de fire søjler fire tal i en tabel. | `#lager`, første skærm | Tegnet her i CSS, `.stak-gulv` og `.planke`, højden regnet som `calc(var(--t) * var(--mm))` | Originalt arbejde i dette build, MIT | ready |
| `maaling` | Snit af en 27 mm plankeende i otte gange størrelse, med brudt højre kant, en stiplet midterlinje og målerens to spidser gående ned fra fladen til midten. Uden den er "målt i midten" en påstand, læseren ikke kan se. | `#toerring`, venstre kolonne | Inline SVG tegnet her, `svg.maaling` | Originalt arbejde i dette build, MIT | ready |
| `tavle-dage` | Tørretiden talt i streger: 21 dage som tre hele uger, 34 dage som fire uger og seks dage. Uden den er 21 og 34 to tal uden indbyrdes størrelse. | `#toerring`, `.tavle` | Inline SVG tegnet her, `svg.dage` | Originalt arbejde i dette build, MIT | ready |
| `savsnit` | Bundens tekstur: parallelle streger på tværs af siden i den vinkel, en båndsav efterlader. Uden den er bunden en flad farve. | `body`, `repeating-linear-gradient` | Tegnet her i CSS | Originalt arbejde i dette build, MIT | ready |
| `foto-stakken` | Et fotografi af stakken under halvtaget med kridtmærkerne på endetræerne, taget forfra i højde med enderne. Det ville afløse `stak` som det, der ejer den første skærm, og tegningen ville rykke ned som forklaring. | `#lager`, første skærm | Skal tages på pladsen, Røverstuevej 6, og sendes af savværket | Savværkets eget billede, rettighederne skal skrives ned inden brug | mangler, bedt om |
| `foto-kammerdoeren` | Et fotografi af den åbne kammerdør med stakken og strøerne inde i kammeret. Det ville give `#toerring` et sted at stå fysisk. | `#toerring` | Skal tages på pladsen og sendes af savværket | Savværkets eget billede, rettighederne skal skrives ned inden brug | mangler, bedt om |

## Hvad tegningerne ikke gør

Alle fire træsorter er tegnet med det samme par fyldfarver, og der er ikke tegnet årer
eller struktur i nogen af enderne. Tegningerne påstår derfor intet om årer, farve eller
bearbejdning. Kun tykkelsen er målsat, og længde og bredde er skrevet som tal i stedet
for tegnet, fordi kun længden står i briefen.
