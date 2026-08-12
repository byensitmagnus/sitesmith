import { mkdir, appendFile } from 'node:fs/promises'
import { join } from 'node:path'

export type Booking = {
  sagsnummer: string
  navn: string
  telefon: string
  email: string
  adresse: string
  postnummer: string
  skadedato: string
  aarsag: string
  kloakvand: string
  gulvtype: string
  gulvvarme: string
  kvm: string
  skadenummer: string
}

const LOG_DIR = join(process.cwd(), 'data')
const LOG_FILE = join(LOG_DIR, 'submissions.log')

// No database, per the brief: a booking is one JSON line appended to a log file.
export async function appendSubmission(booking: Booking): Promise<void> {
  await mkdir(LOG_DIR, { recursive: true })
  const line = JSON.stringify({ ...booking, modtaget: new Date().toISOString() })
  await appendFile(LOG_FILE, `${line}\n`, 'utf8')
}
