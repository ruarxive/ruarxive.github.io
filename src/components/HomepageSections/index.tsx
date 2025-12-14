import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';

type SectionItem = {
  title: JSX.Element;
  link: string;
  icon: string;
  description: JSX.Element;
};

const SectionList: SectionItem[] = [
  {
    title: <Translate>Сохранённые проекты</Translate>,
    link: '/kb/preserved-projects-table',
    icon: '📚',
    description: <Translate>Просмотрите каталог из 500+ архивированных проектов</Translate>,
  },
  {
    title: <Translate>Предложить проект</Translate>,
    link: '/kb/preserved-projects-form',
    icon: '📝',
    description: <Translate>Сообщите нам о ресурсе, который нужно сохранить</Translate>,
  },
  {
    title: <Translate>База знаний</Translate>,
    link: '/kb/intro',
    icon: '📖',
    description: <Translate>Руководства по инструментам и методам цифровой архивации</Translate>,
  },
];

function Section({ title, link, icon, description }: SectionItem) {
  return (
    <div className={clsx('col col--4 margin-bottom--lg')}>
      <div className={styles.sectionsItem}>
        <div className={styles.sectionIcon}>{icon}</div>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <p className={styles.sectionDescription}>{description}</p>
        <Link to={link} className="button button--primary button--lg">
          <Translate>Перейти</Translate>
        </Link>
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
