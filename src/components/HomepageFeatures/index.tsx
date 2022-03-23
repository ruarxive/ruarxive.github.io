import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Russia and Russian related',
    Svg: require('@site/static/img/flag-rf.svg').default,
    description: (
      <>
       Russian national digital archive created to preserve Russian and Russia related digital resources.
      </>
    ),
  },
  {
    title: 'Digital born',
    Svg: require('@site/static/img/preservation.svg').default,
    description: (
      <>
        We collect websites, individual files, social networks accounts, telegram channels and other digital-born objects.
      </>
    ),
  },
  {
    title: 'Open source',
    Svg: require('@site/static/img/osi.svg').default,
    description: (
      <>
        We use and create open source tools to make digital preservation effective.
      </>
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
