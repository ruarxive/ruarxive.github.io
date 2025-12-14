import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageSections from '@site/src/components/HomepageSections';
import HomepageDonate from '@site/src/components/HomepageDonate';
import HomepageStats from '@site/src/components/HomepageStats';
import HomepageQuickLinks from '@site/src/components/HomepageQuickLinks';
import HomepageContentTypes from '@site/src/components/HomepageContentTypes';
import HomepageHowItWorks from '@site/src/components/HomepageHowItWorks';
import SEO from '@site/src/components/SEO';
import Translate, { translate } from '@docusaurus/Translate';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <p className="margin-bottom--sm"><strong>{siteConfig.organizationName.replace(/^https?:\/\//, '')}</strong></p>
        <h1 className="hero__title"><Translate>Сохранение российского цифрового наследия</Translate></h1>
        <p className="hero__subtitle">
          <Translate>Архивируем сайты, соцсети и цифровые ресурсы до их исчезновения. 15+ инструментов с открытым кодом, 500+ сохранённых проектов.</Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/kb/intro">
            <Translate>Начать</Translate>
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/kb/preserved-projects-table">
            <Translate>Просмотр архивов</Translate>
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/kb/preserved-projects-form">
            <Translate>Предложить проект</Translate>
          </Link>
        </div>
        <p className={styles.heroStats}>
          <Translate>50+ ТБ архивов • 500+ проектов • Открытый код</Translate>
        </p>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const pageDescription = "Архивируем сайты, соцсети и цифровые ресурсы до их исчезновения. 15+ инструментов с открытым кодом, 500+ сохранённых проектов, 50+ ТБ архивов. Национальный цифровой архив России для сохранения российского цифрового наследия.";
  
  return (
    <Layout
      title={`${siteConfig.title}`}
      description={pageDescription}>
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
        <HomepageStats />
        <HomepageQuickLinks />
        <HomepageContentTypes />
        <HomepageFeatures />
        <HomepageHowItWorks />
        <HomepageSections />
        <HomepageDonate />
      </main>
    </Layout>
  );
}
