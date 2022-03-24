import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Translate, {translate} from '@docusaurus/Translate';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: <Translate>Russia and Russian related</Translate>,
    Svg: require('@site/static/img/flag-rf.svg').default,
    description: (
      <Translate>
       Russian national digital archive created to preserve Russian and Russia related digital resources.
      </Translate>
    ),
  },
  {
    title: <Translate>Digital born</Translate>,
    Svg: require('@site/static/img/preservation.svg').default,
    description: (
      <Translate>
        We collect websites, individual files, social networks accounts, telegram channels and other digital-born objects.
      </Translate>
    ),
  },
  {
    title: <Translate>Open source</Translate>,
    Svg: require('@site/static/img/osi.svg').default,
    description: (
      <Translate>
        We use and create open source tools to make digital preservation effective.
      </Translate>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.feature}>
        {/*<div className="padding-horiz--md">*/}
        <div>
          <Svg className={styles.featureSvg} role="img" />
        </div>
        {/*<div className="padding-horiz--md">*/}
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
          {/*<h3><Translate>Russian national digital archive (ruarxive.org)</Translate></h3>*/}
          {/*<p><Translate>Digital born should be digital preserved</Translate></p>*/}
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
