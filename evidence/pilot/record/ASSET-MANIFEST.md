# Aktiver

Glarmester Nordlys, flade `buy`. Hver tegning der renderes på siden står her med kilde,
licens og tilstand. Tegninger er originalt arbejde i dette repository; der er ikke hentet
et eneste billede udefra, og der er ikke genereret et.

| id | hvad | hvor | kilde | licens | tilstand |
| --- | --- | --- | --- | --- | --- |
| `tegning-baenk` | Målt tegning af skærebænken på 2,4 m med grænsen ved 2.200 mm, og den besøgendes egen rude tegnet ind i samme forhold | `src/pages/index.astro`, første skærm, `svg.baenk` | tegnet her, ren SVG og CSS, ingen ekstern kilde | dette repository, MIT | ready |
| `tegning-uge` | Værkstedets uge tegnet som åbningstid pr. dag, med ordrens skæredage og fragtdage lagt ind | `src/pages/index.astro`, afsnittet Levering, `svg.uge` | tegnet her, ren SVG og CSS, ingen ekstern kilde | dette repository, MIT | ready |
| `tegning-falsmaal` | Snit gennem to falser med ruden imellem, med de 3 mm luft i hver side og de to mål sat af | `src/pages/index.astro`, afsnittet Værkstedet, `svg.falsmaal` | tegnet her, ren SVG og CSS, ingen ekstern kilde | dette repository, MIT | ready |
| `foto-skaerebaenk` | Fotografi af den rigtige skærebænk på Glarmestervej 8, med en rude på, så førsteskærmen viser tingen i stedet for at beskrive den | ikke på siden | skal leveres af værkstedet | mangler | mangler |

## Det manglende aktiv

`look.md` afsnit 3 er en stige, og øverste trin er et fotografi leveret af kunden. Der er
ikke leveret et, og briefen forbyder at generere et, så det er navngivet her og kørslen er
en draft. En tegning er det rigtige svar på et snit, en tidsplan og en måltegning, og det
forkerte svar på en bænk der findes og kunne fotograferes.

Fotografiet skal vise skærebænken i fuld længde med en rude liggende på, taget i
værkstedslys, liggende format, så det kan bære førsteskærmen i stedet for tegningen eller
sammen med den. Indtil det findes, bliver bænken tegnet, og tegningen siger selv at den er
en tegning.

## Skrifter

Ingen skriftfil er hentet eller pakket med. Siden bruger to snit der ligger på maskinen,
Bahnschrift til mål og rubrikker og Sitka Text til brødtekst, med fallback-stakke i
`src/styles/vaerksted.css`. Der er derfor ingen skriftlicens at føre og ingen
netværksanmodning efter en skrift.
