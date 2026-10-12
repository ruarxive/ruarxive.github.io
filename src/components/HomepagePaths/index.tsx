import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type Path = {
  title: string;
  description: string;
  links: { label: string; to: string }[];
};

const PATHS: Path[] = [
  {
    title: 'Сохранить сайт самостоятельно',
    description: 'Когда ресурс нужно сохранить прямо сейчас.',
    links: [
      { label: 'Быстрый старт за 5 минут', to: '/kb/guides/quick-start-5min' },
      { label: 'Срочная архивация', to: '/kb/guides/emergency-archiving' },
      { label: 'Как сделать копию сайта', to: '/kb/instruments/howto-collect/make-copy-website' },
      { label: 'Каталог инструментов', to: '/kb/instruments' },
    ],
  },
  {
    title: 'Работать с веб-архивами',
    description: 'Открыть, изучить и процитировать скачанный архив.',
    links: [
      { label: 'Как открыть WARC', to: '/kb/users/open-warc' },
      { label: 'Что внутри WARC', to: '/kb/users/inspect-warc' },
      { label: 'Большие WARC-файлы', to: '/kb/users/large-warc' },
      { label: 'Как цитировать архивы', to: '/kb/users/citation' },
    ],
  },
  {
    title: 'Сохранить свои данные',
    description: 'Выгрузки из сервисов, Telegram и соцсетей.',
    links: [
      { label: 'Выгрузка данных из сервисов', to: '/kb/instruments/data-take-out/data-take-out-main' },
      { label: 'Архивация Telegram (tgarc)', to: '/kb/instruments/ruarxive-tools/tgarc' },
      { label: 'Социальные сети', to: '/kb/instruments/social-media' },
    ],
  },
  {
    title: 'Разобраться в теме',
    description: 'Для студентов, исследователей и новичков.',
    links: [
      { label: 'Курс по цифровой архивации', to: '/kb/course' },
      { label: 'Глоссарий', to: '/kb/glossary' },
      { label: 'Частые вопросы', to: '/kb/faq' },
      { label: 'Похожие проекты в мире', to: '/kb/similar' },
    ],
  },
];

export default function HomepagePaths(): JSX.Element {
  return (
    <section className={styles.paths}>
      <div className="container">
        <h2 className={styles.title}>База знаний</h2>
        <p className={styles.subtitle}>
          Руководства по инструментам и методам цифровой архивации — <Link to="/kb/intro">начать с обзора</Link>.
        </p>
        <div className="row">
          {PATHS.map((p) => (
            <div key={p.title} className={clsx('col col--3', styles.column)}>
              <h3 className={styles.pathTitle}>{p.title}</h3>
              <p className={styles.description}>{p.description}</p>
              <ul className={styles.links}>
                {p.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
