import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageSearch from '@site/src/components/HomepageSearch';
import HomepageActions from '@site/src/components/HomepageActions';
import HomepageDashboard from '@site/src/components/HomepageDashboard';
import HomepageCollections from '@site/src/components/HomepageCollections';
import HomepageHowItWorks from '@site/src/components/HomepageHowItWorks';
import HomepageNews from '@site/src/components/HomepageNews';
import HomepagePaths from '@site/src/components/HomepagePaths';
import SEO from '@site/src/components/SEO';
import stats from '@site/src/data/archive-stats.json';
import { COLLECTION_FORMS, RESOURCE_FORMS, count, formatBytes } from '@site/src/utils/format';
import { sourcesPeriod } from '@site/src/utils/archiveStats';

const pageDescription =
  'Национальный цифровой архив России: сохраняем сайты, Telegram-каналы, соцсети и открытые данные, которым грозит исчезновение, и делаем архивы открытыми. Поиск по архиву, запрос на архивацию, база знаний по веб-архивации.';

function HomepageHeader() {
  const { totals } = stats;
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <p className="margin-bottom--sm">
          <strong>ruarxive</strong>
        </p>
        <h1 className="hero__title">Сохранение российского цифрового наследия</h1>
        <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
          Сохраняем сайты, Telegram-каналы, соцсети и данные, которым грозит исчезновение, — и делаем архивы
          открытыми. Проект АНО «Информационная культура».
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="#request">
            Сообщить об исчезающем ресурсе
          </Link>
          <Link className="button button--secondary button--lg" to="#donate">
            Поддержать проект
          </Link>
          <Link className="button button--outline button--primary button--lg" to="#search">
            Найти в архиве
          </Link>
        </div>
        <p className={styles.heroStats}>
          <Link to="#stats">
            {formatBytes(totals.bytes)} • {count(totals.domains, RESOURCE_FORMS)} •{' '}
            {count(totals.collections, COLLECTION_FORMS)}
          </Link>{' '}
          — по последним известным спискам файлов хранилища ({sourcesPeriod()}), часть папок не учтена
        </p>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={siteConfig.title} description={pageDescription}>
      <SEO
        title="Ruarxive - Национальный цифровой архив России | Сохранение цифрового наследия"
        description={pageDescription}
        image="img/hero.jpg"
        type="website"
        keywords={[
          'цифровой архив России',
          'веб-архивация',
          'сохранение сайтов',
          'архивация telegram',
          'warc формат',
          'цифровое наследие',
        ]}
      />
      <HomepageHeader />
      <main>
        <HomepageSearch />
        <HomepageActions />
        <HomepageDashboard />
        <HomepageCollections />
        <HomepageHowItWorks />
        <HomepageNews />
        <HomepagePaths />
      </main>
    </Layout>
  );
}
