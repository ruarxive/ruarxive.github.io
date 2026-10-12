import React, { useMemo, useState } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import stats from '@site/src/data/archive-stats.json';
import { FILE_FORMS, RESOURCE_FORMS, count, formatBytes, formatDate, formatNumber } from '@site/src/utils/format';
import { archiveRequestUrl, normalizeDomain } from '@site/src/utils/archiveRequest';
import { sourceLabel, sourcesPeriod } from '@site/src/utils/archiveStats';
import styles from './styles.module.css';

// [collection, dir, files, bytes, firstDate, lastDate] — resources.json schema in ruarxive-db/docs/SITE_EXPORT.md
type CollectionRow = [string, string, number, number, string, string];
type DomainRow = [string, CollectionRow[]];
type DomainIndex = {
  publicPrefix: string;
  collectionNames: Record<string, string>;
  domains: DomainRow[];
};

const MIN_QUERY_LENGTH = 3;
const MAX_RESULTS = 10;

function rank(domain: string, needle: string): number {
  if (domain === needle) return 0;
  if (domain.endsWith(`.${needle}`)) return 1;
  if (domain.startsWith(needle)) return 2;
  return 3;
}

function DateRange({ first, last }: { first: string; last: string }) {
  return <>{first === last ? formatDate(first) : `${formatDate(first)} — ${formatDate(last)}`}</>;
}

function Result({ domain, rows, index }: { domain: string; rows: CollectionRow[]; index: DomainIndex }) {
  return (
    <li className={styles.result}>
      <div className={styles.resultDomain}>{domain}</div>
      <ul className={styles.resultCollections}>
        {rows.map(([collection, dir, files, bytes, first, last]) => (
          <li key={collection}>
            {index.collectionNames[collection] && <>{index.collectionNames[collection]} </>}
            <code>{collection}</code> · {count(files, FILE_FORMS)} · {formatBytes(bytes)} ·{' '}
            <DateRange first={first} last={last} />
            {dir && (
              <>
                {' '}
                · <a href={index.publicPrefix + dir}>открыть папку</a>
              </>
            )}
          </li>
        ))}
      </ul>
    </li>
  );
}

export default function HomepageSearch(): JSX.Element {
  useBrokenLinks().collectAnchor('search');
  const indexUrl = useBaseUrl('/data/archive-domains.json');
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<DomainIndex | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  function loadIndex() {
    if (status === 'loading' || status === 'ready') return;
    setStatus('loading');
    fetch(indexUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: DomainIndex) => {
        setIndex(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }

  const needle = normalizeDomain(query);
  const matches = useMemo(() => {
    if (!index || needle.length < MIN_QUERY_LENGTH) return [];
    return index.domains
      .filter(([domain]) => domain.includes(needle))
      .sort((a, b) => rank(a[0], needle) - rank(b[0], needle) || a[0].localeCompare(b[0]));
  }, [index, needle]);

  const showResults = status === 'ready' && needle.length >= MIN_QUERY_LENGTH;

  return (
    <section id="search" className={styles.search}>
      <div className="container">
        <h2 className={styles.title}>Есть ли сайт в архиве?</h2>
        <p className={styles.subtitle}>
          Поиск по спискам файлов хранилища Ruarxive ({sourcesPeriod()}): {count(stats.totals.domains, RESOURCE_FORMS)},{' '}
          {count(stats.totals.files, FILE_FORMS)}. Списки неполные — в них нет части архивов, в том числе
          собранных в последние годы (<Link to="#stats">подробнее</Link>).
        </p>
        <form className={styles.form} role="search" onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            className={styles.input}
            placeholder="Например, echo.msk.ru или sledcom.ru"
            aria-label="Домен сайта"
            value={query}
            onFocus={loadIndex}
            onChange={(e) => {
              loadIndex();
              setQuery(e.target.value);
            }}
          />
        </form>

        <div className={styles.output} aria-live="polite">
          {status === 'loading' && needle && <p className={styles.note}>Загружаем список ресурсов…</p>}
          {status === 'error' && (
            <p className={styles.note}>
              Не удалось загрузить список ресурсов. Исходные данные:{' '}
              {stats.sources.map((s, i) => (
                <React.Fragment key={s.file}>
                  {i > 0 && ', '}
                  <a href={s.url}>{sourceLabel(s.kind)}</a>
                </React.Fragment>
              ))}
              .
            </p>
          )}
          {showResults && matches.length > 0 && index && (
            <>
              <ul className={styles.results}>
                {matches.slice(0, MAX_RESULTS).map(([domain, rows]) => (
                  <Result key={domain} domain={domain} rows={rows} index={index} />
                ))}
              </ul>
              <p className={styles.note}>
                {matches.length > MAX_RESULTS &&
                  `Показаны ${MAX_RESULTS} из ${formatNumber(matches.length)} совпадений — уточните запрос. `}
                Слева — коллекция и её код в хранилище, справа — даты файлов. Как открыть скачанный WARC —{' '}
                <Link to="/kb/users/open-warc">в инструкции</Link>.
              </p>
            </>
          )}
          {showResults && matches.length === 0 && (
            <p className={styles.note}>
              В известных списках файлов ресурса <strong>{needle}</strong> нет. Списки неполные: ресурс мог быть
              сохранён в неучтённых папках или другими архивами — проверьте{' '}
              <a href={`https://web.archive.org/web/*/${needle}`}>Internet Archive</a>. Если сайт под угрозой,{' '}
              <a href={archiveRequestUrl({ url: query })} target="_blank" rel="noreferrer">
                отправьте запрос на архивацию
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
