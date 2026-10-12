import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import Donate from '@site/src/components/Donate';
import { archiveRequestUrl } from '@site/src/utils/archiveRequest';
import styles from './styles.module.css';

function ArchiveRequestForm() {
  const [url, setUrl] = useState('');
  const [reason, setReason] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    window.open(archiveRequestUrl({ url, reason }), '_blank', 'noopener');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor="archive-request-url">
        Адрес ресурса<span className={styles.required}>*</span>
      </label>
      <input
        id="archive-request-url"
        className={styles.input}
        type="text"
        inputMode="url"
        placeholder="https://example.ru или t.me/channel"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <label className={styles.label} htmlFor="archive-request-reason">
        Почему он ценен и почему может исчезнуть
      </label>
      <textarea
        id="archive-request-reason"
        className={styles.input}
        rows={4}
        placeholder="Например: организацию ликвидируют, сайт закроют в конце месяца"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <button type="submit" className={clsx('button button--primary button--lg', styles.submit)}>
        Продолжить на GitHub
      </button>
      <p className={styles.disclaimer}>
        Откроется публичная форма запроса на GitHub с уже заполненными полями — нужен аккаунт GitHub. Нет
        аккаунта или ресурс может исчезнуть в ближайшие часы — пишите в{' '}
        <a href="https://t.me/ruarxivechat">@ruarxivechat</a>.
      </p>
    </form>
  );
}

export default function HomepageActions(): JSX.Element {
  const brokenLinks = useBrokenLinks();
  ['help', 'request', 'donate'].forEach((id) => brokenLinks.collectAnchor(id));
  return (
    <section id="help" className={styles.actions}>
      <div className="container">
        <h2 className={styles.title}>Чем вы можете помочь</h2>
        <div className="row">
          <div id="request" className={clsx('col col--6', styles.column)}>
            <h3>Сообщить об исчезающем ресурсе</h3>
            <p className={styles.text}>
              Берём в работу ресурсы, которые представляют общественную ценность — даже для небольшой группы
              людей — и могут исчезнуть в ближайшие дни или месяцы.{' '}
              <Link to="/kb/preserved-projects-form">Как мы рассматриваем запросы</Link>
            </p>
            <div className="card padding--md">
              <ArchiveRequestForm />
            </div>
          </div>
          <div id="donate" className={clsx('col col--6', styles.column)}>
            <h3>Поддержать проект</h3>
            <p className={styles.text}>
              Даже небольшое пожертвование позволит Национальному цифровому архиву существовать дольше.
              Пожертвования принимает АНО «Информационная культура».
            </p>
            <Donate />
          </div>
        </div>
        <div className={styles.volunteer}>
          <strong>Хотите помочь делом?</strong> Есть{' '}
          <Link to="/kb/volunteers/volunteers-tasks">задачи для волонтёров</Link>: сбор метаданных, разметка
          архивов, разработка инструментов. Обсуждение — в{' '}
          <a href="https://t.me/ruarxivechat">Telegram-чате</a>, код — на{' '}
          <a href="https://github.com/ruarxive">GitHub</a>.
        </div>
      </div>
    </section>
  );
}
