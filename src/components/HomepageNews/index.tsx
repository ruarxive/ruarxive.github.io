import React from 'react';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import { formatDate } from '@site/src/utils/format';
import styles from './styles.module.css';

type NewsItem = { date: string; body: string };

/** Renders the inline markdown of a feed entry: links only, emphasis markers are dropped. */
function InlineMarkdown({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const [whole, label, href] = match;
    parts.push(text.slice(last, match.index).replace(/\*\*/g, ''));
    parts.push(
      <Link key={match.index} to={href}>
        {label}
      </Link>,
    );
    last = match.index + whole.length;
  }
  parts.push(text.slice(last).replace(/\*\*/g, ''));
  return <>{parts}</>;
}

export default function HomepageNews(): JSX.Element | null {
  const { items } = usePluginData('homepage-news') as { items: NewsItem[] };
  if (!items.length) return null;

  return (
    <section className={styles.news}>
      <div className="container">
        <h2 className={styles.title}>Последние новости</h2>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.date + item.body} className={styles.item}>
              <time className={styles.date} dateTime={item.date}>
                {formatDate(item.date)}
              </time>
              <span>
                <InlineMarkdown text={item.body} />
              </span>
            </li>
          ))}
        </ul>
        <p>
          <Link to="/kb/news">Все новости</Link> · Оперативно — в Telegram-канале{' '}
          <a href="https://t.me/ruarxive">@ruarxive</a>
        </p>
      </div>
    </section>
  );
}
