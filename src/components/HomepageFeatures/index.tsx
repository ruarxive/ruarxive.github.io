import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Translate, { translate } from '@docusaurus/Translate';

type FeatureItem = {
  title: JSX.Element;
  icon: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: <Translate>Российское наследие</Translate>,
    icon: '🇷🇺',
    description: (
      <Translate>
        Национальный цифровой архив России для сохранения российских и связанных с Россией цифровых ресурсов.
      </Translate>
    ),
  },
  {
    title: <Translate>Цифровые ресурсы</Translate>,
    icon: '💾',
    description: (
      <Translate>
        Собираем сайты, файлы, аккаунты соцсетей, Telegram-каналы и другие цифровые объекты.
      </Translate>
    ),
  },
  {
    title: <Translate>Открытый код</Translate>,
    icon: '⚙️',
    description: (
      <Translate>
        Используем и создаём инструменты с открытым кодом для эффективной цифровой архивации.
      </Translate>
    ),
  },
  {
    title: <Translate>Мульти-форматы</Translate>,
    icon: '📦',
    description: (
      <Translate>
        Поддержка WARC, WACZ, нативных форматов и специализированных архивных файлов.
      </Translate>
    ),
  },
  {
    title: <Translate>15+ инструментов</Translate>,
    icon: '🛠️',
    description: (
      <Translate>
        Специализированные инструменты для различных платформ и типов контента.
      </Translate>
    ),
  },
  {
    title: <Translate>Долгосрочное хранение</Translate>,
    icon: '🔒',
    description: (
      <Translate>
        Двойное хранение: облачное и офлайн, для максимальной надёжности.
      </Translate>
    ),
  },
];

function Feature({ title, icon, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.feature}>
        <div className={styles.featureIcon}>{icon}</div>
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
