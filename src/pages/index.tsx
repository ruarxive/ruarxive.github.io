import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Translate, {translate} from '@docusaurus/Translate';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>  {/*  hero hero--primary */}
      <div className="container">
        {/*<h1 className="hero__title">{siteConfig.title}</h1>*/}
        {/*<p className="hero__subtitle">{siteConfig.tagline}</p>*/}
        <p className="margin-bottom--sm"><strong>{siteConfig.url.replace(/^https?:\/\//, '')}</strong></p>
        <h1 className="hero__title"><Translate>Russian national digital archive</Translate></h1>
        <p className="hero__subtitle"><Translate>Digital born should be digital preserved</Translate></p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/kb/intro">
            <Translate>Knowledge base</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Archive of digital-born websites, data, images, video and other objects">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
