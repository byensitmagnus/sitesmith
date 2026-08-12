import { BookingForm, type BookingValues } from './booking-form'
import { InstrumentDiagram, RaekkeviddeDiagram } from './diagrams'

type SearchParams = Record<string, string | string[] | undefined>

function one(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? '') : (v ?? '')
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const values: BookingValues = {
    navn: one(sp.navn),
    telefon: one(sp.telefon),
    email: one(sp.email),
    adresse: one(sp.adresse),
    postnummer: one(sp.postnummer),
    skadedato: one(sp.skadedato),
    aarsag: one(sp.aarsag),
    kloakvand: one(sp.kloakvand),
    gulvtype: one(sp.gulvtype),
    gulvvarme: one(sp.gulvvarme),
    kvm: one(sp.kvm),
    skadenummer: one(sp.skadenummer),
  }
  const felt = one(sp.felt) || undefined
  const feltbesked = one(sp.feltbesked) || undefined

  return (
    <>
      <a href="#booking-form" className="skip-link">
        Spring til bestillingsformularen
      </a>

      <div className="disclaimer">
        <div className="container">
          <p>
            Damgaard Estrik er opdigtet til en byggeøvelse. Firmanavn, CVR-nummer, adresse,
            medarbejdere, priser, måletal og regler på denne side er ikke virkelige. Intet
            her må bruges som grundlag for en beslutning.
          </p>
        </div>
      </div>

      <header className="site-header">
        <div className="container">
          <a href="#top" className="wordmark">
            Damgaard Estrik
            <small>Udtørring og estrik, Lemvig</small>
          </a>
          <a href="#booking-form" className="cta--book">
            Bestil en fugtgennemgang
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="container">
            <div className="hero-intro">
              <h1 id="hero-heading">
                Vi tørrer gulvet ud efter måling, ikke efter gæt
              </h1>
              <p>
                Fem mand fra Lemvig måler et vandskadet gulv, tørrer det ud og lægger nyt
                afretningslag eller ny estrik, når tallene siger det er tørt. Ingen el, ingen
                VVS, ingen gulvvarmeslanger, ingen skimmelsanering.
              </p>

              <div className="instrument">
                <figure>
                  <InstrumentDiagram />
                  <figcaption className="hint">
                    Kernemåling tages i et borehul, 40 % nede i konstruktionen.
                  </figcaption>
                </figure>
                <dl className="instrument-readout">
                  <div>
                    <dt>Trægulv lægges under</dt>
                    <dd>65 % RF</dd>
                  </div>
                  <div>
                    <dt>Klinker lægges under</dt>
                    <dd>85 % RF</dd>
                  </div>
                  <div>
                    <dt>Cementestrik er tør under</dt>
                    <dd>2,0 CM%</dd>
                  </div>
                  <div>
                    <dt>Måles hver</dt>
                    <dd>7. døgn</dd>
                  </div>
                  <div className="unknown">
                    <dt>Udbredelse i isolering før 1. måling</dt>
                    <dd>ukendt</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="hero-facts">
              <div className="price">
                2.400 kr.
                <small>Fugtgennemgang med kernemåling, ekskl. moms. Fratrækkes ved ordre over 15.000 kr.</small>
              </div>
              <p>
                <strong>Arbejdsområde:</strong> 75 km fra Lemvig. Kørsel koster 14 kr. pr. km
                ud over de første 40 km. Uden for 75 km kører vi slet ikke.
              </p>
              <div>
                <strong>Vi tager ikke opgaven, hvis:</strong>
                <ul className="refusal-list">
                  <li>der er kloakvand eller andet kategori 3-spildevand i konstruktionen</li>
                  <li>der er gulvbelægning eller lim fra før 1990 uden en asbest- og PCB-analyse, som du selv bestiller og betaler</li>
                  <li>der allerede er tre skadesteder i gang, indtil der bliver plads</li>
                </ul>
              </div>
              <a href="#booking-form" className="cta--book">
                Bestil en fugtgennemgang
              </a>
            </div>
          </div>
        </section>

        <section aria-labelledby="booking-heading">
          <div className="container">
            <h2 id="booking-heading" className="section-heading">
              Book en fugtgennemgang
            </h2>
            <p className="measure">
              Vi kommer typisk 3 til 9 hverdage efter en booking. Du får et sagsnummer og en
              bekræftelse på skrift med det samme.
            </p>
            <BookingForm values={values} error={felt ? { felt, feltbesked } : undefined} />
          </div>
        </section>

        <section aria-labelledby="proces-heading">
          <div className="container">
            <h2 id="proces-heading" className="section-heading">
              Hvad der sker, i rækkefølge
            </h2>
            <ol className="proces">
              <li>
                <h3>Book</h3>
                <p>Du udfylder formularen og får et sagsnummer med det samme.</p>
              </li>
              <li>
                <h3>Fugtgennemgang</h3>
                <p>
                  En måletekniker kommer, tager kernemåling i et borehul 40 % nede i
                  konstruktionen, og skriver et overslag.
                </p>
              </li>
              <li>
                <h3>Affugtning sættes op</h3>
                <p>
                  Adsorptions- eller kondensaffugtere og sideblæsere sættes op. Er der behov
                  for sideindblæsning, bores der et hul for hver 1,2 m i sandbæltet.
                </p>
              </li>
              <li>
                <h3>Der måles hver 7. døgn</h3>
                <p>
                  Dato, punkt og værdi skrives ned hver gang. Et forløb tager typisk 18 til
                  45 døgn.
                </p>
              </li>
              <li>
                <h3>Nyt lag lægges</h3>
                <p>
                  Først når måleværdierne er nået, lægges nyt afretningslag, ny cementestrik
                  eller slidlag i flydemørtel.
                </p>
              </li>
            </ol>
            <div className="form-actions" style={{ marginTop: '2.5rem' }}>
              <a href="#booking-form" className="cta--book">
                Bestil en fugtgennemgang
              </a>
            </div>
          </div>
        </section>

        <section aria-labelledby="pris-heading" className="priser">
          <div className="container">
            <h2 id="pris-heading" className="section-heading">
              Priser, ekskl. moms
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="prisliste">
                <caption className="hint">Alle priser er ekskl. moms.</caption>
                <thead>
                  <tr>
                    <th scope="col">Ydelse</th>
                    <th scope="col">Pris ekskl. moms</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Fugtgennemgang med kernemåling i borehul</td>
                    <td>2.400 kr.</td>
                  </tr>
                  <tr>
                    <td>Affugtning, pr. rum pr. døgn</td>
                    <td>285 kr.</td>
                  </tr>
                  <tr>
                    <td>Sideindblæsning i sandbælte, pr. borehul (et hul pr. 1,2 m)</td>
                    <td>620 kr.</td>
                  </tr>
                  <tr>
                    <td>Opbrydning og ny cementestrik, 50–70 mm, pr. m²</td>
                    <td>985 kr.</td>
                  </tr>
                  <tr>
                    <td>Slidlag i flydemørtel, pr. m²</td>
                    <td>420 kr.</td>
                  </tr>
                  <tr>
                    <td>Kontrolmåling undervejs, pr. gang</td>
                    <td>950 kr.</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td>Mindste opgave 12 m²</td>
                    <td>Mindstepris 9.800 kr.</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="price-note">
              Fugtgennemgangens 2.400 kr. fratrækkes ved ordre over 15.000 kr. Foreligger der
              et skadenummer, faktureres forsikringsselskabet direkte. Ellers er betalingen
              privat, 8 dage netto.
            </p>
          </div>
        </section>

        <section aria-labelledby="kapacitet-heading" className="kapacitet">
          <div className="container">
            <h2 id="kapacitet-heading" className="section-heading">
              Udstyr og kapacitet
            </h2>
            <dl>
              <div>
                <dt>Adsorptionsaffugtere</dt>
                <dd>2 stk., 900 m³/t</dd>
              </div>
              <div>
                <dt>Kondensaffugtere</dt>
                <dd>12 stk.</dd>
              </div>
              <div>
                <dt>Sideblæsere</dt>
                <dd>40 stk.</dd>
              </div>
              <div>
                <dt>Samtidige skadesteder</dt>
                <dd>Maks. 3. Er der tre i gang, siger vi nej til det fjerde og oplyser hvornår der bliver plads.</dd>
              </div>
              <div>
                <dt>Strøm</dt>
                <dd>Hver adsorptionsaffugter kræver en dokumenteret 16 A gruppe for sig selv. Kan strømmen ikke dokumenteres, sætter vi ikke maskinen op.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section aria-labelledby="regler-heading" className="regler">
          <div className="container">
            <h2 id="regler-heading" className="section-heading">
              Regler og det vi ikke gør
            </h2>
            <h3>For enhver opgave</h3>
            <ul className="scope-check">
              <li>Vi tørrer ikke et gulv, vi ikke selv har målt først.</li>
              <li>Der skal være adgang til strøm og til rummet i hele forløbet.</li>
              <li>
                Affugtere og blæsere må ikke slukkes undervejs. Bliver de slukket, starter
                forløbet forfra, og døgnprisen løber alligevel.
              </li>
              <li>Der lægges ikke nyt gulv, før måleværdierne er nået, uanset hvad du ønsker.</li>
            </ul>
            <h3>Det vi ikke gør</h3>
            <ul className="refusal-list">
              <li>
                Vi rører ikke skader med kloakvand eller andet kategori 3-spildevand. Den
                opgave henviser vi videre samme dag.
              </li>
              <li>
                Vi rører ikke gulvbelægninger eller lim fra før 1990 uden en analyse for
                asbest og PCB, som du selv bestiller og betaler.
              </li>
              <li>Vi laver ikke skimmelsanering og udtaler os ikke om skimmel.</li>
              <li>
                Vi laver ikke el, VVS eller gulvvarmeslanger, og vi udbedrer ikke utætheden,
                der gav skaden.
              </li>
              <li>
                Vi giver ingen garanti for, at et eksisterende trægulv kan reddes, og tager
                ikke en opgave, hvor betalingen afhænger af, at det lykkes.
              </li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="ukendt-heading" className="ukendt">
          <div className="container">
            <h2 id="ukendt-heading" className="section-heading">
              Det vi ikke ved, før vi har målt
            </h2>
            <ul className="unknowns">
              <li>
                Hvor langt vandet er nået ud i isoleringen eller ind under skillevægge. Første
                måling er også første gang, vi selv ved det.
              </li>
              <li>
                Om der er skimmel. Prøver sendes til laboratorium, som fakturerer dig direkte.
                Vi tolker ikke svaret.
              </li>
              <li>Om forsikringen dækker. Det afgør taksator, ikke os.</li>
              <li>Om et forløb bliver 18 eller 45 døgn.</li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="raekkevidde-heading">
          <div className="container">
            <h2 id="raekkevidde-heading" className="section-heading">
              Hvem vi ikke kører ud til
            </h2>
            <div className="raekkevidde">
              <figure>
                <RaekkeviddeDiagram />
              </figure>
              <div>
                <p className="measure">
                  Vestre Havnevej 11, 7620 Lemvig er udgangspunktet. Inden for 40 km kører vi
                  uden ekstra kørselstillæg. Fra 40 til 75 km lægger vi 14 kr. pr. km oveni.
                  Uden for 75 km kører vi slet ikke, heller ikke mod ekstra betaling.
                </p>
                <p className="measure">
                  Er du i tvivl, så ring 97 00 41 20, mandag til fredag 07:00–14:00.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h3>Kontakt</h3>
              <p>
                Telefon 97 00 41 20
                <br />
                Besvares mandag til fredag 07:00–14:00
              </p>
            </div>
            <div>
              <h3>Adresse</h3>
              <p>
                Vestre Havnevej 11
                <br />
                7620 Lemvig
              </p>
            </div>
            <div>
              <h3>Arbejdstid på pladsen</h3>
              <p>
                Mandag til torsdag 06:30–15:00
                <br />
                Fredag 06:30–12:00
                <br />
                Ingen døgnvagt, ingen weekendvagt.
              </p>
            </div>
            <div>
              <h3>Om firmaet</h3>
              <p>
                Damgaard Estrik ApS
                <br />
                CVR 41 55 08 12, stiftet 2016
                <br />
                Jens Damgaard, ejer, to måleteknikere, to estriklæggere
              </p>
            </div>
          </div>
          <a href="#booking-form" className="cta--book">
            Bestil en fugtgennemgang
          </a>
          <p className="disclaimer-repeat">
            Damgaard Estrik er opdigtet til en byggeøvelse. Firmanavn, CVR-nummer, adresse,
            medarbejdere, priser, måletal og regler på denne side er ikke virkelige. Intet
            her må bruges som grundlag for en beslutning.
          </p>
        </div>
      </footer>
    </>
  )
}
