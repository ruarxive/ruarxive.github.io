import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Translate from '@docusaurus/Translate';

type StatItem = {
    value: string;
    label: JSX.Element;
};

const StatList: StatItem[] = [
    {
        value: '500+',
        label: <Translate>Архивированных проектов</Translate>,
    },
    {
        value: '50+ ТБ',
        label: <Translate>Сохранённых данных</Translate>,
    },
    {
        value: '15+',
        label: <Translate>Активных инструментов</Translate>,
    },
    {
        value: '1000+',
        label: <Translate>Участников сообщества</Translate>,
    },
];

function Stat({ value, label }: StatItem) {
    return (
        <div className={clsx('col col--3')}>
            <div className={styles.stat}>
                <div className={styles.statValue}>{value}</div>
                <div className={styles.statLabel}>{label}</div>
            </div>
        </div>
    );
}

export default function HomepageStats(): JSX.Element {
    return (
        <section className={styles.stats}>
            <div className="container">
                <div className="row">
                    {StatList.map((props, idx) => (
                        <Stat key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
