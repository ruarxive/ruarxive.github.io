import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

// Figures must come from kb/resources/stats-snapshot.md, with the same sources.
type Collection = {
  title: string;
  period: string;
  description: string;
  link: string;
  sources: { label: string; href: string }[];
};

const COLLECTIONS: Collection[] = [
  {
    title: '«Эхо Москвы»',
    period: '2022',
    description:
      'Сайт радиостанции (около 176 ГБ), медиаархив — около 20 тысяч записей передач (около 465 ГБ), Telegram-канал и сообщество во ВКонтакте.',
    link: '/kb/projects/echomsk',
    sources: [
      { label: '#6', href: 'https://t.me/ruarxive/6' },
      { label: '#16', href: 'https://t.me/ruarxive/16' },
    ],
  },
  {
    title: 'Заблокированные СМИ',
    period: '2022',
    description:
      'Сайты colta.ru, theins.ru, paperpaper.ru, agentura.ru, news.doxajournal.ru — около 100 ГБ; Telegram-канал «Новой газеты» — около 20 ГБ.',
    link: '/kb/projects/russian-smi',
    sources: [
      { label: '#23', href: 'https://t.me/ruarxive/23' },
      { label: '#7', href: 'https://t.me/ruarxive/7' },
    ],
  },
  {
    title: 'Порталы открытых данных',
    period: '2022',
    description:
      '37 государственных порталов, 43 ГБ в сжатом виде; крупнейшие — opendata.mkrf.ru и data.gov.ru.',
    link: '/kb/projects/preserved-government',
    sources: [{ label: '#55', href: 'https://t.me/ruarxive/55' }],
  },
  {
    title: 'Большая российская энциклопедия',
    period: '2024',
    description:
      '224 556 статей bigenc.ru и 82 228 статей old.bigenc.ru, сохранённых после предупреждения о возможном закрытии сайта.',
    link: '/kb/case-studies/russia-resources-disappearing',
    sources: [{ label: '#130', href: 'https://t.me/ruarxive/130' }],
  },
  {
    title: 'Сайты банков',
    period: '2013–2020',
    description: 'Около 300 доменов банков, около 148 ГБ.',
    link: '/kb/case-studies/bank-closures',
    sources: [{ label: 'allarchives.csv', href: 'https://cdn.ruarxive.org/public/allarchives.csv' }],
  },
  {
    title: '«Консервированное государство»',
    period: '2012',
    description: 'Старые версии 88 официальных сайтов, 22 ГБ в сжатом виде.',
    link: '/kb/projects/preserved-government',
    sources: [{ label: 'описание коллекции', href: '/kb/projects/preserved-government' }],
  },
];

function CollectionCard({ title, period, description, link, sources }: Collection) {
  return (
    <div className={clsx('col col--4', styles.column)}>
      <div className={styles.card}>
        <div className={styles.period}>{period}</div>
        <h3 className={styles.cardTitle}>
          <Link to={link}>{title}</Link>
        </h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.sources}>
          Источник:{' '}
          {sources.map((s, i) => (
            <React.Fragment key={s.href}>
              {i > 0 && ', '}
              <Link to={s.href}>{s.label}</Link>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomepageCollections(): JSX.Element {
  return (
    <section className={styles.collections}>
      <div className="container">
        <h2 className={styles.title}>Что мы уже сохранили</h2>
        <p className={styles.subtitle}>
          Несколько коллекций, ради которых проект работает: сайты и каналы, которые закрылись, были
          заблокированы или могли исчезнуть.
        </p>
        <div className="row">
          {COLLECTIONS.map((c) => (
            <CollectionCard key={c.title} {...c} />
          ))}
        </div>
        <p>
          <Link to="/kb/projects">Все проекты</Link> ·{' '}
          <Link to="/kb/case-studies/russia-resources-disappearing">Реестр исчезающих ресурсов</Link>
        </p>
      </div>
    </section>
  );
}
