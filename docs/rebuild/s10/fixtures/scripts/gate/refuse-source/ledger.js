export function pitRow(entry) {
  return { pit: entry.pit, day: entry.day, hide: entry.hide };
}

export function ledger(entries) {
  // rest of the code unchanged
  return entries.map(pitRow);
}

export function summary(entries) {
  ...
}
