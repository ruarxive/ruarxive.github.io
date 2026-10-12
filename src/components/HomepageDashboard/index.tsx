import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import stats from '@site/src/data/archive-stats.json';
import {
  COLLECTION_FORMS,
  FILE_FORMS,
  FOLDER_FORMS,
  RECORD_FORMS,
  RESOURCE_FORMS,
  count,
  formatBytes,
  formatDate,
  formatNumber,
  plural,
} from '@site/src/utils/format';
import { sourceLabel, sourcesPeriod } from '@site/src/utils/archiveStats';
import styles from './styles.module.css';

const PUBLIC_PREFIX = 'https://cdn.ruarxive.org/public/';
const FORMAT_COLORS = ['#0078e6', '#00a3a3', '#f2a900', '#7b61ff', '#e5533d', '#9aa5b1'];

function percent(part: number, total: number): string {
  return `${((part / total) * 100).toFixed(1).replace('.', ',')}%`;
}

function Kpi({ value, label }: { value: string; label: string }) {
  return (
    <div className="col col--3">
      <div className={styles.kpi}>
        <div className={styles.kpiValue}>{value}</div>
        <div className={styles.kpiLabel}>{label}</div>
      </div>
    </div>
  );
}

function BarRow({ label, value, share }: { label: React.ReactNode; value: string; share: number }) {
  return (
    <li className={styles.barRow}>
      <span className={styles.barLabel}>{label}</span>
      <span className={styles.barTrack}>
        <span className={styles.barFill} style={{ width: `${Math.max(share * 100, 0.5)}%` }} />
      </span>
      <span className={styles.barValue}>{value}</span>
    </li>
  );
}

function ByYear() {
  const max = Math.max(...stats.byYear.map((y) => y.bytes));
  return (
    <div className={styles.panel}>
      <h3>Объём по годам</h3>
      <ul className={styles.bars}>
        {stats.byYear.map((y) => (
          <BarRow key={y.year} label={y.year} value={formatBytes(y.bytes)} share={y.bytes / max} />
        ))}
      </ul>
      <p className={styles.caption}>
        Год — по дате файла в хранилище (поле <code>date_modified</code>); она не всегда совпадает с датой сбора.
      </p>
    </div>
  );
}

function TopCollections() {
  const max = stats.topCollections[0].bytes;
  return (
    <div className={styles.panel}>
      <h3>Крупнейшие коллекции</h3>
      <ul className={clsx(styles.bars, styles.barsNamed)}>
        {stats.topCollections.map((c) => {
          const title = c.title ?? c.name;
          return (
            <BarRow
              key={c.name}
              label={
                <span title={`Код в хранилище: ${c.name}`}>
                  {c.dir ? <a href={PUBLIC_PREFIX + c.dir}>{title}</a> : title}
                </span>
              }
              value={formatBytes(c.bytes)}
              share={c.bytes / max}
            />
          );
        })}
      </ul>
      <p className={styles.caption}>
        Названия — из каталога ruarxive-db; если коллекция в нём не описана, показан её код в хранилище. Ссылка
        открывает папку коллекции, если все её файлы лежат в одной папке.
      </p>
    </div>
  );
}

