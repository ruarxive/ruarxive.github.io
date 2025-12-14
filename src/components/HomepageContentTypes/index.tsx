import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Translate from '@docusaurus/Translate';

type ContentTypeItem = {
    title: JSX.Element;
    icon: string;
    description: JSX.Element;
};

const ContentTypeList: ContentTypeItem[] = [
    {
        title: <Translate>Веб-сайты</Translate>,
        icon: '🌐',
        description: <Translate>WARC и WACZ архивы сайтов</Translate>,
    },
    {
        title: <Translate>Telegram-каналы</Translate>,
        icon: '✈️',
        description: <Translate>Полные копии каналов и чатов</Translate>,
    },
    {
        title: <Translate>Социальные сети</Translate>,
        icon: '👥',
        description: <Translate>Instagram, Twitter, VK и другие</Translate>,
    },
    {
        title: <Translate>Видео</Translate>,
        icon: '🎬',
        description: <Translate>YouTube и другие видеоплатформы</Translate>,
    },
    {
        title: <Translate>Госданные</Translate>,
        icon: '🏛️',
        description: <Translate>Открытые государственные данные</Translate>,
    },
    {
        title: <Translate>WordPress-сайты</Translate>,
        icon: '📰',
        description: <Translate>Архивация через API</Translate>,
    },
    {
        title: <Translate>Яндекс.Диск</Translate>,
        icon: '💾',
        description: <Translate>Публичные папки и файлы</Translate>,
    },
    {
        title: <Translate>Экспорт данных</Translate>,
        icon: '📤',
        description: <Translate>Google, Notion, Slack и другие</Translate>,
    },
];

function ContentType({ title, icon, description }: ContentTypeItem) {
    return (
        <div className={clsx('col col--3')}>
            <div className={styles.contentType}>
                <div className={styles.contentTypeIcon}>{icon}</div>
                <h4 className={styles.contentTypeTitle}>{title}</h4>
                <p className={styles.contentTypeDescription}>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageContentTypes(): JSX.Element {
    return (
        <section className={styles.contentTypes}>
            <div className="container">
                <h2 className={styles.sectionTitle}>
                    <Translate>Что мы архивируем</Translate>
                </h2>
                <p className={styles.sectionSubtitle}>
                    <Translate>Широкий спектр цифровых ресурсов в различных форматах</Translate>
                </p>
                <div className="row">
                    {ContentTypeList.map((props, idx) => (
                        <ContentType key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
