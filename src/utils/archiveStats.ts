import stats from '@site/src/data/archive-stats.json';

const SOURCE_LABELS: Record<string, string> = {
  snapshot: 'Снимок хранилища в ruarxive-db',
  registry: 'Реестр allarchives.csv',
};

export function sourceLabel(kind: string): string {
  return SOURCE_LABELS[kind] ?? kind;
}

/** Years covered by the file lists behind the statistics, e.g. "2023–2025". */
export function sourcesPeriod(): string {
  const years = stats.sources.map((s) => Number(s.date.slice(0, 4)));
  const from = Math.min(...years);
  const to = Math.max(...years);
  return from === to ? String(from) : `${from}–${to}`;
}
