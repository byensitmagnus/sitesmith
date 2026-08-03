# Aktiver

Hver tegning på siden står her med hvad den bidrager med, hvor den kommer fra, og hvilken
stand den er i. Rækker uden `ready` er ikke på siden.

| id | hvad | hvor | kilde | licens | stand |
| --- | --- | --- | --- | --- | --- |
| `optik-snit` | Snit gennem 1. ordens Fresnellinsen med lampen på den optiske akse, brændvidden målsat til 920 mm, og kviksølvbadet under. Uden den er første skærm ord på en flade, og de 920 mm er et tal i en sætning i stedet for en afstand man kan se. | `#lyset`, første skærm | Tegnet her, inline SVG i `index.html`, bygget af `.sitesmith/tegn.mjs`. Tegnet i millimeter, 1 brugerenhed = 1 mm. | Originalt arbejde i dette repo | ready |
| `taarn-opstalt` | Tårnet i opstalt med 35 m målsat, koten 57 m over havet ved lyset, og de 154 trin tegnet ét for ét op gennem skakten. Uden den er 154 et tal, og tårnet er slet ikke på siden. | `#besoeg`, under første skærm | Tegnet her, inline SVG i `index.html`, bygget af `.sitesmith/tegn.mjs`. | Originalt arbejde i dette repo | ready |
| `foto-taarnet` | Et fotografi af tårnet udefra. Det er det aktiv siden mangler: en tegning kan vise hvad fyret måler, men ikke hvordan det ser ud, og læseren har set netop den ting. | Ville eje første skærm sammen med kendingen | Skal komme fra kunden. Briefen siger at der ikke findes fotografi. | Afventer kunden | requested |
| `foto-lanternen` | Et fotografi af linsen og kviksølvbadet i lanternerummet. Snittet forklarer maskinen, et fotografi ville vise den. | Ville stå ved siden af snittet | Skal komme fra kunden. | Afventer kunden | requested |

## Skrifter

| id | hvad | hvor | kilde | licens | stand |
| --- | --- | --- | --- | --- | --- |
| `skrift-marcellus` | Marcellus, plade- og overskriftsskriften | Overskrifter, kendingen, de store tal | Google Fonts | SIL Open Font License 1.1 | ready |
| `skrift-archivo` | Archivo, brødskriften med tabulære tal | Al brødtekst, alle værdier, tegningernes påskrifter | Google Fonts | SIL Open Font License 1.1 | ready |

## Ingen fotografi på en side om noget fysisk

`look.md` afsnit 3: en side om et fysisk emne uden et fotografi af emnet er et udkast. Det
er den her. Briefen siger at der ikke findes fotografi, og den siger at alt visuelt skal
være CSS, SVG eller typografi, så siden er bygget sådan. Bestillingen står stadig: de to
`requested`-rækker ovenfor er det, der skal til for at gøre udkastet til en udgivelse.
`gate.mjs` er kørt med `--draft`, og rapporten bærer `draft: yes`.