function Sources() {
  const { catalog, unknownDirs } = stats;
  const skipped = stats.sources.reduce((sum, s) => sum + s.skippedRows, 0);
  const unknownYears = unknownDirs.map((d) => d.match(/^webcollect(20\d\d)$/)?.[1]).filter(Boolean).sort();
  const unknownPeriod =
    unknownYears.length > 1 ? `${unknownYears[0]}–${unknownYears[unknownYears.length - 1]}` : unknownYears[0];
  return (
    <div className={styles.panel}>
      <h3>Откуда эти цифры</h3>
      <p>
        Для каждой папки хранилища взят самый свежий из известных списков файлов. Поэтому цифры — нижняя оценка
        объёма архива.
      </p>
      <ul className={styles.sources}>
        {stats.sources.map((s) => (
          <li key={s.file}>
            <a href={s.url}>{sourceLabel(s.kind)}</a> на {formatDate(s.date)} — {count(s.dirs.length, FOLDER_FORMS)},{' '}
            {formatBytes(s.bytes)}: <span className={styles.dirs}>{s.dirs.join(', ')}</span>.
          </li>
        ))}
        {unknownDirs.length > 0 && (
          <li>
            Нет списков файлов для {count(unknownDirs.length, FOLDER_FORMS)}:{' '}
            <span className={styles.dirs}>{unknownDirs.join(', ')}</span>
            {unknownPeriod && ` — в том числе для сборов ${unknownPeriod} годов`}. Их объём не учтён.
          </li>
        )}
        {/* Re-check after updating the file lists: as of 13.12.2025 neither list contains this WARC. */}
        <li>
          В известных списках есть не все архивы проекта: например, в них нет основного WARC-архива «Эха Москвы»
          (около 173 ГБ).
        </li>
        {catalog && (
          <li>
            Каталог <a href={catalog.url}>ruarxive-db</a> описывает {count(catalog.collections, COLLECTION_FORMS)} и{' '}
            {count(catalog.records, RECORD_FORMS)}; {formatNumber(catalog.uncatalogued)} из{' '}
            {formatNumber(stats.totals.collections)} коллекций хранилища в нём пока не описаны.
          </li>
        )}
        {skipped > 0 && <li>{formatNumber(skipped)} повреждённых строк в списках не учтены.</li>}
      </ul>
    </div>
  );
}

function Formats() {
  const total = stats.formats.reduce((sum, f) => sum + f.bytes, 0);
  return (
    <div className={styles.panel}>
      <h3>Форматы хранения</h3>
      <div className={styles.stack} role="img" aria-label="Доли форматов в объёме архива">
        {stats.formats.map((f, i) => (
          <span
            key={f.key}
            className={styles.stackPart}
            style={{ width: `${(f.bytes / total) * 100}%`, background: FORMAT_COLORS[i] }}
          />
        ))}
      </div>
      <ul className={styles.legend}>
        {stats.formats.map((f, i) => (
          <li key={f.key}>
            <span className={styles.swatch} style={{ background: FORMAT_COLORS[i] }} />
            {f.label} — {formatBytes(f.bytes)} ({percent(f.bytes, total)})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HomepageDashboard(): JSX.Element {
  const brokenLinks = useBrokenLinks();
  brokenLinks.collectAnchor('stats');
  brokenLinks.collectAnchor('stats-sources');
  const { totals } = stats;
  return (
    <section id="stats" className={styles.dashboard}>
      <div className="container">
        <h2 className={styles.title}>Архив в цифрах</h2>
        <p className={styles.subtitle}>
          По последним известным спискам файлов хранилища ({sourcesPeriod()}). Часть папок и архивов в них не
          попала, поэтому реальный объём больше — подробнее в блоке «<Link to="#stats-sources">Откуда эти цифры</Link>».
        </p>
        <div className={clsx('row', styles.kpis)}>
          <Kpi value={formatBytes(totals.bytes)} label="объём архивов" />
          <Kpi value={formatNumber(totals.files)} label={plural(totals.files, FILE_FORMS)} />
          <Kpi value={formatNumber(totals.domains)} label={plural(totals.domains, RESOURCE_FORMS)} />
          <Kpi value={formatNumber(totals.collections)} label={plural(totals.collections, COLLECTION_FORMS)} />
        </div>
        <div className="row">
          <div className="col col--6">
            <ByYear />
          </div>
          <div className="col col--6">
            <TopCollections />
          </div>
        </div>
        <Formats />
        <div id="stats-sources" className={styles.anchor}>
          <Sources />
        </div>
        <p className={styles.footnote}>
          Описания проектов — в <Link to="/kb/preserved-projects-table">таблице сохранённых проектов</Link>, цифры
          по отдельным коллекциям с источниками — в <Link to="/kb/resources/stats-snapshot">снимке статистики</Link>.
        </p>
      </div>
    </section>
  );
}
