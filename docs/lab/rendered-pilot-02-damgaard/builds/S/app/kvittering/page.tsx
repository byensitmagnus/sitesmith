import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kvittering · Damgaard Estrik',
}

export default function Kvittering() {
  return (
    <>
      <a href="#kvittering-indhold" className="skip-link">
        Spring til kvitteringen
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
          <a href="/" className="wordmark">
            Damgaard Estrik
            <small>Udtørring og estrik, Lemvig</small>
          </a>
        </div>
      </header>

      <main id="kvittering-indhold">
        <section aria-labelledby="kvittering-heading">
          <div className="container">
            <h1 id="kvittering-heading">Din fugtgennemgang er booket</h1>
            <div className="kvittering-kort">
              <p className="sagsnummer">
                <span className="mark" aria-hidden="true" /> Sagsnummer DE-2026-0318
              </p>
              <dl className="instrument-readout">
                <li>
                  <dt>Pris</dt>
                  <dd>2.400 kr. ekskl. moms</dd>
                </li>
                <li>
                  <dt>Fratrækkes ved ordre over</dt>
                  <dd>15.000 kr.</dd>
                </li>
                <li>
                  <dt>Vi kommer</dt>
                  <dd>3 til 9 hverdage frem</dd>
                </li>
                <li>
                  <dt>Målemetode</dt>
                  <dd>Kernemåling i borehul</dd>
                </li>
              </dl>
              <p className="measure">
                Indtil vi kommer: luk for vandet hvis det stadig løber, flyt løsøre op fra
                gulvet, tag billeder til din forsikring. Lad være med at lægge nyt gulv, lad
                være med at skrue varmen i vejret, og lad være med at lukke rummet helt af.
              </p>
              <p className="measure">
                Spørgsmål? Ring 97 00 41 20, mandag til fredag 07:00–14:00.
              </p>
              <a href="/" className="cta--book">
                Til forsiden
              </a>
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
          </div>
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
