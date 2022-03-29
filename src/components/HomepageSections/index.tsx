import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';

type SectionItem = {
  title: string;
  link: string;
};

const SectionList: SectionItem[] = [
  {
    title: <Translate>Preserved projects & collections</Translate>,
    link: '/kb/preserved-projects-table',
  },
  {
    title: <Translate>Submit project</Translate>,
    link: '/kb/preserved-projects-form',
  },
  {
    title: <Translate>Knowledge base</Translate>,
    link: '/kb/intro',
  },
];

function Section({title, link}: SectionItem) {
  return (
    <div className={clsx('col col--4 margin-bottom--sm')}>
      <div className={styles.sectionsItem}>
        <Link to={link} className="button button--primary button--lg">{title}</Link>
      </div>
    </div>
  );
}

export default function HomepageSections(): JSX.Element {
  return (
    <section className={styles.sections}>
      <div className="container">
        <div className="row">
          {SectionList.map((props, idx) => (
            <Section key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
