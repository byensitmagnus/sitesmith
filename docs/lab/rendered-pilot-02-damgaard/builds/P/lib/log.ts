// No database (brief, Constraints/Stack): a valid booking is appended to a local,
// append-only log file instead. Server-only -- uses node:fs, never imported by a
// Client Component.
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const LOG_DIR = path.join(process.cwd(), "data");
const LOG_FILE = path.join(LOG_DIR, "submissions.log");

export async function logSubmission(entry: Record<string, string>): Promise<void> {
  await mkdir(LOG_DIR, { recursive: true });
  const line = `${JSON.stringify({ at: new Date().toISOString(), ...entry })}\n`;
  await appendFile(LOG_FILE, line, "utf8");
}
