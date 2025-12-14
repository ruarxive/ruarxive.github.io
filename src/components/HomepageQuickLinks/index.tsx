import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';

type QuickLinkItem = {
    title: JSX.Element;
    icon: string;
    link: string;
    description: JSX.Element;
};

const QuickLinkList: QuickLinkItem[] = [
    {
        title: <Translate>Как архивировать сайт</Translate>,
        icon: '🌐',
        link: '/kb/instruments/howto-collect/make-copy-website',
        description: <Translate>Пошаговое руководство по архивации веб-сайтов</Translate>,
    },
    {
        title: <Translate>Формат WARC</Translate>,
        icon: '📦',
        link: '/kb/instruments/file-formats/warc',
        description: <Translate>Всё о формате веб-архивов WARC</Translate>,
    },
    {
        title: <Translate>Архивация Telegram</Translate>,
        icon: '✈️',
        link: '/kb/instruments/ruarxive-tools/tgarc',
        description: <Translate>Инструмент tgarc для сохранения Telegram-каналов</Translate>,
    },
    {
        title: <Translate>Инструменты Ruarxive</Translate>,
        icon: '🛠️',
        link: '/kb/instruments/ruarxive-tools/wparc',
        description: <Translate>Собственные инструменты для архивации</Translate>,
    },
    {
        title: <Translate>Выгрузка данных</Translate>,
        icon: '💾',
        link: '/kb/instruments/data-take-out/data-take-out-main',
        description: <Translate>Как выгружать данные из различных сервисов</Translate>,
    },
    {
        title: <Translate>Идентификация форматов</Translate>,
        icon: '🔍',
        link: '/kb/instruments/file-formats/identification-tools',
        description: <Translate>Инструменты для определения типов файлов</Translate>,
    },
];

function QuickLink({ title, icon, link, description }: QuickLinkItem) {
    return (
        <div className={clsx('col col--4')}>
            <Link to={link} className={styles.quickLink}>
                <div className={styles.quickLinkIcon}>{icon}</div>
                <h3 className={styles.quickLinkTitle}>{title}</h3>
                <p className={styles.quickLinkDescription}>{description}</p>
            </Link>
        </div>
    );
}

export default function HomepageQuickLinks(): JSX.Element {
    return (
        <section className={styles.quickLinks}>
            <div className="container">
                <h2 className={styles.sectionTitle}>
                    <Translate>Популярные разделы</Translate>
                </h2>
                <div className="row">
                    {QuickLinkList.map((props, idx) => (
                        <QuickLink key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
