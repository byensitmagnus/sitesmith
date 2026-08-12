// Is a Danish postnummer within Damgaard Estrik's 75 km service radius from Lemvig?
//
// There is no postnummer/coordinate dataset bundled here and no geocoding service is
// called (the brief allows no third-party scripts and this is a fictional exercise, not
// a licensed data purchase). Instead: a small table of real coordinates for postnumre
// spread across Denmark, and an arbitrary input is matched to its nearest neighbour by
// postnummer number. Danish postnumre were assigned regionally in ascending order from
// Copenhagen outward, so "nearest number" is a genuine, if coarse, proxy for "nearest
// place" — accurate near a table entry, weakest exactly at a regional boundary.
//
// ponytail: this is an approximation, not a geocoder. Ceiling: wrong by one region at a
// boundary postnummer. Upgrade path: a real postnummer/kommune dataset (e.g. Danmarks
// Adresser) or a geocoding call, if this ever has to be right for money rather than for
// a construction exercise.

const LEMVIG = { postnummer: '7620', lat: 56.5453, lon: 8.3078 }

type Ref = { postnummer: string; by: string; lat: number; lon: number }

// Spread across every Danish region, weighted toward the north-west where the 75 km
// boundary from Lemvig actually falls.
const REFERENCE: Ref[] = [
  { postnummer: '7620', by: 'Lemvig', lat: 56.5453, lon: 8.3078 },
  { postnummer: '7600', by: 'Struer', lat: 56.4897, lon: 8.5942 },
  { postnummer: '7500', by: 'Holstebro', lat: 56.3572, lon: 8.6156 },
  { postnummer: '7400', by: 'Herning', lat: 56.1362, lon: 8.9735 },
  { postnummer: '6950', by: 'Ringkøbing', lat: 56.0894, lon: 8.2453 },
  { postnummer: '7800', by: 'Skive', lat: 56.5686, lon: 9.0295 },
  { postnummer: '7700', by: 'Thisted', lat: 56.9573, lon: 8.6926 },
  { postnummer: '7900', by: 'Nykøbing Mors', lat: 56.7952, lon: 8.8517 },
  { postnummer: '8800', by: 'Viborg', lat: 56.4515, lon: 9.4020 },
  { postnummer: '8600', by: 'Silkeborg', lat: 56.1697, lon: 9.5451 },
  { postnummer: '8000', by: 'Aarhus C', lat: 56.1629, lon: 10.2039 },
  { postnummer: '8700', by: 'Horsens', lat: 55.8607, lon: 9.8503 },
  { postnummer: '8900', by: 'Randers', lat: 56.4607, lon: 10.0364 },
  { postnummer: '9000', by: 'Aalborg', lat: 57.0488, lon: 9.9217 },
  { postnummer: '9700', by: 'Brønderslev', lat: 57.2688, lon: 9.9425 },
  { postnummer: '9800', by: 'Hjørring', lat: 57.4649, lon: 9.9800 },
  { postnummer: '9900', by: 'Frederikshavn', lat: 57.4407, lon: 10.5340 },
  { postnummer: '7100', by: 'Vejle', lat: 55.7058, lon: 9.5364 },
  { postnummer: '6000', by: 'Kolding', lat: 55.4904, lon: 9.4721 },
  { postnummer: '6700', by: 'Esbjerg', lat: 55.4765, lon: 8.4594 },
  { postnummer: '6800', by: 'Varde', lat: 55.6214, lon: 8.4809 },
  { postnummer: '6900', by: 'Skjern', lat: 55.9486, lon: 8.4936 },
  { postnummer: '6100', by: 'Haderslev', lat: 55.2519, lon: 9.4894 },
  { postnummer: '6200', by: 'Aabenraa', lat: 55.0442, lon: 9.4165 },
  { postnummer: '6400', by: 'Sønderborg', lat: 54.9092, lon: 9.7897 },
  { postnummer: '5000', by: 'Odense C', lat: 55.4038, lon: 10.4024 },
  { postnummer: '4000', by: 'Roskilde', lat: 55.6415, lon: 12.0803 },
  { postnummer: '3700', by: 'Rønne', lat: 55.1000, lon: 14.7000 },
  { postnummer: '2200', by: 'København N', lat: 55.7008, lon: 12.5527 },
  { postnummer: '1000', by: 'København K', lat: 55.6761, lon: 12.5683 },
]

function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(s))
}

export function isValidPostnummerFormat(value: string): boolean {
  return /^\d{4}$/.test(value.trim()) && Number(value) >= 1000 && Number(value) <= 9990
}

function nearestReference(postnummer: string): Ref {
  const n = Number(postnummer)
  return REFERENCE.reduce((best, ref) =>
    Math.abs(Number(ref.postnummer) - n) < Math.abs(Number(best.postnummer) - n) ? ref : best,
  )
}

export function distanceFromLemvigKm(postnummer: string): number {
  const exact = REFERENCE.find((r) => r.postnummer === postnummer.trim())
  const ref = exact ?? nearestReference(postnummer.trim())
  return Math.round(haversineKm(LEMVIG, ref))
}

export function isWithinServiceArea(postnummer: string): boolean {
  return distanceFromLemvigKm(postnummer) <= 75
}

// The brief pins the exact wording for exactly one postnummer, 2200. Every other
// out-of-area postnummer gets the same sentence without a city name attached, because a
// nearest-match approximation is not a fact this page states as true.
export function outOfAreaMessage(postnummer: string): string {
  if (postnummer.trim() === '2200') {
    return '2200 København N ligger uden for de 75 km fra Lemvig. Vi kører ikke derover, heller ikke mod ekstra kørsel. Ring 97 00 41 20 mandag til fredag 07:00–14:00, så siger vi hvem der dækker området.'
  }
  return `${postnummer.trim()} ligger uden for de 75 km fra Lemvig. Vi kører ikke derover, heller ikke mod ekstra kørsel. Ring 97 00 41 20 mandag til fredag 07:00–14:00, så siger vi hvem der dækker området.`
}
